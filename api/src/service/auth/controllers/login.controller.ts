import { Request, Response } from "express";
import {
  generateAuthToken,
  getCookieOptions,
  comparePasswords,
} from "../auth.utils";
import { authQueue } from "../jobs/auth.queue";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedUser } from "@/feature/users/users.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { AuthJobs } from "../auth.config";
import { HttpError } from "@/lib/http/http.error";
import { findAuthUser } from "../operations/auth.find";

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const user = await findAuthUser("email", email);

    if (!user.ok) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found");
    }

    const isPasswordValid = await comparePasswords(
      password,
      user.data.password!,
    );
    if (!isPasswordValid) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }
    const token = generateAuthToken(user.data!);
    res.cookie("token", token, getCookieOptions());
    const { ...userWithoutPassword } = user.data;
    sendSuccessResponse(req, res, {
      data: userWithoutPassword,
      serializerConfig: SerializedUser,
      type: "single",
    });

    authQueue.add(AuthJobs.Login, {
      userId: user.data.id,
      email: user.data.email!,
    });
  },
);
