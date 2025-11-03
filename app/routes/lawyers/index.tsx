import type { Route } from "./+types/index";
import { LawyersList } from "~/lawyers/lawyers-list";
import { HeroSection } from "~/components/layouts/HeroSection";
import { Gavel } from "lucide-react";
import { ErrorDisplay } from "~/components/async-state/error";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { lawyersApi } from "~/lib/api/lawyers.api";
import { parseCookies } from "~/lib/api/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Find Vetted Lawyers in South Sudan & Uganda - Mahakama" },
    {
      name: "description",
      content:
        "Connect with experienced, vetted legal professionals in South Sudan and Uganda. Get expert help with family law, employment rights, housing issues, and more through our trusted network.",
    },
    {
      name: "keywords",
      content:
        "find lawyer South Sudan, Uganda attorneys, legal professionals, vetted lawyers, legal consultation, family law, employment law, housing rights, legal representation",
    },
    {
      name: "og:title",
      content: "Find Trusted Legal Professionals - Mahakama",
    },
    {
      name: "og:description",
      content:
        "Connect with vetted legal experts in South Sudan and Uganda for personalized legal assistance and representation when you need it most.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Find Vetted Lawyers in East Africa" },
    {
      name: "twitter:description",
      content:
        "Mahakama connects you with trusted legal professionals in South Sudan and Uganda for expert legal advice and representation.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;
    const lawyers = await lawyersApi.getLawyers(
      {
        language: "English",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      lawyers,
      error: null,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return {
      lawyers: [],
      error:
        "Unable to load lawyers at this time. Please check your connection and try again later.",
      timestamp: new Date().toISOString(),
    };
  }
}

export default function LawyersPage({ loaderData }: Route.ComponentProps) {
  const { lawyers, error } = loaderData;
  return (
    <div className="min-h-screen">
      <div className="bg-background">
        <HeroSection
          title="Find Trusted Legal Professionals"
          description="Connect with vetted lawyers and legal experts in various fields of law. Get the right legal assistance for your specific needs."
          actionVariant="search"
          icon={Gavel}
        />
        <DiagonalSeparator />
      </div>
      <div className="w-full bg-background/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error ? (
            <ErrorDisplay error={error} />
          ) : (
            <LawyersList lawyers={lawyers} />
          )}
        </div>
      </div>
    </div>
  );
}
