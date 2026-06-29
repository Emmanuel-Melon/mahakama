import { Request, Response } from "express";
import { findUsers } from "../operations/users.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { parsePagination } from "@/lib/express/express.query";

export const getUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const result = await findUsers(pagination);
    return sendSuccessResponse(
      req,
      res,
      {
        data: result.data,
        serializerConfig: SerializedUser,
        type: "collection",
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: result.count,
        },
      },
    );
  },
);
