import {
  Search,
  Globe,
  Clock,
  Gavel,
  FileText,
  Scale,
  BookOpen,
} from "lucide-react";
import { DiagonalSeparator } from "~/components/atoms/diagnoal-separator";
import { AboutIntro } from "~/feature/www/components/about/Intro";
import { HeroSection } from "~/layouts/HeroSection";
import { FeaturesGrid } from "../components/about/FeaturesGrid";
import { LegalServicesSection } from "../components/about/LegalServicesSection";
import { StepsSection } from "../components/about/StepsSection";

const features = [
  {
    title: "Natural Language Search",
    description:
      "Search using everyday language - no legal jargon required. Ask questions like 'What should I do if my landlord changes the locks?' and get relevant legal information.",
    icon: Search,
  },
  {
    title: "East Africa Focus",
    description:
      "Currently covering South Sudan and Uganda, with plans to expand across East Africa. All legal information is locally relevant and up-to-date.",
    icon: Globe,
  },
  {
    title: "100% Free & Accessible",
    description:
      "Completely free to use with no hidden costs. We believe in making legal knowledge accessible to everyone, regardless of their financial situation.",
    icon: Clock,
  },
];

const steps = [
  {
    number: 1,
    title: "Ask Your Question",
    description:
      "Type your legal question in everyday language, just like you'd ask a friend",
  },
  {
    number: 2,
    title: "Get Clear Answers",
    description:
      "Receive relevant legal information without confusing legal jargon",
  },
  {
    number: 3,
    title: "Understand Your Rights",
    description:
      "Learn what your rights are and what actions you can take next",
  },
];

const legalServices = [
  {
    title: "Legal Consultation",
    description:
      "Get personalized advice from experienced lawyers in our network",
    icon: Gavel,
  },
  {
    title: "Document Review",
    description: "Have legal documents reviewed by professionals",
    icon: FileText,
  },
  {
    title: "Case Representation",
    description: "Find representation for your legal matters when needed",
    icon: Scale,
  },
];

export const AboutScreen = () => {
  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <HeroSection
          title="Free Legal Knowledge for East Africa"
          description="Get clear answers to your legal questions in plain language. No legal background needed, and it's completely free."
          icon={BookOpen}
        />
        <DiagonalSeparator />
        <div className="space-y-16">
          <div className="space-y-8">
            <AboutIntro />
            <StepsSection
              title="Get Legal Answers in 3 Simple Steps"
              icon={Search}
              description="Mahakama is a free legal knowledge platform for East Africa. Get clear answers to your legal questions in plain language. No legal background needed, and it's completely free."
              steps={steps}
              footerText="Only if your situation is complex, we can help you find a lawyer in our network"
            />
          </div>

          <FeaturesGrid features={features} />

          <LegalServicesSection
            services={legalServices}
            ctaText="Browse Legal Professionals"
            ctaHref="/lawyers"
          />
        </div>
      </div>
    </div>
  );
};
