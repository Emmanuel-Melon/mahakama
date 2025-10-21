import type { LegalDocument } from "~/documents/types.documents";

export type DocumentDetails = LegalDocument;

export interface LoaderData {
  document: DocumentDetails | null;
  error?: string;
}

export interface MetaArgs {
  loaderData: LoaderData;
}

export interface LoaderArgs {
  params: {
    documentId: string;
  };
}

export interface ComponentProps {
  loaderData: LoaderData;
}
