import type { Route } from "./+types/index";
import { DashboardScreen } from "~/feature/dashboard/screens/DashboardScreen";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";

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