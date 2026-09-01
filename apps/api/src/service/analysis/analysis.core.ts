import { llmProviderManager } from "@/lib/llm";
import { ANALYSIS_TYPES, type AnalysisType } from "./analysis.config";
import type {
  DocumentAnalysisOutput,
  DocumentAnalysisOutputMap,
} from "./analysis.types";
import { getAnalysisPrompt } from "./analysis.registry";

export async function analyzeText<T extends AnalysisType>(
  type: T,
  fileName: string,
  documentText: string,
): Promise<DocumentAnalysisOutputMap[T]> {
  const prompt = getAnalysisPrompt(type);
  const client = llmProviderManager.getClient();

  const result = await client.generateTextContent<DocumentAnalysisOutput>(
    prompt.buildPrompt(fileName, documentText),
    {
      outputType: "structured",
      responseJsonSchema: prompt.schema,
    },
  );

  return result.content as DocumentAnalysisOutputMap[T];
}

export async function analyzeDocument(
  analysisType: AnalysisType,
  fileName: string,
  documentText: string,
): Promise<DocumentAnalysisOutput> {
  // Default to FULL when no type is requested.
  const type = analysisType ?? ANALYSIS_TYPES.FULL;
  return analyzeText(type, fileName, documentText);
}
