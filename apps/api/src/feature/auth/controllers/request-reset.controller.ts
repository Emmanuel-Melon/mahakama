import type { Request, Response } from "express";

import { findUser } from "@/feature/users/operations/users.find";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { AuthJobs, SerializedResetPassword } from "../auth.config";
import type { ResetPasswordPayload } from "../auth.types";
import { authQueue } from "../jobs/auth.queue";

export const requestResetController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body ?? {};
    const user = await findUser("email", email);

    const responseData: ResetPasswordPayload = {
      message:
        "If an account matches, a recovery link will be dispatched shortly.",
      deliveryEstimate: 60,
    };

    sendSuccessResponse(
      req,
      res,
      {
        data: responseData,
        type: "single",
        serializerConfig: SerializedResetPassword,
      },
      { status: HttpStatus.ACCEPTED },
    );

    if (user.ok && user.data) {
      authQueue.add(AuthJobs.ResetPasswordRequest, {
        email,
        userId: user.data.id,
        correlationId: req.requestId,
      });
    }
  },
);
