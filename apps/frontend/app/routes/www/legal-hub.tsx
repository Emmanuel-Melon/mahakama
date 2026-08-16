import type { Route } from "../+types/legal-hub";
import { LegalHubScreen } from "~/feature/www/screens/LegalHubScreen";
import { authContext, userContext } from "~/middleware/context";
import { useServices } from "~/feature/www/hooks/use-services";
import { LoadingState } from "~/components/async-state/LoadingState";
import { ErrorState } from "~/components/async-state/ErrorState";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Legal Services Directory - Mahakama" },
    {
      name: "description",
      content:
        "Find legal services, government offices, and legal aid providers in South Sudan and Uganda.",
    },
    {
      name: "keywords",
      content:
        "legal aid South Sudan, government offices, dispute resolution, legal services, legal assistance, Uganda legal help, free legal aid, court services, mediation centers",
    },
    {
      name: "og:title",
      content: "Find Legal Services & Institutions - Mahakama",
    },
    {
      name: "og:description",
      content:
        "Access a comprehensive directory of legal institutions and service providers in South Sudan and Uganda. Connect with the right legal resources for your needs.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Legal Institutions Directory - Mahakama",
    },
    {
      name: "twitter:description",
      content:
        "Find government offices, legal aid providers, and dispute resolution services in South Sudan and Uganda.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    return { user, token, error: null };
  } catch (error) {
    return {
      user: null,
      token: null,
      error: error instanceof Error ? error.message : "Failed to load services",
    };
  }
}

export default function LegalHubPage({ loaderData }: Route.ComponentProps) {
  const { user, error } = loaderData;
  if (error) return <ErrorState error={error} />;

  const {
    data: services,
    isLoading,
    error: servicesError,
  } = useServices(undefined);
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");

  if (isLoading) return <LoadingState />;
  const errorMessage = servicesError
    ? servicesError instanceof Error
      ? servicesError.message
      : "Failed to load services"
    : error || "Failed to load services";
  if (servicesError || error) return <ErrorState error={errorMessage} />;

  return (
    <LegalHubScreen
      services={services ?? []}
      isAuthenticated={!!user}
      displayMode={displayMode}
      onDisplayModeChange={setDisplayMode}
    />
  );
}
