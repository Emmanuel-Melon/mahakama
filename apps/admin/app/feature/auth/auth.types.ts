import { z } from "zod";
import type { UserRole } from "@mah/api/src/clients/auth.api";
import { schemas } from "@mah/api/src/generated/api.schemas";

export const loginRequestSchema = schemas.postV1login_Body;
export const signupRequestSchema = schemas.postV1register_Body;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type LoginForm = z.infer<typeof loginRequestSchema>;
export type SignupForm = z.infer<typeof signupRequestSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type AuthData = LoginForm | SignupForm;
export type AuthMode = "login" | "signup";

export interface AuthScreenProps {
  role?: UserRole;
  successUrl?: string;
}
