export interface DocumentDetails {
  id: number;
  title: string;
  description: string;
  type: string;
  sections: number;
  lastUpdated: string;
  storageUrl: string;
  createdAt: string;
  updatedAt: string;
}

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
