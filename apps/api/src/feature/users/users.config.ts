import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { type User } from "./users.types";

export const SerializedUser: JsonApiResourceConfig<User> = {
  type: "user",
  attributes: (user: User) => user,
};

export const UserJobs = {
  UserCreated: "user-created",
  UserUpdated: "user-updated",
  UserDeleted: "user-deleted",
  UserOnboarded: "user-onboarded",
  UserVerified: "user-verified",
} as const;

export type UsersJobType = (typeof UserJobs)[keyof typeof UserJobs];

// for pagination and route queries
export const sortableFields = [
  "createdAt",
  "updatedAt",
  "name",
  "email",
] as const;

export const searchableFields = ["name", "email"] as const;
export type SearchableField = (typeof searchableFields)[number];
export type SortableField = (typeof sortableFields)[number];

export const UserNotificationTemplates = {
  USER_CREATED: {
    key: "user_created",
    _data: {} as {
      userId: string;
      userName?: string;
      email?: string;
      registrationMethod?: string;
    },
  },
} as const;
