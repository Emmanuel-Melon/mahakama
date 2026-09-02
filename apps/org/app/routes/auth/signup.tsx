import type { Route } from "./+types/signup";
import { SignupScreen } from "@mah/feature/auth";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Up - Mahakama" },
    {
      name: "description",
      content:
        "Create a new Mahakama account to access your legal resources and history.",
    },
  ];
}

export default function SignupRoute() {
  return <SignupScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
