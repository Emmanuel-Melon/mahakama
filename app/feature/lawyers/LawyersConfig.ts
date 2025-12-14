export const LAWYERS_ROUTES = {
    INDEX: "routes/lawyers/index.tsx",
    LAWYER: "routes/lawyers/$lawyerId.tsx",
} as const;

const API_V1 = "/api/v1";

export const LAWYERS_API_ROUTES = {
  ROOT: `${API_V1}/lawyers`,
  LAWYER: `${API_V1}/lawyers/:lawyerId`,
} as const;