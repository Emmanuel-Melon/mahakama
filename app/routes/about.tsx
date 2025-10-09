import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Mahakama - Democratizing Legal Access" },
    { name: "description", content: "Mahakama transforms complex legal documents into understandable information using AI. Learn about our mission to make legal rights accessible to everyone." },
    { name: "keywords", content: "about mahakama, legal technology, access to justice, legal rights, legal aid, human-centered design, legal innovation" },
  ];
}

export default function About() {
  return (
    <section className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">About Mahakama</h1>
      <div className="prose max-w-3xl">
        <p className="text-lg mb-4">
          Mahakama is a platform dedicated to connecting people with qualified legal professionals.
          Our mission is to make legal services more accessible and transparent for everyone.
        </p>
        <p className="mb-4">
          Whether you need legal advice, representation, or just have questions about the law,
          we're here to help you find the right legal expert for your needs.
        </p>
      </div>
    </section>
  );
}
