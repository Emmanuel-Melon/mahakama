import type { Route } from "./+types/index";
import { Link } from "react-router";
import { PageHeader } from "@mah/ui/components/organisms/layout/PageHeader";
import { FolderOpen, Plus } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Matters - Mahakama Org" },
    { name: "description", content: "Manage your organization's legal matters." },
  ];
}

export default function MattersIndex() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Matters", icon: FolderOpen }]}
      >
        <Link
          to="/matters/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-black rounded-lg bg-yellow-300 shadow-[2px_2px_0_0_#000]"
        >
          <Plus className="h-4 w-4" />
          New Matter
        </Link>
      </PageHeader>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          No matters found. Create your first matter to get started.
        </p>
      </div>
    </div>
  );
}
