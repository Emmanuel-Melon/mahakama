import type { Route } from "./+types/lawyer-onboarding";
import { redirect } from "react-router";
import { LawyerOnboardingScreen } from "~/feature/lawyers/screens/LawyerOnboardingScreen";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";
import { createIsolatedClient } from "@mah/api/src/axios/axios.ssr";
import { LawyersApiClient } from "@mah/api/src/clients/lawyers.api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lawyer Onboarding - Mahakama" },
    {
      name: "description",
      content:
        "Complete your lawyer profile to get started on Mahakama's legal platform.",
    },
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  try {
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    if (!user || !token) {
      throw new Response("User not authenticated", { status: 401 });
    }

    if (user.role !== "lawyer") {
      return redirect("/onboarding");
    }

    let lawyerProfile = null;
    try {
      const isolatedClient = createIsolatedClient(request);
      const lawyersApi = new LawyersApiClient(isolatedClient);
      const res = await lawyersApi.getProfile();
      lawyerProfile = res?.data ?? null;
    } catch (error) {
      console.error("Failed to fetch lawyer profile in loader:", error);
    }

    return { user, token, lawyerProfile, error: null };
  } catch (error) {
    handleRouteError(error, "Failed to load lawyer onboarding");
  }
}

export default function LawyerOnboardingRoute({
  loaderData,
}: Route.ComponentProps) {
  const { user, token, lawyerProfile } = loaderData;

  return (
    <LawyerOnboardingScreen
      user={user}
      token={token}
      initialProfile={lawyerProfile}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
