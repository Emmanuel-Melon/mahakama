import type { ChatMessage } from "@mah/api/src/clients/chat.api";

interface MessageMetadataProps {
  metadata: ChatMessage["metadata"];
}

export function MessageMetadata({ metadata }: MessageMetadataProps) {
  if (!metadata) return null;

  const isMissing = metadata.citationStatus === "missing";
  const hasStale = metadata.hasStaleSources;

  if (!isMissing && !hasStale) return null;

  return (
    <div className="mt-3 border-t border-gray-200 pt-2 space-y-2">
      {isMissing && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          No specific legal source was found for this answer — treat it as
          general information and verify with a lawyer.
        </p>
      )}

      {hasStale && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          <p className="font-semibold">
            Some cited information may be out of date.
          </p>
          {metadata.sources
            ?.filter((source) => source.stale)
            .map((source, index) => (
              <p key={source.id ?? index} className="mt-0.5">
                {source.fullCitation ?? source.title}
                {source.lastUpdated &&
                  ` — based on text as of ${source.lastUpdated}`}
                . A more recent amendment may exist.
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
