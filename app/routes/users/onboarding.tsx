import type { Route } from "./+types/onboarding";
import { OnboardingScreen } from "~/feature/users/screens/OnboardingScreen";
import { authContext, userContext } from "~/middleware/context";
import { ErrorState } from "~/components/async-state/error";
import { useUpdateUser } from "~/feature/users/hooks/use-users";

export function meta({ }: Route.MetaArgs) {
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
    console.error("Error loading onboarding:", error);
    return { 
      user: null, 
      token: null, 
      error: error instanceof Error ? error.message : "Failed to load onboarding" 
    };
  }
}

export default function OnboardingPage({ loaderData }: Route.ComponentProps) {
  const { user, token, error } = loaderData;
  if (error) return <ErrorState error={error} />;
  if (!user || !token) return <ErrorState error="User not authenticated" />;
  const updateMutation = useUpdateUser();
  return (
    <OnboardingScreen 
      user={user}
      token={token}
      updateMutation={updateMutation}
    />
  );
}
