import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, FolderOpen, Pencil, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@mah/ui";
import { Badge } from "@mah/ui/components/badge";
import { Input } from "@mah/ui/components/Input";
import { IconContainer } from "@mah/ui/components/IconContainer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mah/ui/components/select";
import { useMatterMutations } from "@mah/api/src/hooks/use-matters";
import type { Matter } from "@mah/api/src/clients/matters.api";

type BadgeVariant = "default" | "secondary" | "destructive";

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  draft: "secondary",
  open: "default",
  waiting_client: "secondary",
  waiting_lawyer: "secondary",
  in_progress: "default",
  resolved: "default",
  closed: "secondary",
  archived: "secondary",
};

const STATUS_OPTIONS: Matter["status"][] = [
  "draft",
  "open",
  "waiting_client",
  "waiting_lawyer",
  "in_progress",
  "resolved",
  "closed",
  "archived",
];

export function MatterHeader({
  matter,
  role,
}: {
  matter: Matter;
  role: "lawyer" | "user";
}) {
  const { t } = useTranslation("matters");
  const { updateMatter } = useMatterMutations();

  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(matter.title);

  const statusLabel = t(`status.${matter.status}`);

  const startEdit = () => {
    setDraftTitle(matter.title);
    setEditingTitle(true);
  };

  const cancelEdit = () => setEditingTitle(false);

  const saveTitle = () => {
    const title = draftTitle.trim();
    if (!title || title === matter.title) {
      setEditingTitle(false);
      return;
    }
    updateMatter.mutate(
      { matterId: matter.id, data: { title } },
      { onSuccess: () => setEditingTitle(false) },
    );
  };

  const changeStatus = (status: string) => {
    if (status === matter.status || updateMatter.isPending) return;
    updateMatter.mutate({
      matterId: matter.id,
      data: { status: status as Matter["status"] },
    });
  };

  const toggleSharedWithLawyer = () => {
    updateMatter.mutate({
      matterId: matter.id,
      data: { isSharedWithLawyer: !matter.isSharedWithLawyer },
    });
  };

  return (
    <header className="sticky top-0 z-30 border-b-2 border-gray-900 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <IconContainer
              icon={FolderOpen}
              size="md"
              color="handdrawn"
              className="shrink-0"
            />
            <div className="min-w-0">
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveTitle();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                    disabled={updateMatter.isPending}
                    className="max-w-xs border-2 border-gray-900"
                  />
                  <Button
                    size="sm"
                    onClick={saveTitle}
                    disabled={updateMatter.isPending || !draftTitle.trim()}
                    className="gap-1.5 border-2 border-black rounded-lg text-gray-900 bg-yellow-300 shadow-[2px_2px_0_0_#000] hover:bg-yellow-400"
                  >
                    <Check className="h-4 w-4" />
                    {updateMatter.isPending
                      ? t("header.saving")
                      : t("header.save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancelEdit}
                    disabled={updateMatter.isPending}
                  >
                    {t("header.cancel")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="text-2xl font-black text-gray-900 truncate">
                    {matter.title}
                  </h1>
                  <button
                    type="button"
                    onClick={startEdit}
                    aria-label={t("header.editTitle")}
                    className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant={STATUS_VARIANT[matter.status] ?? "secondary"}>
                  {statusLabel}
                </Badge>
                {role === "lawyer" && (
                  <Select
                    value={matter.status}
                    onValueChange={changeStatus}
                    disabled={updateMatter.isPending}
                  >
                    <SelectTrigger className="h-7 w-fit gap-1.5 rounded-md border-2 border-gray-900 text-xs shadow-none [&_svg]:size-3.5">
                      <span className="sr-only">{t("header.changeStatus")}</span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`status.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {role === "user" && (
            <div className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSharedWithLawyer}
                disabled={updateMatter.isPending}
                className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
              >
                {matter.isSharedWithLawyer ? (
                  <UserCheck className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {updateMatter.isPending
                  ? t("header.updatingRequest")
                  : matter.isSharedWithLawyer
                    ? t("header.requestedLawyer")
                    : t("header.requestLawyer")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}