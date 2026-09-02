import type { Route } from "./+types/verify-email-pending";
import { VerifyEmailPendingScreen } from "@mah/feature/auth";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verify Email - Mahakama" },
    {
      name: "description",
      content: "Verify your Mahakama email address.",
    },
  ];
}

export default function VerifyEmailPendingRoute() {
  return <VerifyEmailPendingScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
