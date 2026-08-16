import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface MahCardProps {
  children: React.ReactNode;
  variant?: "default" | "minimal" | "outlined";
  className?: string;
}

export const MahCard = forwardRef<HTMLDivElement, MahCardProps>(
  ({ children, variant = "default", className = "", ...props }, ref) => {
    const baseClasses = cn("relative z-10 h-full flex flex-col", className);

    const innerClasses = cn(
      variant === "default"
        ? "bg-white rounded-xl p-4"
        : variant === "minimal"
          ? "border border-gray-200 bg-white rounded-xl p-4 hover:shadow-md transition-shadow"
          : "border-2 border-gray-900 bg-white rounded-xl overflow-hidden p-6",
    );

    const outerClasses = cn("border border-gray-300 rounded-xl p-1");

    return (
      <div ref={ref} className={baseClasses} {...props}>
        <div
          className={outerClasses}
          style={{
            backgroundColor: "white",
          }}
        >
          <div
            className={innerClasses}
            style={{
              backgroundColor: "white",
              borderWidth: variant === "default" ? "1px" : undefined,
              borderStyle: variant === "default" ? "solid" : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

MahCard.displayName = "MahCard";
