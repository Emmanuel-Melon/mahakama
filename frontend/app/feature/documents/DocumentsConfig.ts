import { defineRoutes } from "../../lib/nav/nav.paths";

export const documentsRoutes = defineRoutes({
  index: { path: "documents", file: "routes/documents/index.tsx" },
  detail: {
    path: "documents/:documentId",
    file: "routes/documents/$documentId.tsx",
  },
});

export const DocumentsPaths = documentsRoutes.to;

export const DOCUMENTS_API_ROUTES = {
  ROOT: "/v1/documents",
  DOCUMENT: "/v1/documents/:documentId",
} as const;
