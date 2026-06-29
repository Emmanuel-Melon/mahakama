export const AUTH_ROUTES = {
    LAYOUT: "./feature/auth/layout/auth.layout.tsx",
    LOGIN: {
        URL_SEGMENT: "login",
        PATH: "routes/auth/login.tsx",
        NAME: "authLogin",
        LABEL: "Login",
    },
    SIGNUP: {
        URL_SEGMENT: "signup",
        PATH: "routes/auth/signup.tsx",
        NAME: "authSignup",
        LABEL: "Sign Up",
    },
    FORGOT_PASSWORD: {
        URL_SEGMENT: "forgot-password",
        PATH: "routes/auth/forgot-password.tsx",
        NAME: "authForgotPassword",
        LABEL: "Forgot Password",
    },
} as const;

export const AUTH_API_ROUTES = {
  ROOT: `/v1`,
  LOGIN: `/v1/login`,
  REGISTER: `/v1/register`,
  LOGOUT: `/v1/logout`,
} as const;