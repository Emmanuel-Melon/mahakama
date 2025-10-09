import type { Route } from "./+types/about";
import { Search, Globe, Clock, Gavel, FileText, Scale } from 'lucide-react';
import { HeroSection, FeaturesGrid, StepsSection, LegalServicesSection } from '~/components/about';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Mahakama - Free Legal Knowledge for East Africa" },
    { name: "description", content: "Mahakama provides free, accessible legal information for South Sudan and Uganda through AI-powered semantic search. Understand your rights in plain language without needing a lawyer." },
    { name: "keywords", content: "free legal help South Sudan, Uganda legal information, East Africa law, understand my rights, legal questions, no lawyer needed, legal self-help" },
  ];
}

const features = [
  {
    title: "Natural Language Search",
    description: "Search using everyday language - no legal jargon required. Ask questions like 'What should I do if my landlord changes the locks?' and get relevant legal information.",
    icon: Search
  },
  {
    title: "East Africa Focus",
    description: "Currently covering South Sudan and Uganda, with plans to expand across East Africa. All legal information is locally relevant and up-to-date.",
    icon: Globe
  },
  {
    title: "100% Free & Accessible",
    description: "Completely free to use with no hidden costs. We believe in making legal knowledge accessible to everyone, regardless of their financial situation.",
    icon: Clock
  }
];

const steps = [
  {
    number: 1,
    title: "Ask Your Question",
    description: "Type your legal question in everyday language, just like you'd ask a friend"
  },
  {
    number: 2,
    title: "Get Clear Answers",
    description: "Receive relevant legal information without confusing legal jargon"
  },
  {
    number: 3,
    title: "Understand Your Rights",
    description: "Learn what your rights are and what actions you can take next"
  }
];

const legalServices = [
  {
    title: "Legal Consultation",
    description: "Get personalized advice from experienced lawyers in our network",
    icon: Gavel
  },
  {
    title: "Document Review",
    description: "Have legal documents reviewed by professionals",
    icon: FileText
  },
  {
    title: "Case Representation",
    description: "Find representation for your legal matters when needed",
    icon: Scale
  }
];

export default function About() {
  return (
    <section className="container mx-auto py-12 px-4 space-y-12">
      <HeroSection 
        title="Free Legal Knowledge for East Africa"
        description="Get clear answers to your legal questions in plain language. No legal background needed, and it's completely free."
      />

      <div className="w-full mb-20">
        <div className="prose prose-lg text-muted-foreground mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Legal Knowledge, Made Simple</h2>
          <p className="mb-6">
            In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree.
          </p>
          <p className="mb-6">
            Mahakama changes that. Our AI-powered platform is completely free and lets you search using everyday language. Don't know the legal term for your issue? No problem. Just describe your situation as you would to a friend, and we'll find the relevant laws and regulations for you.
          </p>
          <p>
            While we can connect you with legal professionals if absolutely necessary, our primary goal is to empower you with knowledge first. Most legal questions can be resolved by understanding your rights and options - no lawyer required.
          </p>
        </div>
        
        <StepsSection 
          title="Get Legal Answers in 3 Simple Steps"
          steps={steps}
          footerText="Only if your situation is complex, we can help you find a lawyer in our network"
        />
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-semibold text-foreground text-center mb-12">
          Why Choose Mahakama?
        </h2>
        <FeaturesGrid features={features} />
      </div>

      <LegalServicesSection 
        services={legalServices}
        ctaText="Browse Legal Professionals"
        ctaHref="/lawyers"
      />
    </section>
  );
}
