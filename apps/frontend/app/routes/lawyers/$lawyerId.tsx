import type { Route } from "./+types/$lawyerId";
import { LawyerProfileScreen } from "~/feature/lawyers/screens/LawyerProfileScreen";
import { useLawyer } from "@mah/api/src/hooks/use-lawyers";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

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

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    return { user, token, error: null };
  } catch (error) {
    handleRouteError(error, "Failed to load user data");
  }
}

export default function LawyerProfileRoute({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { lawyerId } = params;
  const { user, error } = loaderData;
  const {
    data: lawyer,
    error: lawyerError,
    isLoading,
  } = useLawyer(lawyerId || "");

  if (error)
    return (
      <MahErrorBoundary
        status={500}
        data="There was a problem loading your user session. Please try refreshing the page."
      />
    );

  return (
    <LawyerProfileScreen
      lawyer={lawyer}
      error={lawyerError}
      isLoading={isLoading}
      isAuthenticated={!!user}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
