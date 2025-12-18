export const DOCUMENTS_ROUTES = {
    INDEX: {
        URL_SEGMENT: "documents",
        PATH: "routes/documents/index.tsx",
        NAME: "documentsIndex",
        LABEL: "Documents",
    },
    DETAIL: {
        URL_SEGMENT: ":documentId",
        PATH: "routes/documents/$documentId.tsx",
        NAME: "documentDetails",
        LABEL: "Document Details",
    },
} as const;

const API_V1 = "/v1";

export const DOCUMENTS_API_ROUTES = {
  ROOT: `${API_V1}/documents`,
  DOCUMENT: `${API_V1}/documents/:documentId`,
} as const;