import type { Route } from "./+types/onboarding";
import { OnboardingScreen } from "~/feature/users/screens/OnboardingScreen";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Onboarding - Mahakama" },
    {
      name: "description",
      content:
        "Onboarding page for Mahakama account to access your legal resources and history.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    if (!user || !token) {
      throw new Response("User not authenticated", { status: 401 });
    }
    return { user, token, error: null };
  } catch (error) {
    handleRouteError(error, "Failed to load onboarding");
  }
}

export default function OnboardingRoute({ loaderData }: Route.ComponentProps) {
  const { user, token } = loaderData;

  return <OnboardingScreen user={user} token={token} />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
