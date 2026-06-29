import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedNotificationPreferences } from "../notifications.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { getNotificationPreferences } from "../operations/notifications.find";
import { HttpError } from "@/lib/http/http.error";

export const getNotificationPreferencesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const notificationPreferences = unwrap(
      await getNotificationPreferences(userId),
      new HttpError(HttpStatus.NOT_FOUND, "User not found"),
    );

    console.log("notificationPreferences", notificationPreferences);
    sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...notificationPreferences,
          id: userId,
        },
        serializerConfig: SerializedNotificationPreferences,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
