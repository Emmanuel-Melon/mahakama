"use client";
import { cn } from "~/lib/utils";

interface DiagonalSeparatorProps {
  className?: string;
  height?: string;
}

export const DiagonalSeparator = ({ 
  className,
  height = "h-4"
}: DiagonalSeparatorProps) => {
  return (
    <div 
      className={cn(
        "max-w-7xl mx-auto bg-repeat-x",
        height,
        className
      )}
      style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 8px,
          #e5e7eb 8px,
          #e5e7eb 16px
        )`,
        opacity: 0.5
      }}
    />
  );
};
