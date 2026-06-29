import type { Route } from "./+types/signup";
import { SignupScreen } from "~/feature/auth/screens/SignupScreen";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Signup - Mahakama" },
    {
      name: "description",
      content:
        "Sign up to your Mahakama account to access your legal resources and history.",
    },
  ];
}

export default SignupScreen;

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
