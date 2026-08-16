import { Request, Response } from "express";
import { findUser } from "../operations/users.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedUser } from "../users.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = unwrap(
      await findUser("id", userId),
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
