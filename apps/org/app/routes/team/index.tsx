import type { Route } from "./+types/index";
import { Link } from "react-router";
import { PageHeader } from "@mah/ui/components/organisms/layout/PageHeader";
import { Users, UserPlus } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Team - Mahakama Org" },
    { name: "description", content: "Manage your organization's team members." },
  ];
}

export default function TeamIndex() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: "Team", icon: Users }]}>
        <Link
          to="/team/invite"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-black rounded-lg bg-yellow-300 shadow-[2px_2px_0_0_#000]"
        >
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Link>
      </PageHeader>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          No team members found. Invite your first member to get started.
        </p>
      </div>
    </div>
  );
}
