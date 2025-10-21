export interface LegalDocument {
  id: string; // Changed from number to string to match Document interface
  title: string;
  description: string;
  type: string;
  sections: number;
  lastUpdated: string;
  storageUrl: string;
  createdAt: string;
  updatedAt: string;
}
