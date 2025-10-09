import type { Route } from "./+types/lawyers";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Find Legal Experts - Mahakama Legal Network" },
    { name: "description", content: "Connect with vetted legal professionals through Mahakama's network. Get expert legal assistance in family law, employment, housing, and more." },
    { name: "keywords", content: "find lawyer, legal professionals, attorney directory, legal help, legal consultation, legal experts, mahakama lawyers" },
  ];
}

export default function Lawyers() {
  // In a real app, this would fetch lawyers from an API
  const lawyers = [
    { id: 1, name: "John Doe", specialization: "Family Law", experience: "10+ years" },
    { id: 2, name: "Jane Smith", specialization: "Corporate Law", experience: "8+ years" },
    { id: 3, name: "Robert Johnson", specialization: "Criminal Defense", experience: "15+ years" },
  ];

  return (
    <section className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find a Lawyer</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lawyers.map((lawyer) => (
          <div key={lawyer.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{lawyer.name}</h2>
            <p className="text-muted-foreground mb-1">{lawyer.specialization}</p>
            <p className="text-sm text-muted-foreground">Experience: {lawyer.experience}</p>
            <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
