import { ANALYSIS_TYPES, type AnalysisType } from "./analysis.config";
import type { AnalysisPrompt } from "./analysis.types";
import { fullAnalysisPrompt } from "./prompts/document-analysis.prompts";
import { riskAnalysisPrompt } from "./prompts/risk-analysis.schema";
import { summaryAnalysisPrompt } from "./prompts/summary-analysis.prompts";

export const promptRegistry: Record<AnalysisType, AnalysisPrompt> = {
  [ANALYSIS_TYPES.FULL]: fullAnalysisPrompt,
  [ANALYSIS_TYPES.RISK]: riskAnalysisPrompt,
  [ANALYSIS_TYPES.SUMMARY]: summaryAnalysisPrompt,
};

export function getAnalysisPrompt(type: AnalysisType): AnalysisPrompt {
  return promptRegistry[type];
}
