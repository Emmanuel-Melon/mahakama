export const AUTH_API_ROUTES = {
  ROOT: `/v1`,
  LOGIN: `/v1/auth/login`,
  REGISTER: `/v1/auth/register`,
  LOGOUT: `/v1/auth/logout`,
  ME: `/v1/auth/me`,
  REQUEST_RESET: `/v1/auth/request-reset`,
  RESET_PASSWORD: `/v1/auth/reset-password`,
  VERIFY_EMAIL: `/v1/verify-email`,
} as const;

export const CORPUS_API_ROUTES = {
  ROOT: "/v1/corpus",
  CORPUS: "/v1/corpus/:corpusId",
  INGEST: "/v1/corpus/ingest",
} as const;

export const LAWYERS_API_ROUTES = {
  ROOT: "/v1/lawyers",
  DIRECTORY: "/v1/lawyers/directory",
  PROFILE: "/v1/lawyers/profile",
  PROFILE_SUBMIT: "/v1/lawyers/profile/submit",
  PROFILE_DOCUMENTS: "/v1/lawyers/profile/documents",
  INVITES: "/v1/lawyers/invites",
} as const;

export const MATTERS_API_ROUTES = {
  ROOT: "/v1/matters",
  TIMELINE: "/v1/matters/:matterId/timeline",
  NOTES: "/v1/matters/:matterId/notes",
  LAWYERS: "/v1/matters/:matterId/lawyers",
  LAWYERS_ME: "/v1/matters/:matterId/lawyers/me",
} as const;
