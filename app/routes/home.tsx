import type { Route } from "./+types/home";
import { Header } from 'app/components/header'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mahakama - Legal Assistance Platform" },
    { name: "description", content: "Democratizing legal access through human-centered engineering. Understand your legal rights in plain language with our AI-powered legal assistance platform." },
    { name: "keywords", content: "legal assistance, legal rights, law help, legal documents, legal advice, mahakama, court, legal aid" },
  ];
}

export default function Home() {
  return (
    <section>
      <Header />
    </section>
  );
}
