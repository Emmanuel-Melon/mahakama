import type { Route } from "./+types/onboarding";
import { OnboardingScreen } from "@mah/feature/onboarding";
import { redirect } from "react-router";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Onboarding - Mahakama Admin" },
    {
      name: "description",
      content:
        "Onboarding page for Mahakama admin account to access your legal resources and history.",
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

    if (user.role === "lawyer") {
      return redirect("/onboarding/lawyer");
    }

    return { user, token, error: null };
  } catch (error) {
    handleRouteError(error, "Failed to load onboarding");
  }
}

export default function OnboardingRoute({ loaderData }: Route.ComponentProps) {
  const { user, token } = loaderData;

  return <OnboardingScreen user={user} token={token} successPath="/" />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
