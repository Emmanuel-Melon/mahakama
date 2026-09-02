import type { Route } from "./+types/$matterId";
import { useParams, Link } from "react-router";
import { PageHeader } from "@mah/ui/components/organisms/layout/PageHeader";
import { FolderOpen } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Matter Details - Mahakama Org" },
    { name: "description", content: "View details for this matter." },
  ];
}

export default function MatterDetail() {
  const { matterId } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Matters", to: "/matters", icon: FolderOpen },
          { label: matterId || "Matter" },
        ]}
      />

      <div className="rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-bold">Matter {matterId}</h1>
        <p className="mt-2 text-muted-foreground">
          Matter details will be shown here.
        </p>
      </div>
    </div>
  );
}
