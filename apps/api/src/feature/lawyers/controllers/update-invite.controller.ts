import { Request, Response } from "express";
import { updateLawyerInvite } from "../operations/lawyer-invites.update";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { selectLawyerInviteSchema } from "../lawyers.types";
import { z } from "zod";

const SerializedInvite = {
  type: "lawyer_invite",
  attributes: (invite: z.infer<typeof selectLawyerInviteSchema>) => invite,
};

export const updateInviteController = asyncHandler(
  async (req: Request, res: Response) => {
    const inviteId = req.params.inviteId as string;
    const { status } = req.body;

    const invite = unwrap(
      await updateLawyerInvite(inviteId, {
        status,
        ...(status === "accepted" ? { acceptedAt: new Date() } : {}),
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update invite",
      ),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: invite as z.infer<typeof selectLawyerInviteSchema> & {
          id: string;
        },
        type: "single",
        serializerConfig: SerializedInvite,
      },
      { status: HttpStatus.ACCEPTED },
    );
  },
);
