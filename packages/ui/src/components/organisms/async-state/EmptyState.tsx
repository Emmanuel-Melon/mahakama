import * as React from "react";
import { type LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Card } from "../../Card";

const EmptyStateContext = React.createContext<{ isMinimal: boolean }>({
  isMinimal: false,
});
const useNewEmptyStateContext = () => React.useContext(EmptyStateContext);

interface EmptyStateProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  variant?: "default" | "minimal";
}

export function EmptyState({
  children,
  variant = "default",
  className,
  ...props
}: EmptyStateProps) {
  const isMinimal = variant === "minimal";

  return (
    <EmptyStateContext.Provider value={{ isMinimal }}>
      <div className={cn(className)} {...props}>
        <div
          className={cn(
            "grid grid-cols-1 items-center max-w-4xl w-full mx-auto generic-transition",
            isMinimal
              ? "xl:grid-cols-12 gap-6 md:gap-8 lg:gap-10"
              : "lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16",
          )}
        >
          {children}
        </div>
      </div>
    </EmptyStateContext.Provider>
  );
}

EmptyState.Visual = function EmptyStateVisual({
  icon: Icon,
  iconColor = "text-primary",
  className,
}: {
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}) {
  const { isMinimal } = useNewEmptyStateContext();

  return (
    <div
      className={cn(
        "flex justify-center",
        isMinimal
          ? "xl:col-span-4 xl:justify-start"
          : "lg:col-span-4 lg:justify-start",
        className,
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 bg-primary/10 rounded-full scale-125 sm:scale-150",
            isMinimal
              ? "blur-[30px] sm:blur-[40px]"
              : "blur-[40px] sm:blur-[60px]",
          )}
        />
        <Card
          className={cn(
            "relative flex items-center justify-center border-dashed border-2 border-primary/20 bg-background/40 backdrop-blur-md shadow-xl -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-700",
            isMinimal
              ? "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[1.5rem] sm:rounded-[1.75rem]"
              : "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-[1.75rem] sm:rounded-[2rem]",
          )}
        >
          <Icon
            className={cn(
              "stroke-[1.5px]",
              iconColor,
              isMinimal
                ? "w-8 h-8 sm:w-10 h-10 md:w-12 md:h-12"
                : "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
            )}
          />
        </Card>
      </div>
    </div>
  );
};

EmptyState.Content = function EmptyStateContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMinimal } = useNewEmptyStateContext();

  return (
    <div
      className={cn(
        "text-center space-y-4 sm:space-y-5",
        isMinimal ? "xl:col-span-8 xl:text-left" : "lg:col-span-8 lg:text-left",
        className,
      )}
    >
      {children}
    </div>
  );
};

EmptyState.Badge = function EmptyStateBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMinimal } = useNewEmptyStateContext();

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 tracking-[.4em] text-primary text-[11px] font-medium lowercase",
        isMinimal ? "xl:justify-start" : "lg:justify-start",
        className,
      )}
    >
      {children}
    </div>
  );
};

EmptyState.Title = function EmptyStateTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMinimal } = useNewEmptyStateContext();

  return (
    <h2
      className={cn(
        "font-black tracking-tighter leading-tight text-foreground",
        isMinimal
          ? "text-xl sm:text-2xl md:text-3xl xl:leading-[0.95]"
          : "text-2xl sm:text-3xl md:text-4xl lg:leading-[0.95]",
        className,
      )}
    >
      {children}
    </h2>
  );
};

EmptyState.Description = function EmptyStateDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMinimal } = useNewEmptyStateContext();

  return (
    <p
      className={cn(
        "text-muted-foreground font-medium leading-relaxed tracking-tight max-w-lg mx-auto",
        isMinimal
          ? "text-sm sm:text-base xl:mx-0"
          : "text-base sm:text-lg lg:mx-0",
        className,
      )}
    >
      {children}
    </p>
  );
};

EmptyState.Actions = function NewEmptyStateActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMinimal } = useNewEmptyStateContext();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto",
        isMinimal ? "xl:justify-start" : "lg:justify-start",
        className,
      )}
    >
      {children}
    </div>
  );
};
