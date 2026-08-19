import type { Request, Response } from "express";

import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";
import { consumeSecureToken } from "@/service/token-service/operations/tokens.find";
import { updateUserPassword } from "../operations/auth.update";

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body ?? {};

    if (!token || !password) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing required token or password parameters.",
      );
    }

    const secureLink = await consumeSecureToken("LINK", token, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    if (!secureLink || !secureLink.userId) {
      throw new HttpError(
        HttpStatus.GONE,
        "This password reset link is invalid, has expired, or has already been used.",
      );
    }

    const updatedUserResult = await updateUserPassword(
      secureLink.userId,
      password,
    );
    const updatedUser = unwrap(updatedUserResult);

    if (!updatedUser) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update account credentials.",
      );
    }

    sendSuccessResponse(req, res, undefined, { status: HttpStatus.NO_CONTENT });
  },
);
