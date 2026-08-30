import { useTranslation } from "react-i18next";
import { Brain, AlertTriangle } from "lucide-react";
import { Button } from "@mah/ui";
import type { MatterDocumentAnalysis } from "@mah/api/src/clients/matters.api";

interface DocumentAnalysisSectionProps {
  analysis: MatterDocumentAnalysis;
  showAnalysis: boolean;
  onToggleShow: () => void;
}

export function DocumentAnalysisSection({
  analysis,
  showAnalysis,
  onToggleShow,
}: DocumentAnalysisSectionProps) {
  const { t } = useTranslation("matters");

  const analysisItems = [
    {
      condition: Boolean(analysis.summary),
      className: "p-4 bg-gray-50 rounded-lg",
      content: (
        <>
          <h3 className="font-medium text-gray-900 mb-2">
            {t("documents.analysisSummary")}
          </h3>
          <p className="text-gray-700">{analysis.summary}</p>
        </>
      ),
    },
    {
      condition: Boolean(analysis.documentType),
      className: "p-4 bg-gray-50 rounded-lg",
      content: (
        <>
          <h3 className="font-medium text-gray-900 mb-2">
            {t("documents.analysisType")}
          </h3>
          <p className="text-gray-700">{analysis.documentType}</p>
        </>
      ),
    },
    {
      condition: Boolean(analysis.parties?.length),
      className: "p-4 bg-gray-50 rounded-lg",
      content: (
        <>
          <h3 className="font-medium text-gray-900 mb-2">
            {t("documents.analysisParties")}
          </h3>
          <ul className="space-y-1">
            {analysis.parties?.map((party, i) => (
              <li key={i} className="text-gray-700">
                {party.name}
                {party.role && ` (${party.role})`}
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      condition: Boolean(analysis.claims?.length),
      className: "p-4 bg-gray-50 rounded-lg",
      content: (
        <>
          <h3 className="font-medium text-gray-900 mb-2">
            {t("documents.analysisClaims")}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {analysis.claims?.map((claim, i) => (
              <li key={i}>{claim}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      condition: Boolean(analysis.requestedRelief),
      className: "p-4 bg-gray-50 rounded-lg",
      content: (
        <>
          <h3 className="font-medium text-gray-900 mb-2">
            {t("documents.analysisRelief")}
          </h3>
          <p className="text-gray-700">{analysis.requestedRelief}</p>
        </>
      ),
    },
    {
      condition: Boolean(analysis.keyDates?.length),
      className: "p-4 bg-gray-50 rounded-lg",
      content: (
        <>
          <h3 className="font-medium text-gray-900 mb-2">
            {t("documents.analysisKeyDates")}
          </h3>
          <ul className="space-y-1">
            {analysis.keyDates?.map((kd, i) => (
              <li key={i} className="text-gray-700">
                <strong>{kd.date}:</strong> {kd.description}
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      condition: Boolean(analysis.risks?.length),
      className: "p-4 bg-amber-50 border border-amber-200 rounded-lg",
      content: (
        <>
          <h3 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t("documents.analysisRisks")}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            {analysis.risks?.map((risk, i) => (
              <li key={i}>{risk}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      condition: Boolean(analysis.applicableLaws?.length),
      className: "p-4 bg-gray-50 rounded-lg",
      content: (
        <>
          <h3 className="font-medium text-gray-900 mb-2">
            {t("documents.analysisLaws")}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {analysis.applicableLaws?.map((law, i) => (
              <li key={i}>{law}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      condition: Boolean(analysis.recommendations?.length),
      className: "p-4 bg-blue-50 border border-blue-200 rounded-lg",
      content: (
        <>
          <h3 className="font-medium text-blue-900 mb-2">
            {t("documents.analysisRecommendations")}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            {analysis.recommendations?.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="space-y-4 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {t("documents.analysisResults")}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleShow}
          className="gap-1"
        >
          {showAnalysis
            ? t("documents.hideAnalysis")
            : t("documents.showAnalysis")}
        </Button>
      </div>

      {showAnalysis && (
        <div className="space-y-4 prose prose-sm max-w-none">
          {analysisItems
            .filter((item) => item.condition)
            .map((item, index) => (
              <div key={index} className={item.className}>
                {item.content}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
