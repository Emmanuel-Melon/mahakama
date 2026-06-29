import type { Route } from "./+types/index";
import { NewChatScreen } from "~/feature/chats/screens/NewChatScreen";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: "Mahakama - Legal Knowledge for Everyone in South Sudan & Uganda",
    },
    {
      name: "description",
      content:
        "Get free, plain-language answers to your legal questions about South Sudan and Uganda. Understand your rights without the legal jargon. No law degree required.",
    },
    {
      name: "keywords",
      content:
        "legal rights South Sudan, Uganda law, free legal advice, legal help, understand laws, tenant rights, worker rights, consumer protection, legal documents, mahakama",
    },
    {
      name: "og:title",
      content:
        "Mahakama - Legal Knowledge for Everyone in South Sudan & Uganda",
    },
    {
      name: "og:description",
      content:
        "Empowering citizens with free, easy-to-understand legal information. Know your rights in plain language before you need a lawyer.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Mahakama - Legal Knowledge for Everyone",
    },
    {
      name: "twitter:description",
      content:
        "Demystifying the law in South Sudan and Uganda with AI-powered legal assistance in plain language.",
    },
  ];
}

export default function Home() {
  return <NewChatScreen />;
}
