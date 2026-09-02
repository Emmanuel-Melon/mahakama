import type { Route } from "./+types/index";
import { PageHeader } from "@mah/ui/components/organisms/layout/PageHeader";
import { CreditCard } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Billing - Mahakama Org" },
    { name: "description", content: "Manage your organization's billing and subscription." },
  ];
}

export default function BillingIndex() {
  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: "Billing", icon: CreditCard }]} />

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          Billing and subscription details will go here.
        </p>
      </div>
    </div>
  );
}
