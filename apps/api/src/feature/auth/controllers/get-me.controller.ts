import type { Request, Response } from "express";

import { findUser } from "@/feature/users/operations/users.find";
import { SerializedUser } from "@/feature/users/users.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = unwrap(
      await findUser("id", req.user!.id),
      new HttpError(HttpStatus.NOT_FOUND, "User not found"),
    );

    console.log("user", user);

    sendSuccessResponse(
      req,
      res,
      {
        data: user,
        serializerConfig: SerializedUser,
        type: "single",
      },
      { status: HttpStatus.SUCCESS },
    );
  },
);
