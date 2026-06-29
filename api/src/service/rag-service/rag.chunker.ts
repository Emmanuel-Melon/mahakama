export type FileContent = {
  documentId: string;
  text: string;
};

type ChunkingOptions = {
  chunkSize: number; // tokens
  overlapSize: number;
};

export const chunkDocument = (
  document: FileContent,
  options: ChunkingOptions,
) => {
  return [];
};
