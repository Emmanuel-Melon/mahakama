import * as React from "react";
import { AlertCircle, type LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

const ErrorStateContext = React.createContext<{ isMinimal: boolean }>({
  isMinimal: false,
});
const useErrorStateContext = () => React.useContext(ErrorStateContext);

interface ErrorStateProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  variant?: "default" | "minimal";
}

export function ErrorState({
  children,
  variant = "default",
  className,
  ...props
}: ErrorStateProps) {
  const isMinimal = variant === "minimal";

  return (
    <ErrorStateContext.Provider value={{ isMinimal }}>
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full generic-transition mx-auto",
          isMinimal
            ? "max-w-xl p-4 space-y-6"
            : "min-h-[60vh] max-w-4xl px-6 py-12 space-y-10",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ErrorStateContext.Provider>
  );
}

ErrorState.Visual = function ErrorStateVisual({
  icon: Icon = AlertCircle,
  className,
}: {
  icon?: LucideIcon;
  className?: string;
}) {
  const { isMinimal } = useErrorStateContext();

  return (
    <div className={cn("relative flex justify-center", className)}>
      <div
        className={cn(
          "rounded-destructive bg-destructive/5 text-destructive flex items-center justify-center shadow-sm border border-destructive/10 generic-transition",
          isMinimal
            ? "w-14 h-14 rounded-[1.25rem]"
            : "w-20 h-20 rounded-[2rem]",
        )}
      >
        <Icon
          className={cn("stroke-[1.25px]", isMinimal ? "w-7 h-7" : "w-10 h-10")}
        />
      </div>
      <div
        className={cn(
          "absolute border border-destructive/5 -z-10 animate-pulse generic-transition",
          isMinimal ? "-inset-1 rounded-[1.5rem]" : "-inset-2 rounded-[2.5rem]",
        )}
      />
    </div>
  );
};

ErrorState.Header = function ErrorStateHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-center space-y-4 w-full", className)}>
      {children}
    </div>
  );
};

ErrorState.Subtitle = function ErrorStateSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 text-destructive font-black uppercase tracking-[.3em] text-[10px]",
        className,
      )}
    >
      <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
      {children}
    </div>
  );
};

ErrorState.Title = function ErrorStateTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMinimal } = useErrorStateContext();

  return (
    <h1
      className={cn(
        "font-black tracking-tighter text-foreground leading-none max-w-lg mx-auto generic-transition",
        isMinimal ? "text-xl sm:text-2xl" : "text-4xl md:text-5xl",
      )}
    >
      {children}
    </h1>
  );
};

ErrorState.Description = function ErrorStateDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMinimal } = useErrorStateContext();

  return (
    <p
      className={cn(
        "text-muted-foreground font-medium max-w-md mx-auto leading-relaxed generic-transition",
        isMinimal ? "text-sm" : "text-base md:text-lg",
        className,
      )}
    >
      {children}
    </p>
  );
};

ErrorState.Content = function ErrorStateContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMinimal } = useErrorStateContext();

  return (
    <div
      className={cn(
        "w-full relative mx-auto",
        isMinimal ? "max-w-sm" : "max-w-md",
        className,
      )}
    >
      <div
        className={cn(
          "bg-card border border-border text-center space-y-6 generic-transition",
          isMinimal
            ? "p-5 rounded-[2rem] shadow-md"
            : "p-8 rounded-[3rem] shadow-xl shadow-primary/5",
        )}
      >
        {children}
      </div>
      {!isMinimal && (
        <div className="absolute -inset-4 bg-primary/5 blur-3xl -z-10" />
      )}
    </div>
  );
};

ErrorState.Actions = function ErrorStateActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMinimal } = useErrorStateContext();

  return (
    <div
      className={cn(
        "space-y-4 w-full [&>button]:w-full [&>button]:rounded-2xl [&>button]:font-black [&>button]:uppercase [&>button]:tracking-widest [&>button]:transition-all",
        isMinimal
          ? "[&>button]:h-12 [&>button]:text-sm"
          : "[&>button]:h-16 [&>button]:text-lg",
        className,
      )}
    >
      {children}
    </div>
  );
};

ErrorState.Footer = function ErrorStateFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] px-4",
        className,
      )}
    >
      {children}
    </p>
  );
};
