import type { Route } from "./+types/index";
import { DashboardScreen } from "~/feature/dashboard/screens/DashboardScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Mahakama Admin" },
    { name: "description", content: "Overview of activity across Mahakama." },
  ];
}

export default function DashboardRoute() {
  return <DashboardScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
