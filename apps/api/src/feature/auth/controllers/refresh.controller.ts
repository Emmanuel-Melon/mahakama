import { randomUUID } from "crypto";
import type { Request, Response } from "express";

import { authConfig } from "@/config";
import { findUser } from "@/feature/users/operations/users.find";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";
import { logger } from "@/lib/logger";

import { AuthJobs, SerializedRefreshToken } from "../auth.config";
import { setAuthCookies } from "../auth.cookies";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../auth.tokens";
import type { UserRole } from "../auth.types";
import { authQueue } from "../jobs/auth.queue";
import { findActiveSession } from "../operations/auth.find";
import { insertSession } from "../operations/auth.insert";
import { revokeSession } from "../operations/auth.update";

export const refreshController = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info({ requestId: req.requestId }, "Refreshing token");
    const sessionId = randomUUID();
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Refresh token missing");
    }

    let payload;
    try {
      payload = verifyRefreshToken(
        incomingRefreshToken,
        authConfig.secrets.jwtRefreshSecret,
      );
    } catch {
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        "Invalid or expired refresh token",
      );
    }

    const session = await findActiveSession("id", payload.sid);

    if (
      !session.ok ||
      (session.data && new Date() > new Date(session.data.expiresAt))
    ) {
      if (session.ok && session.data) {
        await revokeSession(session.data.id);
      }
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        "Session is no longer valid",
      );
    }

    if (hashToken(incomingRefreshToken) !== session.data?.refreshTokenHash) {
      await revokeSession(session.data?.id as string);
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Refresh token mismatch");
    }

    await revokeSession(session.data?.id);

    const user = unwrap(
      await findUser("id", session.data.userId),
      new HttpError(HttpStatus.UNAUTHORIZED, "User not found"),
    );

    const token = {
      userId: user!.id,
      sessionId,
      role: user!.role as UserRole,
    };
    const newAccessToken = generateAccessToken(token);
    const newRefreshToken = generateRefreshToken(token);

    const newSession = unwrap(
      await insertSession({
        userId: session.data.userId,
        sessionId,
        refreshToken: newRefreshToken,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create session",
      ),
    );

    setAuthCookies({
      req,
      res,
      userId: user!.id,
      role: user!.role as UserRole,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    sendSuccessResponse(
      req,
      res,
      {
        type: "single",
        data: {
          token: newRefreshToken,
        },
        serializerConfig: SerializedRefreshToken,
      },
      {
        status: HttpStatus.CREATED,
        additionalMeta: {
          accessTokenExpiresIn: 3600,
          refreshTokenExpiresIn: 2592000,
          sessionId: newSession.id,
          userId: session.data.userId,
          issuedAt: new Date().toISOString(),
        },
      },
    );

    if (user) {
      authQueue.add(AuthJobs.RefreshToken, {
        userId: user.id,
        email: user.email!,
      });
    }
  },
);
