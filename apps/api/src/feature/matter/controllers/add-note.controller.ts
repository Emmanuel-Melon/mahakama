import { Request, Response } from "express";
import { findMatter } from "../operations/matter.find";
import { insertMatterNote } from "../operations/matter.insert";
import type { NewMatterNote } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterNoteSerializer } from "../matter.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const addNoteController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const body = req.body as Partial<NewMatterNote>;
    const authorUserId = req.user?.id || body.authorUserId;

    unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found"),
    );

    if (!authorUserId) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Author user ID is required");
    }

    const note = unwrap(
      await insertMatterNote({
        ...body,
        matterId,
        authorUserId,
        content: body.content as string,
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to create matter note"),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...note,
        },
        serializerConfig: MatterNoteSerializer,
        type: "single",
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  },
);
