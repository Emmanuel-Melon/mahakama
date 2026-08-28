import { useAppError } from "~/lib/errors/errors.registry";
import { VerifyAccountScreen } from "@mah/feature/auth";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { AuthPaths } from "~/feature/auth/AuthConfig";

export default function VerifyAccountRoute() {
  return <VerifyAccountScreen loginPath={AuthPaths.login()} />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
