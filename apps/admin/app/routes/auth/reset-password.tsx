import type { Route } from "./+types/reset-password";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { useAppError } from "~/lib/errors/errors.registry";
import { PasswordResetScreen } from "~/feature/auth/screens/PasswordResetScreen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Update Password - Ivyi" },
    { name: "description", content: "Choose a new secure account password" },
  ];
}

export default function ResetPassword() {
  return <PasswordResetScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
