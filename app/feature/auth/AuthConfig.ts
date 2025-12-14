export const AUTH_ROUTES = {
    LAYOUT: "./feature/auth/layout/auth.layout.tsx",
    LOGIN: "routes/auth/login.tsx",
    SIGNUP: "routes/auth/signup.tsx",
} as const;

const API_V1 = "/api/v1";

export const AUTH_API_ROUTES = {
  ROOT: `${API_V1}/auth`,
  LOGIN: `${API_V1}/auth/login`,
  REGISTER: `${API_V1}/auth/register`,
  LOGOUT: `${API_V1}/auth/logout`,
} as const;