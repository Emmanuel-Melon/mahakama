import { useAppError } from "~/components/errors/useAppError";
import { VerifyAccountScreen } from "~/feature/auth/screens/VerifyAccountScreen";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";

export default function VerifyAccountRoute() {
  return <VerifyAccountScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
