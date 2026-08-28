import { Request, Response } from "express";
import { findLawyerInvites } from "../operations/lawyer-invites.list";
import { HttpStatus } from "@/lib/http/http.status";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { selectLawyerInviteSchema } from "../lawyers.types";
import { z } from "zod";

const SerializedInvite = {
  type: "lawyer_invite",
  attributes: (invite: z.infer<typeof selectLawyerInviteSchema>) => invite,
};

export const listInvitesController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await findLawyerInvites();

    sendSuccessResponse(
      req,
      res,
      {
        data: result.data,
        type: "collection",
        serializerConfig: SerializedInvite,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
