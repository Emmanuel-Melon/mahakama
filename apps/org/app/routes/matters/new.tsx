import type { Route } from "./+types/new";
import { Link } from "react-router";
import { PageHeader } from "@mah/ui/components/organisms/layout/PageHeader";
import { FolderOpen } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New Matter - Mahakama Org" },
    { name: "description", content: "Create a new legal matter." },
  ];
}

export default function NewMatter() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Matters", to: "/matters", icon: FolderOpen },
          { label: "New" },
        ]}
      />

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          Matter creation form will go here.
        </p>
      </div>
    </div>
  );
}
