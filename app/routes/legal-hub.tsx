import type { Route } from "./+types/legal-hub";
import { LegalHubScreen } from "~/feature/website/screens/LegalHubScreen";
import { servicesApi } from "~/lib/api/services.api";
import { getForwardHeaders, parseCookies } from "~/lib/api/utils";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Legal Services Directory - Mahakama" },
    {
      name: "description",
      content: "Find legal services, government offices, and legal aid providers in South Sudan and Uganda.",
    },
    {
      name: "keywords",
      content: "legal aid South Sudan, government offices, dispute resolution, legal services, legal assistance, Uganda legal help, free legal aid, court services, mediation centers",
    },
    {
      name: "og:title",
      content: "Find Legal Services & Institutions - Mahakama",
    },
    {
      name: "og:description",
      content: "Access a comprehensive directory of legal institutions and service providers in South Sudan and Uganda. Connect with the right legal resources for your needs.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Legal Institutions Directory - Mahakama" },
    {
      name: "twitter:description",
      content: "Find government offices, legal aid providers, and dispute resolution services in South Sudan and Uganda.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;
    
    return { token, error: null };
  } catch (error) {
    console.error("Error loading services:", error);
    return { 
      token: null,
      error: error instanceof Error ? error.message : "Failed to load services" 
    };
  }
}

export default function LegalHubPage({ loaderData }: Route.ComponentProps) {
  const { token, error } = loaderData;
  console.log('token', token);
  console.log('error', error);
  return <LegalHubScreen token={token} error={error} />;
}