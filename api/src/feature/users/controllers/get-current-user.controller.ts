import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";
import { findUserById } from "../operations/users.find";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = unwrap(
      await findUserById(req?.user?.id || ""),
      new HttpError(HttpStatus.NOT_FOUND, "User not found"),
    );
    return sendSuccessResponse(
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
