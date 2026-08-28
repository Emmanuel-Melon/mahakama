import { useAppError } from "~/lib/errors/errors.registry";
import { VerifyAccountScreen } from "~/feature/auth/screens/VerifyAccountScreen";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export default function VerifyAccountRoute() {
  return <VerifyAccountScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
