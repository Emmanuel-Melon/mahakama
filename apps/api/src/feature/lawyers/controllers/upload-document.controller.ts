import { Request, Response } from "express";
import { findLawyer } from "../operations/lawyers.find";
import { createLawyerProfileDocument } from "../operations/lawyer-profile-documents.create";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { type User } from "@/feature/users/users.schema";
import { selectLawyerProfileDocumentSchema } from "../lawyers.types";
import { z } from "zod";

const SerializedDocument = {
  type: "lawyer_profile_document",
  attributes: (doc: z.infer<typeof selectLawyerProfileDocumentSchema>) => doc,
};

export const uploadDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as User;

    const lawyer = unwrap(
      await findLawyer("userId", user.id),
      new HttpError(HttpStatus.NOT_FOUND, "No lawyer profile found"),
    );

    const doc = unwrap(
      await createLawyerProfileDocument({
        lawyerProfileId: lawyer.id,
        type: req.body.type,
        fileUrl: req.body.fileUrl,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to upload document",
      ),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: doc as z.infer<typeof selectLawyerProfileDocumentSchema> & {
          id: string;
        },
        type: "single",
        serializerConfig: SerializedDocument,
      },
      { status: HttpStatus.CREATED },
    );
  },
);
