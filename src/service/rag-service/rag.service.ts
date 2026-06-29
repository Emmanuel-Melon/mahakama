import {
  type RAGContext,
  type RetrievalOptions,
  ragQuerySchema,
} from "./rag.types";
import { generateTextEmbedding } from "@/service/embedding-service/embeddings.generate";
import { searchEmbedding } from "@/service/embedding-service/embeddings.search";

export class RAGService {
  async retrieveContext(
    question: string,
    options: RetrievalOptions,
  ): Promise<RAGContext> {
    const { topK = 5, minSimilarity = 0.7, documentTypes = [] } = options;

    // 1. Generate embedding for question
    const { query } =
      typeof question === "string"
        ? ragQuerySchema.parse({ queryString: question })
        : ragQuerySchema.parse(question);
    const questionEmbedding = await generateTextEmbedding(question, {
      collectionName: options.collectionName,
    });

    // 2. Search for similar chunks
    const results = await searchEmbedding(query, {
      collectionName: options.collectionName,
    });

    // // 3. Format results
    // const chunks = results.map((r) => ({
    //   content: r.content,
    //   documentTitle: r.documentTitle,
    //   section: r.section,
    //   similarity: r.similarity,
    // }));

    // // 4. Group by source documents
    // const sourcesMap = new Map<string, Set<string>>();
    // results.forEach((r) => {
    //   if (!sourcesMap.has(r.documentId)) {
    //     sourcesMap.set(r.documentId, new Set());
    //   }
    //   if (r.section) {
    //     sourcesMap.get(r.documentId)!.add(r.section);
    //   }
    // });

    // const sources = Array.from(sourcesMap.entries()).map(([docId, sections]) => {
    //   const doc = results.find((r) => r.documentId === docId)!;
    //   return {
    //     documentId: docId,
    //     documentTitle: doc.documentTitle,
    //     sections: Array.from(sections),
    //   };
    // });

    return { chunks: [], sources: [] };
  }
}

export const ragService = new RAGService();

// thresholding
// vectorizing
// optimization

//   Step 2: Construct intelligent prompt
//   const prompt = constructPrompt(question, relevantLaws);

// thinking process
