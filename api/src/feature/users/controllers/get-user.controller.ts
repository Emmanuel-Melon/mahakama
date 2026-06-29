import { Request, Response } from "express";
import { findUserById } from "../operations/users.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = unwrap(
      await findUserById(userId),
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
