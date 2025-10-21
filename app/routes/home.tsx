import type { Route } from "./+types/home";
import { LegalInquiryForm } from "../components/home/LegalInquiryForm";
import { submitLegalInquiry } from "~/pages/home/api";
import { useState } from "react";

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

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const question = formData.get("question") as string;
  const country = (formData.get("country") as string) || "South Sudan";

  if (!question) {
    return { error: "Question is required" };
  }
  const data = await submitLegalInquiry(question, country);

  // Redirect to the chat view with the chat ID
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/chat/${data?.chatId}`,
    },
  });
}

type ActionData = { error: string } | null;

export default function Home({ actionData }: { actionData: ActionData }) {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const handleFormSubmit = (question: string) => {
    setCurrentQuestion(question);
    // Scroll to the answer section after a short delay to allow for re-render
    setTimeout(() => {
      const answerSection = document.getElementById("answer-section");
      if (answerSection) {
        answerSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-6xl mx-auto">
      <section className="p-6 flex-1">
        <div className="space-y-4">
          <div className="space-y-6">
            <LegalInquiryForm
              onSubmit={() => {
                const form = document.querySelector("form");
                if (form) {
                  const questionInput = form.querySelector(
                    'textarea[name="question"]',
                  ) as HTMLTextAreaElement;
                  if (questionInput && questionInput.value.trim()) {
                    handleFormSubmit(questionInput.value.trim());
                    form.requestSubmit();
                  }
                }
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
