import { defineRoutes } from "@mah/client/nav";

export const billingRoutes = defineRoutes({
  index: { path: "billing", file: "routes/billing/index.tsx" },
});

export const BillingPaths = billingRoutes.to;
