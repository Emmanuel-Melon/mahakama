import type { Route } from "./+types/forgot-password";
import { ForgotPasswordScreen } from "@mah/feature/auth";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forgot Password - Mahakama" },
    {
      name: "description",
      content:
        "Forgot your password? No problem! Enter your email address and we'll send you a link to reset your password.",
    },
  ];
}

export default function ForgotPasswordRoute() {
  return <ForgotPasswordScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
