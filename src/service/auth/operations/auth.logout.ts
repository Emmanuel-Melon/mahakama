import { logger } from "@/lib/logger";
import { AuthJobs } from "../auth.config";

type LogoutParams = {
  userId: string;
  token: string;
  userAgent?: string;
  ip?: string;
};

export const logoutUser = async ({ userId, userAgent, ip }: LogoutParams) => {
  try {
    logger.info({
      event: AuthJobs.Logout,
      userId,
      userAgent,
      ip,
      message: "User logged out successfully",
    });

    return { success: true };
  } catch (error) {
    logger.error({
      event: AuthJobs.Logout,
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to logout user",
    });
    throw error;
  }
};
