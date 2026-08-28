import { Button } from "@mah/ui";
import { Badge } from "@mah/ui/components/badge";
import type { Consultation } from "@mah/api/src/clients/consultations.api";

interface ConsultationCardProps {
  consultation: Consultation;
  role: "lawyer" | "customer";
  onAccept?: (consultationId: string) => void;
  onDecline?: (consultationId: string, declineReason: string) => void;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> =
  {
    pending: "secondary",
    accepted: "default",
    engaged: "default",
    declined: "destructive",
    closed: "secondary",
  };

export const ConsultationCard = ({
  consultation,
  role,
  onAccept,
  onDecline,
}: ConsultationCardProps) => {
  const canRespond = role === "lawyer" && consultation.status === "pending";

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <Badge variant={STATUS_VARIANT[consultation.status] ?? "secondary"}>
          {consultation.status}
        </Badge>
        {consultation.requestMessage && (
          <p className="text-sm text-muted-foreground">
            {consultation.requestMessage}
          </p>
        )}
      </div>

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
  );
};
