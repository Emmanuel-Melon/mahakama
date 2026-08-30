import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, UserRound, Briefcase, Check } from "lucide-react";
import { Button } from "@mah/ui";
import { Input } from "@mah/ui/components/Input";
import { Label } from "@mah/ui/components/Label";
import { Textarea } from "@mah/ui/components/Textarea";
import { Badge } from "@mah/ui/components/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mah/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mah/ui/components/select";
import { useDirectory } from "@mah/api/src/hooks/use-lawyers";
import { useMatterMutations } from "@mah/api/src/hooks/use-matters";
import { useUser } from "@mah/api/src/hooks/use-users";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";
import { useDebouncedValue } from "~/hooks/use-debounce";

const MATTER_LAWYER_ROLES = ["primary", "consulting", "referred"] as const;
type MatterLawyerRole = (typeof MATTER_LAWYER_ROLES)[number];

function DirectoryLawyerName({ userId }: { userId: string }) {
  const { data } = useUser(userId);
  return <>{data?.data?.name || ""}</>;
}

interface InviteLawyerDialogProps {
  matterId: string;
  assignedLawyerIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteLawyerDialog({
  matterId,
  assignedLawyerIds,
  open,
  onOpenChange,
}: InviteLawyerDialogProps) {
  const { t } = useTranslation("matters");

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);
  const [role, setRole] = useState<MatterLawyerRole>("primary");
  const [notes, setNotes] = useState("");

  const { data: directory, isLoading } = useDirectory(
    debouncedQuery ? { q: debouncedQuery } : undefined,
  );

  const { assignLawyer } = useMatterMutations({
    onAssignLawyerSuccess: () => {
      onOpenChange(false);
      setQuery("");
      setSelectedLawyerId(null);
      setNotes("");
      setRole("primary");
    },
  });

  const lawyers = directory?.data ?? [];
  const selectedLawyer = lawyers.find(
    (lawyer: Lawyer) => lawyer.id === selectedLawyerId,
  );

  const handleSubmit = () => {
    if (!selectedLawyerId) return;
    assignLawyer.mutate({
      matterId,
      data: {
        lawyerId: selectedLawyerId,
        role,
        notes: notes.trim() || null,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("lawyers.dialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("lawyers.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("lawyers.searchPlaceholder")}
              className="pl-9"
            />
          </div>

          <div className="max-h-64 overflow-y-auto rounded-md border divide-y divide-gray-100">
            {isLoading ? (
              <p className="p-4 text-sm text-gray-500">
                {t("loading.description")}
              </p>
            ) : lawyers.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                {t("lawyers.noResults")}
              </p>
            ) : (
              lawyers.map((lawyer: Lawyer) => {
                const isAssigned = assignedLawyerIds.includes(lawyer.id);
                const isSelected = selectedLawyerId === lawyer.id;

                return (
                  <button
                    key={lawyer.id}
                    type="button"
                    disabled={isAssigned}
                    onClick={() => setSelectedLawyerId(lawyer.id)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      isAssigned
                        ? "bg-gray-50 opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 cursor-pointer"
                    } ${isSelected ? "bg-gray-100" : ""}`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white">
                      <UserRound className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        <DirectoryLawyerName userId={lawyer.userId} />
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {lawyer.specialization || "—"}
                        {lawyer.location ? ` · ${lawyer.location}` : ""}
                      </p>
                      {lawyer.experienceYears ? (
                        <p className="text-xs text-gray-400 mt-0.5">
                          <Briefcase className="inline h-3 w-3 mr-1" />
                          {lawyer.experienceYears} {t("lawyers.years")}
                        </p>
                      ) : null}
                    </div>
                    {isAssigned ? (
                      <Badge variant="secondary">
                        {t("lawyers.alreadyAssigned")}
                      </Badge>
                    ) : isSelected ? (
                      <Check className="h-4 w-4 text-gray-900 shrink-0" />
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lawyer-role">{t("lawyers.role")}</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as MatterLawyerRole)}
              >
                <SelectTrigger id="lawyer-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATTER_LAWYER_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {t(`lawyers.roles.${r}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="invite-notes">{t("lawyers.notes")}</Label>
              <Textarea
                id="invite-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("lawyers.notesPlaceholder")}
                disabled={assignLawyer.isPending}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={assignLawyer.isPending}
          >
            {t("lawyers.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={assignLawyer.isPending || !selectedLawyer}
          >
            {assignLawyer.isPending
              ? t("lawyers.inviting")
              : selectedLawyer
                ? t("lawyers.invite")
                : t("lawyers.selectLawyer")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
