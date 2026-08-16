import jwt from "jsonwebtoken";
import { serverConfig } from "@/config";

export const generateTestToken = (user: {
  id: string;
  email: string | null;
  role: string | null;
}) => {
  const tokenPayload = {
    id: user.id,
    email: user.email || "",
    role: user.role || "",
  };
  return jwt.sign(tokenPayload, serverConfig.jwtSecret!, { expiresIn: "1h" });
};
