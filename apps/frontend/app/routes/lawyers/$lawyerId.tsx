import type { Route } from "./+types/$lawyerId";
import { LawyerProfileScreen } from "~/feature/lawyers/screens/LawyerProfileScreen";
import { useLawyer } from "@mah/api/src/hooks/use-lawyers";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";

export function meta({ params }: Route.MetaArgs) {
  const { lawyerId } = params;
  const title = lawyerId
    ? `Lawyer Profile - Mahakama`
    : "Lawyer Profile - Mahakama";

  return [
    { title },
    {
      name: "description",
      content: `View the profile of our legal expert. Contact for professional legal services.`,
    },
  ];
}

export default function LawyerProfileRoute({ params }: Route.ComponentProps) {
  const { lawyerId } = params;
  const { data: lawyer, error, isLoading } = useLawyer(lawyerId || "");

  // Pass the actual hook states down to the screen component
  return (
    <LawyerProfileScreen lawyer={lawyer} error={error} isLoading={isLoading} />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
