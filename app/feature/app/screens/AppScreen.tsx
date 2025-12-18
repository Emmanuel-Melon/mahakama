import { LegalInquiryForm } from "~/feature/app/components/LegalInquiryForm";
import { useState } from "react";


export const AppScreen = () => {
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
