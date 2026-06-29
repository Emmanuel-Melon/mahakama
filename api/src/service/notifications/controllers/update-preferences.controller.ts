import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedNotificationPreferences } from "../notifications.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { updateNotificationPreferences } from "../operations/notifications.update";
import { HttpError } from "@/lib/http/http.error";

export const updateNotificationPreferencesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { emailEnabled, pushEnabled, inAppEnabled } = req.body;

    const updatedPreferences = unwrap(
      await updateNotificationPreferences(userId, {
        emailEnabled,
        pushEnabled,
        inAppEnabled,
      }),
      new HttpError(
        HttpStatus.NOT_FOUND,
        "User notification preferences not found",
      ),
    );

    sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...updatedPreferences,
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
