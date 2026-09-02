import type { Route } from "./+types/$memberId";
import { useParams } from "react-router";
import { PageHeader } from "@mah/ui/components/organisms/layout/PageHeader";
import { Users } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Team Member - Mahakama Org" },
    { name: "description", content: "View team member details." },
  ];
}

export default function TeamMemberDetail() {
  const { memberId } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Team", to: "/team", icon: Users },
          { label: memberId || "Member" },
        ]}
      />

      <div className="rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-bold">Member {memberId}</h1>
        <p className="mt-2 text-muted-foreground">
          Team member details will be shown here.
        </p>
      </div>
    </div>
  );
}
