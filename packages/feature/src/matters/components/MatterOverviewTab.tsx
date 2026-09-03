import type { Matter } from "@mah/api/src/clients/matters.api";
import { MatterSummaryCard } from "./MatterSummaryCard";

interface MatterOverviewTabProps {
  matter: Matter;
  role: "lawyer" | "user";
}

export const MatterOverviewTab = ({ matter, role }: MatterOverviewTabProps) => {
  return (
    <div className="space-y-6">
      <MatterSummaryCard matter={matter} role={role} />
    </div>
  );
};
