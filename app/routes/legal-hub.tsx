import type { Route } from "./+types/legal-hub";
import { LegalHubScreen } from "~/feature/website/LegalHubScreen";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Legal Institutions & Service Providers - Mahakama" },
    {
      name: "description",
      content: "Find government offices, legal aid providers, and dispute resolution services in South Sudan and Uganda. Connect with the right legal resources for your needs.",
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

export default LegalHubScreen;