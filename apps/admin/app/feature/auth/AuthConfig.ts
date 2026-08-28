import en from "../../locales/en/auth.json";
import ar from "../../locales/ar/auth.json";
import type { I18nConfig } from "@mah/client/i18n";
import { defineRoutes } from "@mah/client/nav";

export const authRoutes = defineRoutes({
  login: { path: "login", file: "routes/auth/login.tsx" },
  signup: { path: "signup", file: "routes/auth/signup.tsx" },
  forgotPassword: {
    path: "forgot-password",
    file: "routes/auth/forgot-password.tsx",
  },
  resetPassword: {
    path: "reset-password",
    file: "routes/auth/reset-password.tsx",
  },
  verifyAccount: {
    path: "verify-account",
    file: "routes/auth/verify-account.tsx",
  },
  verifyEmailPending: {
    path: "verify-email-pending",
    file: "routes/auth/verify-email-pending.tsx",
  },
});

export const AuthPaths = authRoutes.to;

export const authI18n: I18nConfig<"auth", typeof en> = {
  namespace: "auth",
  resources: {
    en,
    ar,
  },
};
