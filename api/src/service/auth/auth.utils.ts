import { User } from "@/feature/users/users.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serverConfig } from "@/config";
import { Response } from "express";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const generateAuthToken = (user: User): string => {
  return jwt.sign(user, serverConfig.jwtSecret!, {
    expiresIn: "7d",
  });
};

export const verifyAuthToken = (token: string): User | null => {
  return jwt.verify(token, serverConfig.jwtSecret!) as User;
};

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
    ...(isProduction && { domain: process.env.COOKIE_DOMAIN }),
  };
};

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie("token", token, getCookieOptions());
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie("token", {
    ...getCookieOptions(),
    maxAge: 0, // Immediately expire the cookie
  });
};

export const extractAuthToken = (req: Request): string | null => {
  // Try to get token from cookies first
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  // Then try Authorization header (format: "Bearer TOKEN")
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

export const checkUserRole = (
  role: string,
): role is "admin" | "user" | "lawyer" => {
  return role === "admin" || role === "user" || role === "lawyer";
};
