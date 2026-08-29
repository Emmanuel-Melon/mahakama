import { MessageSquare, ChevronRight } from "lucide-react";
import { Badge } from "@mah/ui/components/badge";
import { Button } from "@mah/ui";
import { MahButton } from "@mah/ui/components/molecules/MahButton";
import { MahCard } from "@mah/ui/components/atoms/MahCard";
import type { Consultation } from "@mah/api/src/clients/consultations.api";

interface ConsultationCardProps {
  consultation: Consultation;
  role: "lawyer" | "customer";
  onAccept?: (consultationId: string) => void;
  onDecline?: (consultationId: string, declineReason: string) => void;
}

type BadgeVariant = "default" | "secondary" | "destructive";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  engaged: "Engaged",
  closed: "Closed",
};

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  pending: "secondary",
  accepted: "default",
  engaged: "default",
  declined: "destructive",
  closed: "secondary",
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "—";

export const ConsultationCard = ({
  consultation,
  role,
  onAccept,
  onDecline,
}: ConsultationCardProps) => {
  const canRespond = role === "lawyer" && consultation.status === "pending";
  const statusLabel = STATUS_LABEL[consultation.status] ?? consultation.status;

  return (
    <MahCard variant="minimal">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Badge
            variant={STATUS_VARIANT[consultation.status] ?? "secondary"}
            className="shrink-0"
          >
            {statusLabel}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Requested {formatDate(consultation.createdAt)}
          </span>
        </div>
        <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0" />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {consultation.requestMessage || "No message included with this request."}
      </p>

      <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-2">
        <MahButton
          href={`/consultations/${consultation.id}`}
          variant="card"
          className="flex-1 min-w-[160px]"
        >
          View Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </MahButton>
        {canRespond && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onAccept?.(consultation.id)}>
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDecline?.(consultation.id, "Not a good fit")}
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    </MahCard>
  );
};