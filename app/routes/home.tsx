import type { Route } from "./+types/home";
import { IconContainer } from "~/components/icon-container";
import { Scale, Search, BookOpen, Users, MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { NavLink } from "react-router";
import { BorderedBox } from "~/components/ui/bordered-box";
import { HeroSection } from "~/components/layouts/HeroSection";
import { DiagonalSeparator } from "~/components/diagnoal-separator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mahakama - Legal Knowledge for Everyone" },
    {
      name: "description",
      content:
        "Access free legal information and resources for South Sudan and Uganda. Understand your rights in simple language.",
    },
  ];
}

const features = [
  {
    icon: Search,
    title: "Find Legal Answers",
    description:
      "Get clear, easy-to-understand answers to your legal questions.",
  },
  {
    icon: BookOpen,
    title: "Browse Documents",
    description: "Access a library of legal documents and resources.",
  },
  {
    icon: Users,
    title: "Connect with Experts",
    description: "Get guidance from legal professionals when you need it.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <HeroSection
        title="Legal Knowledge for Everyone"
        description="Free, easy-to-understand legal information for South Sudan and Uganda."
        icon={BookOpen}
      />
      <DiagonalSeparator />
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <BorderedBox key={index} className="p-6 h-full">
              <div className="text-yellow-500 mb-4">
                <feature.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </BorderedBox>
          ))}
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already using Mahakama to understand
            their legal rights.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 text-lg"
          >
            <NavLink to="/app">Start Exploring</NavLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
