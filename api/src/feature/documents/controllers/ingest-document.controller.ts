import { Request, Response } from "express";
import { createDocument } from "../operations/documents.create";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { uploadFileToBucket } from "@/lib/supabase/storage";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { documentsQueue } from "../jobs/documents.queue";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { DocumentJobs } from "../document.config";

export const ingestDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;
    const {
      bucketName = "legal_documents",
      title,
      description,
      type,
      sections,
    } = req.body;

    if (!file) {
      throw new Error("No file provided");
    }

    // Upload file to bucket (defaults to legal_documents for backward compatibility)
    const uploadResult = await uploadFileToBucket({
      bucketName,
      fileBuffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
    });

    // Create document record
    const document = unwrap(
      await createDocument({
        title: title || file.originalname,
        description: description || "No description",
        type: type || "contract",
        sections: Number(sections) || 1,
        lastUpdated: new Date().getFullYear().toString(),
        storageUrl: uploadResult.publicUrl,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create document",
      ),
    );

    sendSuccessResponse(
      req,
      res,
      {
        data: { ...document, id: document.id.toString() } as typeof document & {
          id: string;
        },
        type: "single",
        serializerConfig: DocumentsSerializer,
      },
      {
        status: HttpStatus.CREATED,
      },
    );

    await documentsQueue.add(DocumentJobs.DocumentUploaded, {
      documentId: document.id,
      userId: req.user?.id!,
    });
  },
);
