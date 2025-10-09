import type { Route } from "./+types/lawyers";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Find Legal Experts - Mahakama Legal Network" },
    { name: "description", content: "Connect with vetted legal professionals through Mahakama's network. Get expert legal assistance in family law, employment, housing, and more." },
    { name: "keywords", content: "find lawyer, legal professionals, attorney directory, legal help, legal consultation, legal experts, mahakama lawyers" },
  ];
}

export async function loader() {
  try {
    const response = await fetch('https://makakama-api.netlify.app/.netlify/functions/api/lawyers');
    if (!response.ok) {
      throw new Error('Failed to fetch lawyers');
    }
    const lawyers = await response.json();
    return { lawyers };
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    return { lawyers: [] };
  }
}

export default function Lawyers({ loaderData }: Route.ComponentProps) {
  const { lawyers } = loaderData;

  return (
    <section className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find a Lawyer</h1>
      {lawyers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer: any) => (
            <div key={lawyer.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{lawyer.name}</h2>
              <p className="text-muted-foreground mb-1">{lawyer.specialization || 'Legal Professional'}</p>
              {lawyer.experience && (
                <p className="text-sm text-muted-foreground">Experience: {lawyer.experience}</p>
              )}
              <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No lawyers found. Please check back later.</p>
        </div>
      )}
    </section>
  );
}
