import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@mah/ui/components/avatar";
import { MahCard } from "@mah/ui/components/atoms/MahCard";
import type { Client } from "@mah/api/src/clients/clients.api";

interface ClientCardProps {
  client: Client;
}

const initials = (name?: string | null): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "—";

export const ClientCard = ({ client }: ClientCardProps) => {
  const { t } = useTranslation("clients");

  return (
    <MahCard variant="minimal">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={client.profilePicture ?? undefined} />
            <AvatarFallback>{initials(client.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate">{client.name || "—"}</p>
            <p className="text-sm text-muted-foreground truncate">
              {client.email || "—"}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end text-sm text-muted-foreground shrink-0">
          <span>{client.city || "—"}</span>
          <span>
            {t("fields.joined")} {formatDate(client.createdAt)}
          </span>
        </div>
      </div>
    </MahCard>
  );
};
