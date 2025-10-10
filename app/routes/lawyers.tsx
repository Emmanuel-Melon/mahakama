import type { Route } from "./+types/lawyers";
import { LawyersList } from "~/components/lawyers/lawyers-list";
import { HeroSection } from "~/components/about/HeroSection";
import type { Lawyer } from "app/types/lawyer";
import { ErrorDisplay } from "~/components/async-state/error";
import { DiagonalSeparator } from "~/components/diagnoal-separator";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Find Legal Experts - Mahakama Legal Network" },
    { name: "description", content: "Connect with vetted legal professionals through Mahakama's network. Get expert legal assistance in family law, employment, housing, and more." },
    { name: "keywords", content: "find lawyer, legal professionals, attorney directory, legal help, legal consultation, legal experts, mahakama lawyers" },
  ];
}

export async function loader() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('https://makakama-api.netlify.app/.netlify/functions/api/lawyers', {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch lawyers: ${response.status} ${response.statusText}`);
    }

    const lawyers: Lawyer[] = await response.json();
    return {
      lawyers,
      error: null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    return {
      lawyers: [],
      error: 'Unable to load lawyers at this time. Please check your connection and try again later.',
      timestamp: new Date().toISOString()
    };
  }
}

export default function Lawyers({ loaderData }: Route.ComponentProps) {
  const { lawyers, error } = loaderData;

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Find Trusted Legal Professionals"
        description="Connect with vetted lawyers and legal experts in various fields of law. Get the right legal assistance for your specific needs."
        actionVariant="search"
      />
      <DiagonalSeparator />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="container mx-auto py-8">
          <div className="w-full">
            {error ? (
              <ErrorDisplay error={error} />
            ) : (
              <div className="bg-background/50">
                <LawyersList lawyers={lawyers} />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
