import { defineRoutes } from "../../lib/nav/nav.paths";

export const lawyersRoutes = defineRoutes({
  index: { path: "lawyers", file: "routes/lawyers/index.tsx" },
  detail: { path: "lawyers/:lawyerId", file: "routes/lawyers/$lawyerId.tsx" },
});

export const LawyersPaths = lawyersRoutes.to;

export const LAWYERS_API_ROUTES = {
  ROOT: "/v1/lawyers",
  LAWYER: "/v1/lawyers/:lawyerId",
} as const;
