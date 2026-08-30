import { logger } from "@/lib/logger";
import { llmProviderManager } from "@/lib/llm";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";
import { getMessagesByChatId } from "@/feature/messages/operations/messages.list";
import type { ChatMessage } from "@/feature/messages/messages.types";
import {
  findMatter,
  findMatterNotesByMatter,
  findMatterStatusHistoriesByMatter,
} from "../operations/matter.find";
import {
  insertMatter,
  insertMatterStatusHistory,
  recordMatterActivity,
} from "../operations/matter.insert";
import { updateMatter } from "../operations/matter.update";
import type {
  GenerateMatterSummaryPayload,
  LawyerInvitedToMatterPayload,
  MatterFromChatPayload,
  MatterStatusChangedPayload,
} from "../matter.types";
import { matterQueue } from "./matter.queue";
import { MattersJobs } from "../matter.config";
import {
  buildMatterFromChatPrompt,
  buildMatterSummaryPrompt,
  matterExtractionSchema,
  matterSummarySchema,
  MATTER_PROMPT_CONFIG,
  type MatterConversationTurn,
  type MatterExtraction,
  type MatterSummary,
} from "./matter.prompt";

export class MattersJobHandler {
  private static async loadConversationTranscript(
    chatId: string,
  ): Promise<MatterConversationTurn[]> {
    const { data } = await getMessagesByChatId(chatId);
    return data
      .filter(
        (message: ChatMessage) =>
          message.senderType === "user" || message.senderType === "assistant",
      )
      .slice(-MATTER_PROMPT_CONFIG.MAX_TRANSCRIPT_TURNS)
      .map((message: ChatMessage) => ({
        role: message.senderType as "user" | "assistant",
        content: message.content,
      }));
  }

  private static async enqueueSummaryGeneration(matterId: string) {
    try {
      await matterQueue.add(MattersJobs.GenerateMatterSummary, { matterId });
    } catch (error) {
      logger.error(
        { error, matterId },
        "Failed to enqueue matter summary generation job",
      );
    }
  }

  static async handleMatterFromChat(data: MatterFromChatPayload) {
    const { chatId, clientUserId, matterId } = data;

    logger.info(
      { chatId, clientUserId, matterId },
      "Processing matter from chat job",
    );

    const transcript = await this.loadConversationTranscript(chatId);
    if (!transcript.length) {
      logger.warn(
        { chatId },
        "No usable conversation turns for matter-from-chat; skipping",
      );
      return { success: false, chatId, reason: "empty_conversation" };
    }

    const prompt = buildMatterFromChatPrompt(transcript);
    const client = llmProviderManager.getClient();
    const result = await client.generateTextContent<MatterExtraction>(prompt, {
      outputType: "structured",
      responseJsonSchema: matterExtractionSchema,
    });

    const {
      shouldCreateMatter,
      title,
      summary,
      jurisdiction,
      practiceArea,
      urgency,
      keyParties,
      requestedRelief,
    } = result.content;

    if (!shouldCreateMatter || !title) {
      logger.info(
        { chatId, title },
        "LLM determined this conversation does not warrant a matter",
      );
      return { success: false, chatId, reason: "no_matter_warranted" };
    }

    const metadata = {
      source: "chat",
      keyParties,
      requestedRelief: requestedRelief ?? "",
    };

    // When the matter was already created synchronously (e.g. opened from a
    // chat), enrich the existing draft instead of inserting a new record.
    if (matterId) {
      const existing = unwrap(
        await findMatter("id", matterId),
        new HttpError(
          HttpStatus.NOT_FOUND,
          "Matter not found for enrichment from chat",
        ),
      );

      const updated = unwrap(
        await updateMatter("id", existing.id, {
          title,
          summary: summary || null,
          jurisdiction: jurisdiction ?? null,
          practiceArea: practiceArea ?? null,
          urgency: urgency ?? null,
          metadata: { ...existing.metadata, ...metadata },
        }),
        new HttpError(HttpStatus.BAD_REQUEST, "Failed to update matter from chat"),
      );

      // Controller-created matters have no timeline yet; seed it once.
      const history = await findMatterStatusHistoriesByMatter(updated.id);
      if (!history.data.length) {
        unwrap(
          await insertMatterStatusHistory({
            matterId: updated.id,
            toStatus: "draft",
            changedByUserId: clientUserId,
          }),
          new HttpError(
            HttpStatus.BAD_REQUEST,
            "Failed to record matter status history",
          ),
        );
      }

      await this.enqueueSummaryGeneration(updated.id);

      await recordMatterActivity({
        matterId: updated.id,
        actorUserId: clientUserId,
        type: "chat_linked",
        title: "Conversation linked to matter",
        metadata: { chatId },
      });

      return { success: true, matterId: updated.id };
    }

    const matter = unwrap(
      await insertMatter({
        clientUserId,
        sourceChatId: chatId,
        title,
        summary: summary || null,
        jurisdiction: jurisdiction ?? null,
        practiceArea: practiceArea ?? null,
        urgency: urgency ?? null,
        status: "draft",
        metadata,
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to create matter from chat"),
    );

    // Seed the timeline with an initial status entry (matter_created draft).
    unwrap(
      await insertMatterStatusHistory({
        matterId: matter.id,
        toStatus: "draft",
        changedByUserId: clientUserId,
      }),
      new HttpError(
        HttpStatus.BAD_REQUEST,
        "Failed to record matter status history",
      ),
    );

    await this.enqueueSummaryGeneration(matter.id);

    await recordMatterActivity({
      matterId: matter.id,
      actorUserId: clientUserId,
      type: "chat_linked",
      title: "Conversation linked to matter",
      metadata: { chatId },
    });

    return { success: true, matterId: matter.id };
  }

  static async handleGenerateMatterSummary(data: GenerateMatterSummaryPayload) {
    const { matterId } = data;

    logger.info({ matterId }, "Processing generate matter summary job");

    const matter = unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found for summary generation"),
    );

    const transcript = matter.sourceChatId
      ? await this.loadConversationTranscript(matter.sourceChatId)
      : [];

    const notes = await findMatterNotesByMatter(matterId);

    const prompt = buildMatterSummaryPrompt(
      matter,
      transcript,
      notes.data.map((note) => note.content),
    );
    const client = llmProviderManager.getClient();
    const result = await client.generateTextContent<MatterSummary>(prompt, {
      outputType: "structured",
      responseJsonSchema: matterSummarySchema,
    });

    const { summary, updatedTitle } = result.content;

    const currentMetadata = (matter.metadata ?? {}) as Record<string, unknown>;

    const updateData: {
      summary?: string;
      title?: string;
      metadata?: Record<string, unknown>;
    } = {};

    if (summary && summary.trim()) {
      updateData.summary = summary.trim();
    }
    if (updatedTitle && updatedTitle.trim()) {
      updateData.title = updatedTitle.trim();
    }

    // Mark the matter as fully prepared even when the LLM produced no
    // diffs, so client-side "preparing → ready" polling can settle.
    const readyAt = new Date().toISOString();
    if (currentMetadata.readyAt !== readyAt) {
      updateData.metadata = { ...currentMetadata, readyAt };
    }

    if (Object.keys(updateData).length === 0) {
      logger.info(
        { matterId },
        "Summary generation produced no updatable fields; skipping update",
      );
      return { success: true, matterId };
    }

    const updated = unwrap(
      await updateMatter("id", matterId, updateData),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to update matter summary"),
    );

    if (updateData.summary || updateData.title) {
      await recordMatterActivity({
        matterId,
        actorUserId: matter.clientUserId,
        type: "summary_updated",
        title: "Matter summary updated",
        metadata: { chatId: matter.sourceChatId ?? undefined },
      });
    }

    return { success: true, matterId: updated.id };
  }

  static async handleMatterStatusChanged(data: MatterStatusChangedPayload) {
    const { matterId, fromStatus, toStatus, changedByUserId } = data;

    logger.info(
      { matterId, fromStatus, toStatus, changedByUserId },
      "Processing matter status changed job",
    );

    // TODO: Add matter status changed logic here
    // - Notify relevant parties of status change
    // - Trigger any downstream workflows per status

    return { success: true, matterId };
  }

  static async handleLawyerInvitedToMatter(data: LawyerInvitedToMatterPayload) {
    const { matterId, lawyerId, invitedByUserId } = data;

    logger.info(
      { matterId, lawyerId, invitedByUserId },
      "Processing lawyer invited to matter job",
    );

    // TODO: Add lawyer invited to matter logic here
    // - Notify the invited lawyer
    // - Send confirmation to the client

    return { success: true, matterId };
  }
}