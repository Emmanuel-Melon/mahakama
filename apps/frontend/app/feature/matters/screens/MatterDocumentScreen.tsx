import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Download, Brain, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { PageHeader, Button, AsyncContainer } from "@mah/ui";
import { IconContainer } from "@mah/ui/components/IconContainer";
import {
  useMatterDocument,
  useMatterMutations,
  isDocumentAnalyzed,
} from "@mah/api/src/hooks/use-matters";
import { MattersPaths } from "../MattersConfig";
import type {
  MatterDocument,
  MatterDocumentAnalysis,
} from "@mah/api/src/clients/matters.api";
import { DocumentAnalysisSection } from "../components/analysis/DocumentAnalysisSection";

interface MatterDocumentScreenProps {
  matterId: string;
  documentId: string;
  role: "lawyer" | "user";
  currentUserId?: string;
}

const ANALYSIS_POLL_INTERVAL_MS = 3000;

export function MatterDocumentScreen({
  matterId,
  documentId,
}: MatterDocumentScreenProps) {
  const { t } = useTranslation("matters");
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useMatterDocument(
    matterId,
    documentId,
  );
  const { analyzeDocument } = useMatterMutations();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const document = data?.data;
  const analysis = (
    document as MatterDocument & { analysis?: MatterDocumentAnalysis | null }
  )?.analysis;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await analyzeDocument.mutateAsync({ matterId, documentId });
      pollForAnalysis();
    } catch {
      // Error handled by mutation
    } finally {
      setIsAnalyzing(false);
    }
  };

  const pollForAnalysis = () => {
    const check = async () => {
      await refetch();
      const updatedDoc = (data?.data ?? document) as MatterDocument & {
        analysis?: MatterDocumentAnalysis | null;
      };
      if (isDocumentAnalyzed(updatedDoc)) {
        setShowAnalysis(true);
        return;
      }
      pollTimeoutRef.current = setTimeout(check, ANALYSIS_POLL_INTERVAL_MS);
    };
    check();
  };

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, []);

  const breadcrumbs = [
    { label: t("title"), to: MattersPaths.index(), icon: FileText },
    { label: document?.fileName ?? t("title"), to: "#" },
  ];

  return (
    <AsyncContainer
      data={document}
      isLoading={isLoading}
      error={error}
      loadingComponent={
        <div className="text-center py-12 text-muted-foreground">
          {t("loadingDetail.description")}
        </div>
      }
      emptyState={{
        icon: FileText,
        badge: t("title"),
        title: t("notFound.title"),
        description: t("notFound.description"),
      }}
    >
      {document && (
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <PageHeader breadcrumbs={breadcrumbs} className="mb-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <IconContainer icon={FileText} size="lg" color="handdrawn" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {document.fileName}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {document.fileType || "—"} ·{" "}
                    {document.fileSize
                      ? `${(document.fileSize / 1024).toFixed(1)} KB`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {document.fileUrl && (
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      {t("documents.download")}
                    </Button>
                  </a>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(MattersPaths.detail({ matterId }))}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  {t("actions.backToMatter")}
                </Button>
              </div>
            </div>

            {document.fileUrl && (
              <div className="aspect-[4/3] rounded-lg border border-gray-200 bg-white overflow-hidden">
                <embed
                  src={`${document.fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  type="application/pdf"
                  className="w-full h-full"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyze}
                disabled={isAnalyzing || isDocumentAnalyzed(document as any)}
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("documents.analyzing")}
                  </>
                ) : isDocumentAnalyzed(document as any) ? (
                  <>
                    <Brain className="h-4 w-4" />
                    {t("documents.analyzed")}
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    {t("documents.analyze")}
                  </>
                )}
              </Button>
            </div>

            {isDocumentAnalyzed(document as any) && analysis && (
              <DocumentAnalysisSection
                analysis={analysis}
                showAnalysis={showAnalysis}
                onToggleShow={() => setShowAnalysis(!showAnalysis)}
              />
            )}
          </div>
        </div>
      )}
    </AsyncContainer>
  );
}
