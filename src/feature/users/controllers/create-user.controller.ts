import { Request, Response } from "express";
import { createUser as createUserOperation } from "../operations/users.create";
import type { NewUser } from "../users.types";
import { findUserById } from "../operations/users.find";
import { v4 as uuid } from "uuid";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const createUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email } = req.body ?? ({} as NewUser);
    const userId = req.user?.id || "";

    const userById = unwrap(
      await findUserById(userId),
      new HttpError(HttpStatus.NOT_FOUND, "User not found"),
    );

    if (userById) {
      sendErrorResponse(req, res, {
        status: HttpStatus.CONFLICT,
      });

      return new HttpError(HttpStatus.NOT_FOUND, "User already exists");
    }

    const user = unwrap(
      await createUserOperation({
        id: uuid(),
        name: name as string,
        email: email as string,
        fingerprint: req.fingerprint?.hash,
        userAgent: req.headers["user-agent"],
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to create user"),
    );

    sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...user,
        },
        serializerConfig: SerializedUser,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
