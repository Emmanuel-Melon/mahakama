import { Request, Response } from "express";
import { findNotifications } from "../operations/notifications.find";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedNotification } from "../notifications.config";

export const getNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("got a request user", req.user);
    const notifications = await findNotifications(req.user!.id);
    const total = notifications.count;

    return sendSuccessResponse(
      req,
      res,
      {
        data: notifications.data,
        serializerConfig: SerializedNotification,
        type: "collection",
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total,
        },
      },
    );
  },
);
