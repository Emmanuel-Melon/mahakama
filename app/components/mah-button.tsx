import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface MahButtonProps {
  variant?: "primary" | "secondary";
  onClick?: () => void;
  key?: string | number;
  className?: string;
  children: React.ReactNode;
}

export interface MahAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export const MahButton = forwardRef<HTMLButtonElement, MahButtonProps>(
  ({ 
    variant = "secondary", 
    onClick,
    key,
    className,
    children,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        key={key}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-2 border-black rounded-lg text-gray-900",
          variant === "primary"
            ? "bg-yellow-300 shadow-[2px_2px_0_0_#000] translate-x-0 translate-y-0"
            : "bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-gray-900",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MahButton.displayName = "MahButton";
