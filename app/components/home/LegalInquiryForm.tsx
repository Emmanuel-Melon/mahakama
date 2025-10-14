import { useEffect, useState } from "react";
import { ExampleQuestions } from "./ExampleQuestions";
import { BorderedBox } from "~/components/ui/bordered-box";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { useFetcher } from "react-router";
import { User } from "lucide-react";
import { IconContainer } from "../icon-container";

interface LegalInquiryFormProps {
  onSubmit?: () => void;
}

export function LegalInquiryForm({ onSubmit }: LegalInquiryFormProps) {
  const [inquiry, setInquiry] = useState("");
  const fetcher = useFetcher();

  const handleExampleClick = (question: string) => {
    setInquiry(question);
    // Auto-focus the textarea after selecting an example
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.focus();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInquiry(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.trim()) return;

    // Submit the form data to the home route action
    fetcher.submit({ question: inquiry }, { method: "post", action: "/" });
  };

  // Reset the form after successful submission
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setInquiry("");
      if (onSubmit) {
        onSubmit();
      }
    }
  }, [fetcher.state, fetcher.data, onSubmit]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          <IconContainer icon={User} color="handdrawn" size="lg" />
        </div>
        <div className="space-y-4">
          <div className="relative inline-block">
            <h2 className="text-2xl font-black text-gray-900 font-serif">
              Ask a Legal Question
            </h2>
            <div className="absolute -bottom-1 left-0 right-0 h-2.5 bg-yellow-200/60 -rotate-1 transform -z-10"></div>
          </div>
        </div>
      </div>
      <BorderedBox
        className="p-6"
        borderColor="border-gray-900"
        borderRadius="rounded-xl"
        gradientFrom="from-white"
        gradientTo="from-slate-50"
      >
        <fetcher.Form method="post" onSubmit={handleSubmit} className="w-full">
          <div className="relative z-10">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question" className="sr-only">
                  Legal Question
                </Label>
                <div className="relative">
                  <Textarea
                    id="question"
                    name="question"
                    value={inquiry}
                    onChange={handleTextareaChange}
                    placeholder="Type your legal question here..."
                    className="min-h-[120px] border-2 border-gray-900 focus-visible:ring-yellow-400 focus-visible:ring-2 focus-visible:ring-offset-0"
                    style={{
                      boxShadow: "2px 2px 0 0 #000",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                    }}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className={`relative px-6 py-3 text-sm font-bold border-2 border-gray-900 transition-all duration-200 transform ${
                    fetcher.state !== "idle"
                      ? "opacity-70 cursor-wait"
                      : "hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
                  }`}
                  disabled={fetcher.state !== "idle"}
                  style={{
                    borderRadius: "6px 12px 6px 12px",
                    boxShadow: "2px 2px 0 0 #000",
                  }}
                >
                  {fetcher.state !== "idle"
                    ? "Getting Answer..."
                    : "Get Answer"}
                  <span className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-gray-900"></span>
                  <span className="absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-900"></span>
                </Button>
              </div>
            </div>
          </div>
        </fetcher.Form>
      </BorderedBox>
      <ExampleQuestions handleExampleClick={handleExampleClick} />
    </section>
  );
}
