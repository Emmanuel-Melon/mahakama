import type { Request, Response } from "express";

import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";
import { logger } from "@/lib/logger";
import { isIpRateLimited } from "@/service/token-service/tokens.limits";
import { consumeSecureToken } from "@/service/token-service/operations/tokens.find";
import { updateUser } from "@/feature/users/operations/users.update";

import { AuthJobs, SerializedStatus } from "../auth.config";
import { authQueue } from "../jobs/auth.queue";
import { findAuthUser } from "../operations/auth.find";

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.body ?? {};
    if (!token || typeof token !== "string") {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Missing verification token");
    }

    const ipAddress = req.ip as string;
    const ipThrottled = await isIpRateLimited(ipAddress || "");
    if (ipThrottled) {
      throw new HttpError(
        HttpStatus.TOO_MANY_REQUESTS,
        "Too many attempts. Try again shortly.",
      );
    }

    const ctx = { ipAddress, userAgent: req.headers["user-agent"] };
    const row = await consumeSecureToken("LINK", token, ctx);

    logger.info({ row }, "Consumed secure link");

    if (!row || !row.userId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Invalid or expired verification link",
      );
    }

    unwrap(
      await updateUser("id", row.userId, { emailVerifiedAt: new Date() }),
      new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to verify email"),
    );

    sendSuccessResponse(
      req,
      res,
      {
        type: "single",
        data: { message: "Email verified successfully" },
        serializerConfig: SerializedStatus,
      },
      { status: HttpStatus.SUCCESS },
    );

    const verifiedUser = await findAuthUser("id", row.userId);
    if (verifiedUser.ok && verifiedUser.data) {
      authQueue.add(AuthJobs.EmailVerified, {
        userId: verifiedUser.data.id!,
        email: verifiedUser.data.email!,
      });
    }
  },
);
