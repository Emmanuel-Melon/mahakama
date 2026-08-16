import { Request, Response } from "express";
import { generateAuthToken, getCookieOptions } from "../auth.utils";
import { authQueue } from "../jobs/auth.queue";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { SerializedUser } from "@/feature/users/users.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { AuthJobs } from "../auth.config";
import { loginUser } from "../operations/auth.login";
import type { UserWithoutPassword } from "../auth.types";

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const user = await loginUser(email, password);

    const token = generateAuthToken(user);
    res.cookie("token", token, getCookieOptions());

    const userWithoutPassword: UserWithoutPassword = { ...user };
    delete (userWithoutPassword as { password?: string }).password;

    sendSuccessResponse(req, res, {
      data: userWithoutPassword,
      serializerConfig: SerializedUser,
      type: "single",
    });

    authQueue.add(AuthJobs.Login, {
      userId: user.id,
      email: user.email!,
    });
  },
);
