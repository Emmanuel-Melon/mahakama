import type { Route } from "./+types/index";
import { PageHeader } from "@mah/ui/components/organisms/layout/PageHeader";
import { Bell } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notifications - Mahakama Org" },
    { name: "description", content: "View your organization's notifications." },
  ];
}

export default function NotificationsIndex() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: "Notifications", icon: Bell }]} />

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          You're all caught up.
        </p>
      </div>
    </div>
  );
}
