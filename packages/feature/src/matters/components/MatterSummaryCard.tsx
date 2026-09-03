import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Briefcase,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  MapPin,
  MessagesSquare,
  Pencil,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@mah/ui";
import { Badge } from "@mah/ui/components/badge";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { Textarea } from "@mah/ui/components/Textarea";
import { useMatterMutations } from "@mah/api/src/hooks/use-matters";
import type { Matter } from "@mah/api/src/clients/matters.api";
import { useMatterFeature } from "../MatterFeatureContext";
import { getMetadataRecord } from "./matter-utils";

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "—";

export function MatterSummaryCard({
  matter,
  role,
}: {
  matter: Matter;
  role: "lawyer" | "user";
}) {
  const { t } = useTranslation("matters");
  const { updateMatter } = useMatterMutations();
  const { chatPathResolver } = useMatterFeature();

  const [editing, setEditing] = useState(false);
  const [draftSummary, setDraftSummary] = useState(matter.summary ?? "");
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const metadata = getMetadataRecord(matter.metadata);
  const keyParties = Array.isArray(metadata.keyParties)
    ? metadata.keyParties.filter(
        (party): party is string => typeof party === "string",
      )
    : [];
  const requestedRelief =
    typeof metadata.requestedRelief === "string"
      ? metadata.requestedRelief
      : "";
  const readyAt =
    typeof metadata.readyAt === "string" ? metadata.readyAt : undefined;

  const startEdit = () => {
    setDraftSummary(matter.summary ?? "");
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveSummary = () => {
    if (updateMatter.isPending) return;
    updateMatter.mutate(
      { matterId: matter.id, data: { summary: draftSummary.trim() } },
      { onSuccess: () => setEditing(false) },
    );
  };

  return (
    <CardWithLabel
      label={t("summary.label")}
      className="bg-white p-6"
      labelClassName="text-xs font-medium tracking-wider text-gray-500"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">
          {t("summary.label")} · {t("fields.updated")}{" "}
          {formatDate(matter.updatedAt)}
        </p>
        {role === "user" &&
          (editing ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={saveSummary}
                disabled={updateMatter.isPending}
                className="gap-1.5 border-2 border-black rounded-lg text-gray-900 bg-yellow-300 shadow-[2px_2px_0_0_#000] hover:bg-yellow-400"
              >
                {updateMatter.isPending
                  ? t("summary.saving")
                  : t("summary.save")}
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                {t("summary.cancel")}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={startEdit}
              className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
            >
              <Pencil className="h-4 w-4" />
              {t("summary.edit")}
            </Button>
          ))}
      </div>

      {editing ? (
        <Textarea
          value={draftSummary}
          onChange={(e) => setDraftSummary(e.target.value)}
          disabled={updateMatter.isPending}
          className="mt-4 min-h-32 border-2 border-gray-900"
        />
      ) : (
        <p className="mt-4 text-gray-800 whitespace-pre-wrap">
          {matter.summary || t("summary.empty")}
        </p>
      )}

      {role === "lawyer" && (
        <div className="mt-4 rounded-lg border border-gray-300 bg-gray-50">
          <button
            type="button"
            onClick={() => setAnalysisOpen((open) => !open)}
            aria-expanded={analysisOpen}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gray-500" />
              {analysisOpen ? t("analysis.hideFull") : t("analysis.viewFull")}
            </span>
            {analysisOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {analysisOpen && (
            <div className="space-y-3 border-t border-gray-200 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {t("analysis.keyParties")}
                </p>
                {keyParties.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {keyParties.map((party) => (
                      <Badge key={party} variant="secondary">
                        {party}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-0.5 text-sm text-gray-600">
                    {t("analysis.none")}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {t("analysis.requestedRelief")}
                </p>
                <p className="mt-0.5 text-sm text-gray-700">
                  {requestedRelief || t("analysis.none")}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {readyAt
                  ? `${t("analysis.prepared")} ${formatDate(readyAt)} · `
                  : ""}
                {t("analysis.hint")}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <Badge
          variant="outline"
          className="flex items-center gap-1 border-2 border-gray-900 bg-white"
          style={{ boxShadow: "2px 2px 0 0 #000" }}
        >
          <CalendarClock className="h-3 w-3" />
          {t("fields.opened")}: {formatDate(matter.createdAt)}
        </Badge>
        {matter.jurisdiction && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-2 border-gray-900 bg-white"
            style={{ boxShadow: "2px 2px 0 0 #000" }}
          >
            <MapPin className="h-3 w-3" />
            {matter.jurisdiction}
          </Badge>
        )}
        {matter.practiceArea && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-2 border-gray-900 bg-white"
            style={{ boxShadow: "2px 2px 0 0 #000" }}
          >
            <Briefcase className="h-3 w-3" />
            {matter.practiceArea}
          </Badge>
        )}
        {matter.urgency && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-2 border-gray-900 bg-white"
            style={{ boxShadow: "2px 2px 0 0 #000" }}
          >
            <Zap className="h-3 w-3" />
            {matter.urgency}
          </Badge>
        )}
        {matter.sourceChatId && chatPathResolver && (
          <a
            href={chatPathResolver(matter.sourceChatId)}
            className="inline-flex items-center gap-1 rounded-full border-2 border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
          >
            <MessagesSquare className="h-3 w-3" />
            {t("header.openedFromChat")}
          </a>
        )}
      </div>
    </CardWithLabel>
  );
}
