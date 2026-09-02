import type { Route } from "./+types/index";
import { PageHeader } from "@mah/ui/components/organisms/layout/PageHeader";
import { Settings as SettingsIcon } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - Mahakama Org" },
    { name: "description", content: "Manage your organization's settings." },
  ];
}

export default function SettingsIndex() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: "Settings", icon: SettingsIcon }]} />

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          Organization settings will go here.
        </p>
      </div>
    </div>
  );
}
