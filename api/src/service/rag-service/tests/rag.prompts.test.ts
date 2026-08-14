import { describe, it, expect } from "vitest";
import { buildRagChatPrompt } from "../rag.prompts";
import type { RAGContext, ConversationTurn } from "../rag.types";

const context = (overrides: Partial<RAGContext> = {}): RAGContext => ({
  chunks: [
    {
      content: "A person is a citizen by birth...",
      title: "Citizenship by Birth",
      section: "Article 10",
      similarity: 0.95,
    },
    {
      content: "Citizens may retain dual citizenship...",
      title: "Dual Citizenship",
      section: null,
      similarity: 0.88,
    },
  ],
  sources: [],
  ...overrides,
});

describe("buildRagChatPrompt", () => {
  it("includes context with [Title, Section] citations", () => {
    const prompt = buildRagChatPrompt("Who is a citizen by birth?", [], context());

    expect(prompt).toContain("[Citizenship by Birth, Article 10]");
    expect(prompt).toContain("[Dual Citizenship]");
    expect(prompt).toContain("A person is a citizen by birth...");
    expect(prompt).toContain("USER QUESTION:\nWho is a citizen by birth?");
  });

  it("includes trimmed conversation history with role labels", () => {
    const history: ConversationTurn[] = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi, how can I help?" },
    ];

    const prompt = buildRagChatPrompt("Next question", history, context());

    expect(prompt).toContain("User: Hello");
    expect(prompt).toContain("Assistant: Hi, how can I help?");
  });

  it("handles empty history", () => {
    const prompt = buildRagChatPrompt("Question", [], context());

    expect(prompt).toContain("(no prior conversation)");
  });

  it("has an explicit no-context branch when there are no chunks", () => {
    const prompt = buildRagChatPrompt("Question", [], context({ chunks: [] }));

    expect(prompt).toContain("None found for this question");
    expect(prompt).not.toContain("RELEVANT LEGAL CONTEXT:\n[");
  });

  it("instructs against inventing laws and gives a non-legal-advice caveat", () => {
    const prompt = buildRagChatPrompt("Question", [], context());

    expect(prompt.toLowerCase()).toContain("do not invent laws");
    expect(prompt.toLowerCase()).toContain("never give definitive legal advice");
  });
});
