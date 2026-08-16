import { UserCreatedNotificationSchema } from "./users.types";
import { createNotificationGenerators } from "@/feature/notifications/notifications.factory";

export const UserNotificationTemplateMap = {
  USER_CREATED: {
    key: "user_created",
    schema: UserCreatedNotificationSchema,
  },
} as const;

export const usersNotificationGenerators = createNotificationGenerators(
  UserNotificationTemplateMap,
)({
  USER_CREATED: (data) => ({
    title: "Welcome to the Platform!",
    message: `Welcome ${data.userName || "to our platform"}! Your account has been created successfully.`,
    action: {
      label: "Complete Profile",
      url: `/dashboard/profile/${data.userId}`,
      type: "primary" as const,
    },
    metadata: {
      userId: data.userId,
      registrationMethod: data.registrationMethod || "standard",
    },
  }),
});
