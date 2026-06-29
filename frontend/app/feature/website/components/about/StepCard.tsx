import { IconContainer } from "~/components/icon-container";
import { Search, FileText, MessageCircle } from "lucide-react";

type StepCardProps = {
  number: number;
  title: string;
  description: string;
};

const stepIcons = {
  1: Search,
  2: FileText,
  3: MessageCircle,
} as const;

export function StepCard({ number, title, description }: StepCardProps) {
  const Icon = stepIcons[number as keyof typeof stepIcons];
  return (
    <li
      className="relative p-6 bg-white border-2 border-gray-900 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-y-1"
      style={{
        borderRadius: "16px 8px 16px 8px",
        border: "2px solid #000",
        boxShadow: "4px 4px 0 0 #000",
      }}
    >
      {/* Decorative corner elements */}
      <div className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900 bg-yellow-300"></div>
      <div className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900 bg-yellow-300"></div>

      <div className="flex flex-col gap-4">
        <IconContainer icon={Icon} size="lg" color="outline" className="mb-2" />

        <div className="relative">
          <h3 className="text-xl font-black text-gray-900 relative inline-block">
            {title}
            <div className="absolute -bottom-1 left-0 right-0 h-2 bg-yellow-200/60 -rotate-1 -z-10"></div>
          </h3>
          <p className="text-gray-700 mt-3 font-medium">{description}</p>
        </div>
      </div>

      {/* Hand-drawn underline for the card */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)",
        }}
      ></div>
    </li>
  );
}
