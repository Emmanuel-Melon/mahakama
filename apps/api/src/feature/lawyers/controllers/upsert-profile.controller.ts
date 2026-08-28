import { Request, Response } from "express";
import { createLawyer } from "../operations/lawyers.create";
import { updateLawyer } from "../operations/lawyers.update";
import { findLawyer } from "../operations/lawyers.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedLawyer } from "../lawyers.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { type User } from "@/feature/users/users.schema";

export const upsertProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const existing = await findLawyer("userId", user.id);

    if (existing.ok) {
      const updated = unwrap(
        await updateLawyer("id", existing.data.id, req.body),
        new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to update lawyer profile",
        ),
      );

      return sendSuccessResponse(
        req,
        res,
        {
          data: { ...updated, id: updated.id.toString() } as typeof updated & {
            id: string;
          },
          type: "single",
          serializerConfig: SerializedLawyer,
        },
        { status: HttpStatus.ACCEPTED },
      );
    }

    const created = unwrap(
      await createLawyer({ ...req.body, userId: user.id }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create lawyer profile",
      ),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: { ...created, id: created.id.toString() } as typeof created & {
          id: string;
        },
        type: "single",
        serializerConfig: SerializedLawyer,
      },
      { status: HttpStatus.CREATED },
    );
  },
);
