import type { Route } from "./+types/login"; 
import { LoginScreen } from '~/feature/auth/screens/LoginScreen';
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login - Mahakama" },
    {
      name: "description",
      content:
        "Sign in to your Mahakama account to access your legal resources and history.",
    },
  ];
}

export default LoginScreen;

export function ErrorBoundary() {
  const error = useAppError();

  return (
    <MahErrorBoundary
      status={error.status}
      data={error.data}
    />
  );
}