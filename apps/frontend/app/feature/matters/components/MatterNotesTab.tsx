import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserRound, EyeOff, Check } from "lucide-react";
import { Button } from "@mah/ui";
import { Badge } from "@mah/ui/components/badge";
import { Textarea } from "@mah/ui/components/Textarea";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import {
  useMatterNotes,
  useMatterMutations,
} from "@mah/api/src/hooks/use-matters";
import type { MatterNote } from "@mah/api/src/clients/matters.api";

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

function NoteRow({
  note,
  showInternal,
}: {
  note: MatterNote;
  showInternal: boolean;
}) {
  const { t } = useTranslation("matters");

  return (
    <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white">
        <UserRound className="h-4 w-4 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">
          {note.content}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {showInternal && note.isInternal && (
            <Badge variant="secondary">
              <EyeOff className="h-3 w-3" />
              {t("notes.internal")}
            </Badge>
          )}
          <span className="text-xs text-gray-400">
            {formatDateTime(note.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MatterNotesTab({
  matterId,
  currentUserId,
  role,
}: {
  matterId: string;
  currentUserId?: string;
  role: "lawyer" | "user";
}) {
  const { t } = useTranslation("matters");
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const { data, isLoading } = useMatterNotes(matterId);
  const { addNote } = useMatterMutations();

  const notes = (data?.data ?? []).filter(
    (note) => role === "lawyer" || !note.isInternal,
  );

  const canSubmit =
    content.trim().length > 0 &&
    !addNote.isPending &&
    Boolean(currentUserId);

  const handleSubmit = () => {
    if (!canSubmit) return;
    addNote.mutate(
      {
        matterId,
        data: {
          matterId,
          authorUserId: currentUserId as string,
          content: content.trim(),
          isInternal,
        },
      },
      {
        onSuccess: () => {
          setContent("");
          setIsInternal(false);
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("notes.placeholder")}
          disabled={addNote.isPending}
        />
        {role === "lawyer" && (
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              disabled={addNote.isPending}
              className="h-3.5 w-3.5 accent-gray-900"
            />
            {t("notes.internal")}
            <span className="text-gray-400">({t("notes.internalHint")})</span>
          </label>
        )}
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-yellow-300 shadow-[3px_3px_0_0_#000] hover:bg-yellow-400"
          >
            <Check className="h-4 w-4" />
            {addNote.isPending ? t("notes.adding") : t("notes.add")}
          </Button>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 pt-2">
        {isLoading ? (
          <PageLoading
            title={t("loadingDetail.title")}
            description={t("loadingDetail.description")}
            skeletonCount={2}
          />
        ) : notes.length === 0 ? (
          <p className="text-sm text-gray-500">{t("notes.empty")}</p>
        ) : (
          <div className="divide-y divide-dashed divide-gray-200">
            {notes.map((note) => (
              <NoteRow
                key={note.id}
                note={note}
                showInternal={role === "lawyer"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}