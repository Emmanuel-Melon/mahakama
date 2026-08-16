import { Request, Response } from "express";
import { createUser as createUserOperation } from "../operations/users.insert";
import type { NewUser } from "../users.types";
import { findUser } from "../operations/users.find";
import { v4 as uuid } from "uuid";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedUser } from "../users.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const createUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email } = req.body as NewUser;
    const userId = req.user?.id || "";

    const userById = unwrap(
      await findUser("id", userId),
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
