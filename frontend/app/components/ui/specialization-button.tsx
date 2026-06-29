import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";

type SpecializationButtonProps = {
  name: string;
  icon: LucideIcon;
  index: number;
  className?: string;
};

const specializationColors = [
  { text: "text-blue-900", icon: "text-blue-900" },
  { text: "text-green-900", icon: "text-green-900" },
  { text: "text-purple-900", icon: "text-purple-900" },
  { text: "text-amber-900", icon: "text-amber-900" },
  { text: "text-rose-900", icon: "text-rose-900" },
  { text: "text-emerald-900", icon: "text-emerald-900" },
  { text: "text-indigo-900", icon: "text-indigo-900" },
  { text: "text-cyan-900", icon: "text-cyan-900" },
  { text: "text-fuchsia-900", icon: "text-fuchsia-900" },
  { text: "text-lime-900", icon: "text-lime-900" },
];

const getColor = (index: number) => {
  return specializationColors[index % specializationColors.length];
};

export function SpecializationButton({
  name,
  icon: Icon,
  index,
  className,
}: SpecializationButtonProps) {
  const color = getColor(index);

  return (
    <button
      className={cn(
        "w-full sm:w-auto text-left py-1.5 sm:py-1 px-3 border-2 border-gray-900 bg-white",
        "transition-all hover:shadow-md font-medium text-xs sm:text-sm flex items-center gap-2",
        "active:translate-y-0.5 active:shadow-none hover:bg-gray-50",
        color.text,
        className,
      )}
      style={{
        boxShadow: "2px 2px 0 0 #000",
        borderRadius: "4px 8px 4px 8px",
      }}
    >
      <Icon
        className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0", color.icon)}
      />
      <span className="truncate">{name}</span>
    </button>
  );
}
