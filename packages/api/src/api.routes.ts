export const AUTH_API_ROUTES = {
  ROOT: `/v1`,
  LOGIN: `/v1/login`,
  REGISTER: `/v1/register`,
  LOGOUT: `/v1/logout`,
  ME: `/v1/me`,
  REQUEST_RESET: `/v1/request-reset`,
  RESET_PASSWORD: `/v1/reset-password`,
  VERIFY_EMAIL: `/v1/verify-email`,
} as const;

export const CORPUS_API_ROUTES = {
  ROOT: "/v1/corpus",
  CORPUS: "/v1/corpus/:corpusId",
  INGEST: "/v1/corpus/ingest",
} as const;

export const LAWYERS_API_ROUTES = {
  ROOT: "/v1/lawyers",
  LAWYER: "/v1/lawyers/:lawyerId",
} as const;
