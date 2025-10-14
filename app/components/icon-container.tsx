import { cn } from "~/lib/utils";
import type { ComponentType, SVGProps } from "react";

type SizeVariant = "sm" | "md" | "lg";
type ColorVariant =
  | "yellow"
  | "blue"
  | "green"
  | "red"
  | "gray"
  | "outline"
  | "handdrawn"
  | "handdrawn-yellow"
  | "handdrawn-blue";

type IconProps = {
  className?: string;
  size?: number;
  width?: number;
  height?: number;
};

interface IconContainerProps {
  icon?: ComponentType<IconProps>;
  className?: string;
  iconSize?: number;
  size?: SizeVariant;
  color?: ColorVariant;
  number?: number | string;
  text?: string;
}

const sizeVariants = {
  sm: {
    container: "w-6 h-6",
    icon: 12,
    border: "border",
    shadow: "shadow-[1.5px_1.5px_0_0_RGBA(0,0,0,1)]",
  },
  md: {
    container: "w-8 h-8",
    icon: 16,
    border: "border-2",
    shadow: "shadow-[2px_2px_0_0_RGBA(0,0,0,1)]",
  },
  lg: {
    container: "w-12 h-12",
    icon: 24,
    border: "border-2",
    shadow: "shadow-[3px_3px_0_0_RGBA(0,0,0,1)]",
  },
} as const;

const colorVariants = {
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-900",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-900",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-900",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-900",
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
  "handdrawn-yellow": {
    bg: "bg-gradient-to-br from-yellow-200 to-yellow-300",
    text: "text-gray-900",
    border: "border-gray-900",
  },
  "handdrawn-blue": {
    bg: "bg-gradient-to-br from-blue-200 to-blue-300",
    text: "text-gray-900",
    border: "border-blue-900",
  },
} as const;

const getHandDrawnStyles = (size: SizeVariant = "md") => {
  const baseStyles = "relative z-10 font-black";
  const sizeMap = {
    sm: "text-base w-8 h-8",
    md: "text-xl w-12 h-12",
    lg: "text-2xl w-14 h-14",
  };

  return {
    container: `${baseStyles} ${sizeMap[size]} flex items-center justify-center rounded-full`,
    innerCircle:
      "absolute inset-0 rounded-full pointer-events-none border-2 border-dashed border-black/10",
    content: "relative z-10",
  };
};

export const IconContainer = ({
  icon: Icon,
  className = "",
  iconSize,
  size = "md",
  color = "yellow",
  number,
  text,
}: IconContainerProps) => {
  const variant = sizeVariants[size];
  const isHandDrawn = [
    "handdrawn",
    "handdrawn-yellow",
    "handdrawn-blue",
  ].includes(color);

  if (isHandDrawn) {
    const styles = getHandDrawnStyles(size);
    const variantColors = colorVariants[color as keyof typeof colorVariants];

    return (
      <div
        className={cn(
          styles.container,
          variantColors.bg,
          variantColors.border,
          "border-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
          className,
        )}
      >
        <span className={styles.content}>
          {number ||
            text ||
            (Icon ? (
              <Icon
                size={iconSize || variant.icon}
                width={iconSize || variant.icon}
                height={iconSize || variant.icon}
              />
            ) : null)}
        </span>
        <div
          className={styles.innerCircle}
          style={{
            transform: "rotate(15deg)",
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex-shrink-0", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center",
          colorVariants[color as keyof typeof colorVariants]?.bg,
          colorVariants[color as keyof typeof colorVariants]?.border,
          variant.container,
          variant.border,
          variant.shadow,
        )}
      >
        {Icon && (
          <Icon
            size={iconSize || variant.icon}
            width={iconSize || variant.icon}
            height={iconSize || variant.icon}
            className={colorVariants[color as keyof typeof colorVariants]?.text}
          />
        )}
        {number && (
          <span
            className={colorVariants[color as keyof typeof colorVariants]?.text}
          >
            {number}
          </span>
        )}
        {text && (
          <span
            className={colorVariants[color as keyof typeof colorVariants]?.text}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  );
};
