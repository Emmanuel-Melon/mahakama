export const LAWYERS_ROUTES = {
  INDEX: {
    URL_SEGMENT: "lawyers",
    PATH: "routes/lawyers/index.tsx",
    NAME: "lawyersIndex",
    LABEL: "Lawyers",
  },
  DETAIL: {
    URL_SEGMENT: ":lawyerId",
    PATH: "routes/lawyers/$lawyerId.tsx",
    NAME: "lawyerDetail",
    LABEL: "Lawyer Details",
  },
} as const;

const API_V1 = "/v1";

export const LAWYERS_API_ROUTES = {
  ROOT: `${API_V1}/lawyers`,
  LAWYER: `${API_V1}/lawyers/:lawyerId`,
} as const;
