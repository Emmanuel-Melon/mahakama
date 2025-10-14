import * as React from "react";
import { cn } from "~/lib/utils";

type SizeVariant = "sm" | "md" | "lg";
type ColorVariant = "green" | "gray" | "outline" | "handdrawn";

interface HandDrawnAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The source URL of the avatar image */
  src?: string;
  /** The name used for fallback initials */
  name?: string;
  /** The size of the avatar */
  size?: SizeVariant;
  /** The color variant of the avatar */
  color?: ColorVariant;
  /** Additional class name for custom styling */
  className?: string;
}

const sizeVariants = {
  sm: {
    container: "w-6 h-6",
    text: "text-xs",
    border: "border",
    shadow: "shadow-[1.5px_1.5px_0_0_RGBA(0,0,0,1)]",
    icon: 12,
  },
  md: {
    container: "w-8 h-8",
    text: "text-sm",
    border: "border-2",
    shadow: "shadow-[2px_2px_0_0_RGBA(0,0,0,1)]",
    icon: 16,
  },
  lg: {
    container: "w-12 h-12",
    text: "text-base",
    border: "border-2",
    shadow: "shadow-[3px_3px_0_0_RGBA(0,0,0,1)]",
    icon: 24,
  },
} as const;

const colorVariants = {
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-900",
  },
  gray: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-900",
  },
  outline: {
    bg: "bg-transparent",
    text: "text-gray-900",
    border: "border-gray-900",
  },
  handdrawn: {
    bg: "bg-gradient-to-br from-yellow-200 to-yellow-300",
    text: "text-gray-900",
    border: "border-gray-900",
  },
} as const;

const getHandDrawnStyles = (size: SizeVariant = "md") => {
  const baseStyles = "relative z-10";
  const sizeMap = {
    sm: "text-xs w-6 h-6",
    md: "text-sm w-8 h-8",
    lg: "text-base w-12 h-12",
  };

  return cn(
    baseStyles,
    sizeMap[size],
    "flex items-center justify-center rounded-full",
    "before:absolute before:inset-0 before:rounded-full before:pointer-events-none",
    "before:border-2 before:border-dashed before:border-black/10",
    "after:absolute after:inset-0 after:rounded-full after:pointer-events-none",
    "after:border-2 after:border-dashed after:border-black/10",
    "transform rotate-3",
  );
};

export function HandDrawnAvatar({
  src,
  name = "",
  size = "md",
  color = "outline",
  className,
  ...props
}: HandDrawnAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colorVariant = colorVariants[color] || colorVariants.outline;
  const sizeVariant = sizeVariants[size];
  const isHandDrawn = color.startsWith("handdrawn");

  if (isHandDrawn) {
    const styles = getHandDrawnStyles(size);

    return (
      <div
        className={cn(
          styles,
          colorVariant.bg,
          colorVariant.border,
          "border-2",
          sizeVariant.shadow,
          className,
        )}
        {...props}
      >
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {src ? (
            <img
              src={src}
              alt={name || "Avatar"}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span
              className={cn(
                "font-bold",
                colorVariant.text,
                sizeVariant.text,
                "select-none",
                "flex items-center justify-center w-full h-full",
              )}
            >
              {initials}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-shrink-0", className)} {...props}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center overflow-hidden",
          colorVariant.bg,
          colorVariant.border,
          sizeVariant.container,
          sizeVariant.border,
          sizeVariant.shadow,
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "font-bold",
              colorVariant.text,
              sizeVariant.text,
              "select-none",
              "flex items-center justify-center w-full h-full",
            )}
          >
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
