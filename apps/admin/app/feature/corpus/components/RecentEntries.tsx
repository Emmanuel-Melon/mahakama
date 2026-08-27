import { useTranslation } from "react-i18next";
import { useCorpusEntries } from "@mah/api/src/hooks/corpus/use-corpus";
import type { Corpus } from "@mah/api/src/clients/corpus.api";
import { FileText, Calendar, BookOpen } from "lucide-react";

export function RecentEntries() {
  const { t } = useTranslation("corpus");
  const { data, isLoading } = useCorpusEntries();

  if (isLoading) {
    return (
      <fieldset className="border-2 border-gray-900 rounded-lg p-5 bg-white">
        <legend className="px-3 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-600 border-2 border-gray-900 rounded-md">
          {t("entries.title")}
        </legend>
        <p className="text-sm text-gray-500 pt-2">Loading…</p>
      </fieldset>
    );
  }

  const entries = (data?.data ?? []) as Corpus[];

  return (
    <fieldset className="border-2 border-gray-900 rounded-lg p-5 bg-white">
      <legend className="px-3 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-600 border-2 border-gray-900 rounded-md">
        {t("entries.title")}
      </legend>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500 pt-2">{t("entries.empty")}</p>
      ) : (
        <ul className="divide-y divide-gray-200 pt-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="w-8 h-8 rounded border-2 border-gray-900 bg-yellow-400 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {entry.title}
                </p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  {entry.type && (
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {entry.type}
                    </span>
                  )}
                  {entry.lastUpdated && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {entry.lastUpdated}
                    </span>
                  )}
                  {entry.jurisdiction && <span>{entry.jurisdiction}</span>}
                  {entry.version > 1 && (
                    <span className="font-mono">v{entry.version}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
}
