import type { Matter } from "@mah/api/src/clients/matters.api";
import { UserMatterCard } from "./UserMatterCard";
import { LawyerMatterCard } from "./lawyer/LawyerMatterCard";

interface MattersListProps {
  matters: Matter[];
  role: "lawyer" | "user";
  viewMode?: "list" | "grid";
}

export const MattersList = ({
  matters,
  role,
  viewMode = "list",
}: MattersListProps) => {
  const containerClassName =
    viewMode === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "flex flex-col gap-4";

  return (
    <div className={containerClassName}>
      {matters.map((matter) =>
        role === "lawyer" ? (
          <LawyerMatterCard key={matter.id} matter={matter} />
        ) : (
          <UserMatterCard key={matter.id} matter={matter} />
        ),
      )}
    </div>
  );
};
