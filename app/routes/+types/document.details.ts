export interface DocumentAuthor {
  id: string;
  name: string;
  title?: string;
  specialization?: string;
  avatarUrl?: string;
}

export interface DocumentVersion {
  version: number;
  updatedAt: string;
  updatedBy: string;
  changes: string;
}

export interface DocumentDetails {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  author: DocumentAuthor;
  lastModifiedBy: string;
  tags: string[];
  relatedDocuments: string[];
  versions: DocumentVersion[];
  isTemplate: boolean;
  accessLevel: 'private' | 'team' | 'public';
  fileType: 'docx' | 'pdf' | 'txt' | 'md';
  fileSize: string;
  downloadUrl?: string;
  previewUrl?: string;
  wordCount: number;
  pageCount?: number;
  lastOpenedAt?: string;
  lastOpenedBy?: string;
  folderId?: string;
  folderName?: string;
  isBookmarked?: boolean;
  isStarred?: boolean;
  isShared?: boolean;
  sharedWith?: Array<{
    id: string;
    name: string;
    email: string;
    role: 'viewer' | 'editor' | 'commenter';
    avatarUrl?: string;
  }>;
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