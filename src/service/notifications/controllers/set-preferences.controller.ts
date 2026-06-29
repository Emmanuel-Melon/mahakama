import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedNotificationPreferences } from "../notifications.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { setNotificationPreferences } from "../operations/notifications.create";
import { HttpError } from "@/lib/http/http.error";

export const setNotificationPreferencesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const notificationPreferences = unwrap(
      await setNotificationPreferences({
        userId,
        emailEnabled: true,
        pushEnabled: true,
        inAppEnabled: true,
      }),
      new HttpError(HttpStatus.NOT_FOUND, "User not found"),
    );

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
