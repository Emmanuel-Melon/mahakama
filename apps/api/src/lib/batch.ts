// src/lib/batch/batch.ts
export type BatchProgress = {
  batchIndex: number;
  totalBatches: number;
  processedChunks: number;
  totalChunks: number;
};

export async function processInBatches<T>(opts: {
  items: T[];
  batchSize: number;
  processBatch: (batch: T[]) => Promise<void>;
  onProgress?: (progress: BatchProgress) => void;
}): Promise<number> {
  const { items, batchSize, processBatch, onProgress } = opts;
  const totalBatches = Math.ceil(items.length / batchSize);
  let processed = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processBatch(batch);
    processed += batch.length;
    onProgress?.({
      batchIndex: i / batchSize + 1,
      totalBatches,
      processedChunks: processed,
      totalChunks: items.length,
    });
  }

  return processed;
}
