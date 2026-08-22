import type { Request, Response } from "express";

import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";
import { findAuthUser } from "../operations/auth.find";
import { authQueue } from "../jobs/auth.queue";
import { AuthJobs } from "../auth.config";

export const resendVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body ?? {};

    if (!email) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing required email parameter.",
      );
    }

    const user = await findAuthUser("email", email);

    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found");
    }

    sendSuccessResponse(req, res, undefined, { status: HttpStatus.NO_CONTENT });

    await authQueue.add(AuthJobs.GenerateVerificationLink, {
      userId: user?.data?.id || "",
    });
  },
);
