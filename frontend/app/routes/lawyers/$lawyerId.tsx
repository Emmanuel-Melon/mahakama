import type { Route } from "./+types/$lawyerId";
import { LawyerProfileScreen } from "~/feature/lawyers/screens/LawyerProfileScreen";
import { useLawyer } from "~/feature/lawyers/hooks/use-lawyers";
import { PageDetailsLoading } from "~/components/page-details-loading";
import { PageDetailsError } from "~/components/page-details-error";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

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

export default function LawyerProfile({ params }: Route.ComponentProps) {
  const { lawyerId } = params;
  const { data: lawyer, error, isLoading } = useLawyer(lawyerId || '');
  
  return <LawyerProfileScreen lawyer={lawyer} error={null} isLoading={false} />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return (
    <MahErrorBoundary
      status={error.status}
      data={error.data}
    />
  );
}