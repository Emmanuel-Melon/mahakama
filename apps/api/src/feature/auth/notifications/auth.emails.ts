import { compileEmailBlocks } from "@/feature/notifications/notifications.emails";

import type {
  EmailVerificationNotification,
  LoginNotification,
  PasswordResetNotification,
} from "../auth.types";

export const authEmailRenderers = {
  loginAlert: (data: LoginNotification) =>
    compileEmailBlocks([
      { heading: "New Login Detected" },
      {
        paragraph: `A new login was detected from ${data.location || "an unknown location"}.`,
      },
      {
        kvList: {
          Time: new Date(data.loginTime).toLocaleString(),
          Device: data.device,
        },
      },
      {
        actions: [
          { label: "Review Activity", url: `/auth/security/${data.actorId}` },
        ],
      },
    ]),

  passwordReset: (data: PasswordResetNotification) =>
    compileEmailBlocks([
      { heading: "Reset Your Password" },
      {
        paragraph:
          "We received a request to reset your password. Click the button below to proceed.",
      },
      {
        actions: [
          {
            label: "Reset Password",
            url: data.link,
          },
        ],
      },
      { hint: "If you didn't request this, you can safely ignore this email." },
    ]),

  emailVerification: (data: EmailVerificationNotification) =>
    compileEmailBlocks([
      { heading: "Verify Your Email" },
      {
        paragraph:
          "Confirm your email address to finish setting up your account.",
      },
      { actions: [{ label: "Verify Email", url: data.link }] },
      {
        hint: "If you didn't create this account, you can safely ignore this email.",
      },
    ]),
};
