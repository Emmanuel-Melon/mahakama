import { Request, Response } from "express";
import { createLawyerInvite } from "../operations/lawyer-invites.create";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { type User } from "@/feature/users/users.schema";
import { selectLawyerInviteSchema } from "../lawyers.types";
import { z } from "zod";
import crypto from "crypto";

const SerializedInvite = {
  type: "lawyer_invite",
  attributes: (invite: z.infer<typeof selectLawyerInviteSchema>) => invite,
};

export const createInviteController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const { email, expiresAt } = req.body;
    const token = crypto.randomBytes(32).toString("hex");

    const invite = unwrap(
      await createLawyerInvite({
        email,
        invitedBy: user.id,
        token,
        expiresAt: new Date(expiresAt),
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create lawyer invite",
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
      { status: HttpStatus.CREATED },
    );
  },
);
