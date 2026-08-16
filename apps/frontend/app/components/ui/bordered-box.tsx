import { cn } from "~/lib/utils";

interface BorderedBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label?: string;
  labelClassName?: string;
  borderColor?: string;
  shadowColor?: string;
  borderRadius?: string;
  gradientFrom?: string;
  gradientTo?: string;
  labelPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  variant?: "default" | "decorated";
  accentColor?: string;
  hoverEffect?: "none" | "lift";
}

export function BorderedBox({
  children,
  label,
  labelClassName = "",
  className = "",
  borderColor = "border-gray-900",
  shadowColor = "bg-black",
  borderRadius = "rounded-tl-xl rounded-br-2xl",
  gradientFrom = "from-white",
  gradientTo = "to-gray-50",
  labelPosition = "top-left",
  variant = "default",
  accentColor = "bg-yellow-300",
  hoverEffect = "none",
  ...props
}: BorderedBoxProps) {
  return (
    <div
      className={cn(
        "relative p-6 bg-white transition-all duration-200",
        hoverEffect === "lift" &&
          "transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
        borderColor || "border-gray-900",
        borderRadius,
        gradientFrom || "from-white",
        gradientTo || "to-gray-50",
        className,
      )}
      style={{
        border: "2px solid #000",
        boxShadow: "3px 3px 0 0 #000",
        borderRadius: "8px 16px 8px 16px",
      }}
      {...props}
    >
      {/* Corner decorations */}
      {variant === "decorated" ? (
        <>
          <div className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900 bg-yellow-300"></div>
          <div className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900 bg-yellow-300"></div>
        </>
      ) : (
        <>
          <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
          <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>
        </>
      )}
      {label && (
        <div
          className={cn(
            "absolute px-2 bg-white text-xs font-mono text-gray-500",
            "border-2",
            borderColor || "border-gray-900",
            labelPosition === "top-left" && "-top-2 left-4",
            labelPosition === "top-right" && "-top-2 right-4",
            labelPosition === "bottom-left" && "-bottom-2 left-4",
            labelPosition === "bottom-right" && "-bottom-2 right-4",
            "transition-colors duration-200",
            labelClassName,
          )}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
