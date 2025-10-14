import { cn } from "~/lib/utils";

interface CardWithLabelProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function CardWithLabel({
  label,
  children,
  className = "",
  labelClassName = "",
}: CardWithLabelProps) {
  return (
    <div
      className={cn(
        "w-full max-w-6xl mx-auto p-6 border-2 border-dashed border-gray-300 rounded relative",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -top-2 left-4 px-2 bg-white text-xs font-mono text-gray-500",
          labelClassName,
        )}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
