import type { Route } from "./+types/lawyers";
import { LawyersList } from "~/components/lawyers/lawyers-list";
import type { Lawyer } from "app/types/lawyer";

export function meta({}: Route.MetaArgs) {
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
    <section className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Find a Lawyer</h1>
        <p className="text-muted-foreground mb-8">Connect with experienced legal professionals who can help with your specific needs.</p>
        
        {error ? (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground p-6 rounded-lg">
            <h3 className="font-medium mb-2">Connection Issue</h3>
            <p className="mb-4">{error}</p>
            <div className="text-sm text-muted-foreground">
              <p>While we work on restoring the connection, here's what you can do:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border">
            <LawyersList lawyers={lawyers} />
          </div>
        )}
      </div>
    </section>
  );
}
