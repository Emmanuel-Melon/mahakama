import type { Request, Response } from "express";

import { AuthJobs } from "../auth.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";
import { findActiveSession } from "./auth.find";
import { revokeSession } from "./auth.update";
import { clearAuthCookie, getCookieOptions } from "../auth.cookies";
import { authQueue } from "../jobs/auth.queue";
import type { UserRole } from "../auth.types";

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

    // Clear role-based authentication cookie using the helper
    const userRole = (req.user?.role as UserRole) || "user";
    clearAuthCookie(res, userRole);

    // Clear refresh token cookie with its specific path
    res.clearCookie(
      "refreshToken",
      getCookieOptions(req, { path: "/api/v1/auth/refresh" }),
    );

    sendSuccessResponse(req, res, undefined, { status: HttpStatus.NO_CONTENT });

    authQueue.add(AuthJobs.LoggedOut, {
      userId: req.user!.id,
      correlationId: req.requestId,
    });
  },
);
