import { randomUUID } from "crypto";
import type { Request, Response } from "express";
import { SerializedUser } from "@/feature/users/users.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";

import { AuthJobs } from "../auth.config";
import { setAuthCookies } from "../auth.cookies";
import type { NewAuthUser, UserRole } from "../auth.types";
import { authQueue } from "../jobs/auth.queue";
import { findAuthUser } from "../operations/auth.find";
import { insertSession } from "../operations/auth.insert";
import { signupUser } from "../operations/auth.signup";
import { generateAccessToken, generateRefreshToken } from "../auth.tokens";

export const signupController = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      email,
      name,
      password,
      role = "user",
    } = req.validated.body as NewAuthUser;
    const sessionId = randomUUID();

    const existingUser = await findAuthUser("email", email!);
    if (existingUser.ok) {
      throw new HttpError(HttpStatus.CONFLICT, "Email already in use");
    }

    const user = unwrap(await signupUser({ email, password, name, role }));

    if (!user) {
      console.error("Signup failed", user);
      throw new HttpError(HttpStatus.BAD_REQUEST, "Signup failed");
    }

    const token = {
      userId: user!.id,
      sessionId,
      role: user!.role as UserRole,
    };

    const accessToken = generateAccessToken(token);
    const refreshToken = generateRefreshToken(token);

    await insertSession({ userId: user!.id, sessionId, refreshToken });
    setAuthCookies({
      req,
      res,
      userId: user.id,
      role: user.role as UserRole,
      accessToken,
      refreshToken,
    });

    sendSuccessResponse(
      req,
      res,
      { data: user!, serializerConfig: SerializedUser, type: "single" },
      { status: HttpStatus.CREATED },
    );

    if (user) {
      authQueue.add(AuthJobs.RegistrationCompleted, {
        userId: user.id,
        email: user.email!,
      });
    }
  },
);
