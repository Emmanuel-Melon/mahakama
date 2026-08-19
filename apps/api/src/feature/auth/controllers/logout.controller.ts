import type { Request, Response } from "express";

import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";

import { AUTH_COOKIES, AuthJobs } from "../auth.config";
import { getCookieOptions } from "../auth.cookies";
import { authQueue } from "../jobs/auth.queue";
import { findActiveSession } from "../operations/auth.find";
import { revokeSession } from "../operations/auth.update";

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "No active user");
    }

    const sessionResult = await findActiveSession("userId", userId);
    if (!sessionResult.data) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "No active session");
    }

    await revokeSession(sessionResult.data.id);

    Object.values(AUTH_COOKIES).forEach((cookieName) => {
      res.clearCookie(cookieName, getCookieOptions(req));
    });

    res.clearCookie(
      "refreshToken",
      getCookieOptions(req, { path: "/api/v1/auth/refresh" }),
    );

    sendSuccessResponse(req, res, undefined, { status: HttpStatus.NO_CONTENT });

    if (req.user) {
      authQueue.add(AuthJobs.LoggedOut, {
        userId: req.user.id,
        email: req.user.email!,
      });
    }
  },
);
