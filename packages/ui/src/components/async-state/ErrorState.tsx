import { Bug, type LucideIcon } from "lucide-react";
import { IconContainer, type ColorVariant } from "../IconContainer";
import { Button } from "../Button";
import type { ReactNode } from "react";

interface ErrorStateProps {
  icon: LucideIcon;
  title: string;
  iconColor?: string;
  details?: string;
  actions: ReactNode;
  showReportButton?: boolean;
}

export const ErrorState = ({
  icon: Icon,
  title,
  iconColor = "yellow",
  details,
  actions,
  showReportButton = true,
}: ErrorStateProps) => {
  const handleReport = () => {
    window.open(
      `mailto:support@mahakama.com?subject=${encodeURIComponent(title)} Issue`,
      "_blank",
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative mb-8">
        <IconContainer
          icon={Icon}
          size="lg"
          color={iconColor as ColorVariant}
          className="mb-8"
        />
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-4 px-2">
        {title}
      </h1>

      {details && (
        <div className="w-full max-w-md bg-white border-2 border-dashed border-gray-300 rounded-lg px-6 py-4 mb-8 shadow-[2px_2px_0_0_#000]">
          <div className="text-gray-700 text-sm md:text-base leading-relaxed">
            {details}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 w-full max-w-xs md:max-w-none">
        {showReportButton && (
          <Button
            variant="secondary"
            onClick={handleReport}
            className="w-full md:w-auto"
          >
            <Bug className="w-4 h-4" />
            Report Issue
          </Button>
        )}

        <div className="w-full md:w-auto">{actions}</div>
      </div>

      <p className="mt-8 text-xs font-medium text-gray-400 uppercase tracking-widest">
        Mahakama Legal Platform
      </p>
    </div>
  );
};
