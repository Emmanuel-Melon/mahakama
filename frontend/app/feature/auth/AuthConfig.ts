import { defineRoutes } from "../../lib/nav/nav.paths";

export const authRoutes = defineRoutes({
  login: { path: "login", file: "routes/auth/login.tsx" },
  signup: { path: "signup", file: "routes/auth/signup.tsx" },
  forgotPassword: {
    path: "forgot-password",
    file: "routes/auth/forgot-password.tsx",
  },
});

export const AuthPaths = authRoutes.to;

export const AUTH_API_ROUTES = {
  ROOT: `/v1`,
  LOGIN: `/v1/login`,
  REGISTER: `/v1/register`,
  LOGOUT: `/v1/logout`,
} as const;
