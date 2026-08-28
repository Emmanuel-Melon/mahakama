import { EmptyState, ErrorState } from "@mah/ui";
import { PageLoading } from "~/components/molecules/page-loading";
import { MessageSquare } from "lucide-react";
import type { Consultation } from "@mah/api/src/clients/consultations.api";
import type { AsyncState } from "@mah/api/src/api/api.types";
import { ConsultationCard } from "../components/ConsultationCard";

interface ConsultationsScreenProps extends AsyncState {
  consultations: Consultation[];
  role: "lawyer" | "customer";
  onAccept?: (consultationId: string) => void;
  onDecline?: (consultationId: string, declineReason: string) => void;
}

export const ConsultationsScreen = ({
  consultations,
  isLoading,
  role,
  onAccept,
  onDecline,
}: ConsultationsScreenProps) => {
  if (isLoading) {
    return (
      <PageLoading
        title="Loading consultations"
        description="Please wait while we fetch your consultations..."
        skeletonCount={5}
      />
    );
  }

  if (consultations.length === 0) {
    return (
      <EmptyState
        title="No consultations yet"
        description={
          role === "lawyer"
            ? "Consultation requests from customers will show up here."
            : "Requests you send to lawyers will show up here."
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {consultations.map((consultation) => (
        <ConsultationCard
          key={consultation.id}
          consultation={consultation}
          role={role}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </div>
  );
};
