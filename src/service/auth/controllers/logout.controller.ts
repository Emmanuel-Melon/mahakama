import { Request, Response } from "express";
import { logoutUser } from "../operations/auth.logout";
import { sendErrorResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { clearAuthCookie } from "../auth.utils";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { authQueue } from "../jobs/auth.queue";
import { AuthJobs } from "../auth.config";

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!userId || !token) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized",
      });
    }

    await logoutUser({
      userId,
      token,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    clearAuthCookie(res);
    res.status(HttpStatus.SUCCESS.statusCode).json({
      success: true,
      message: "Successfully logged out",
    });

    await authQueue.add(AuthJobs.Logout, {
      userId: userId,
      email: req.user?.email!,
    });
  },
);
