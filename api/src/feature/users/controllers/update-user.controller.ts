import { Request, Response } from "express";
import { updateUser } from "../operations/users.update";
import { type UserRole } from "../users.schema";
import { findUserById } from "../operations/users.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const updateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const existingUser = unwrap(
      await findUserById(userId),
      new HttpError(HttpStatus.NOT_FOUND, "User not found"),
    );
    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return sendErrorResponse(req, res, {
        status: HttpStatus.FORBIDDEN,
      });
    }
    const data = unwrap(
      await updateUser(userId, {
        ...req.body,
        role: req.body.role as UserRole,
      }),
      new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update user"),
    );
    return sendSuccessResponse(
      req,
      res,
      {
        data,
        serializerConfig: SerializedUser,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
