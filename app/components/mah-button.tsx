import { forwardRef } from "react";
import { NavLink } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

interface MahButtonProps {
  variant?: "primary" | "secondary" | "card";
  onClick?: () => void;
  href?: string;
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

export const MahButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, MahButtonProps>(
  ({ 
    variant = "secondary", 
    onClick,
    href,
    key,
    className,
    children,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-2 border-black rounded-lg text-gray-900",
      variant === "primary"
        ? "bg-yellow-300 shadow-[2px_2px_0_0_#000] translate-x-0 translate-y-0"
        : variant === "card"
        ? "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border-2 border-black rounded-lg bg-yellow-300 shadow-[3px_3px_0_0_#000] hover:bg-yellow-400 hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] w-full"
        : "bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-gray-900",
      className
    );

    if (href) {
      return (
        <NavLink
          ref={ref as any}
          to={href}
          key={key}
          className={baseClasses}
          {...props}
          viewTransition
        >
          {children}
        </NavLink>
      );
    }

    return (
      <Button
        ref={ref as any}
        onClick={onClick}
        key={key}
        className={baseClasses}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

MahButton.displayName = "MahButton";
