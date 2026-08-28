import React from "react";
import type { LucideIcon } from "lucide-react";

interface AuthFormHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
  icon: LucideIcon;
  highlightedText?: string;
  rightElement?: React.ReactNode;
}

export const AuthFormHeader = ({
  title,
  subtitle,
  description,
  icon: Icon,
  highlightedText,
  rightElement,
}: AuthFormHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 py-2">
      <div className="flex items-start gap-6">
        <div
          className="hidden sm:flex bg-primary/10 text-primary items-center justify-center shrink-0 rotate-3"
          aria-hidden
        >
          <Icon size={32} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary tracking-[.25em]">
            {subtitle}
          </div>
          <h1 className="text-4xl tracking-tighter text-foreground leading-none">
            {title}{" "}
            {highlightedText && (
              <span className="text-primary">{highlightedText}</span>
            )}
          </h1>
          {description && (
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md md:hidden">
              {description}
            </p>
          )}
        </div>
      </div>
      {rightElement ? (
        <div className="hidden md:block">{rightElement}</div>
      ) : description ? (
        <p className="hidden md:block text-muted-foreground max-w-[320px] text-sm leading-relaxed text-right">
          {description}
        </p>
      ) : null}
    </header>
  );
};
