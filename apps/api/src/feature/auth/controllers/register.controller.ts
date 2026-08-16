import { Request, Response } from "express";
import {
  generateAuthToken,
  hashPassword,
  getCookieOptions,
} from "../auth.utils";
import { registerUser } from "../operations/auth.create";
import { findUser } from "@/feature/users/operations/users.find";
import { authQueue } from "../jobs/auth.queue";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedUser } from "@/feature/users/users.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { AuthJobs } from "../auth.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, name } = req.body ?? {};
    const user = await findUser("email", email);

    const hashedPassword = await hashPassword(password);

    const newUser = unwrap(
      await registerUser({
        email,
        password: hashedPassword,
        name,
      }),
      new HttpError(HttpStatus.BAD_GATEWAY, "Failed to create user"),
    );

    const token = generateAuthToken(newUser);
    res.cookie("token", token, getCookieOptions());
    const { ...userWithoutPassword } = newUser;

    sendSuccessResponse(req, res, {
      data: userWithoutPassword,
      serializerConfig: SerializedUser,
      type: "single",
    });

    await authQueue.add(AuthJobs.Registration, {
      userId: newUser.id,
      email,
    });
  },
);
