export const AuthJobs = {
  Login: "login",
  Registration: "registration",
  Logout: "logout",
} as const;

export type AuthJobType = (typeof AuthJobs)[keyof typeof AuthJobs];
