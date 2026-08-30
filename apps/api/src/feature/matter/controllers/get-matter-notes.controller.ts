import { Request, Response } from "express";
import {
  findMatter,
  findMatterNotesByMatter,
} from "../operations/matter.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterNoteSerializer } from "../matter.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getMatterNotesController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const isLawyer = req.user?.role === "lawyer";

    unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found"),
    );

    const result = await findMatterNotesByMatter(matterId);

    const notes = result.data
      .filter((note) => isLawyer || !note.isInternal)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    return sendSuccessResponse(
      req,
      res,
      {
        data: notes,
        type: "collection",
        serializerConfig: MatterNoteSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: notes.length,
        },
      },
    );
  },
);