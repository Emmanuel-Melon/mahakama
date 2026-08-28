import { IconContainer } from "@mah/ui/components/IconContainer";
import type { ComponentType } from "react";

interface StepHeaderProps {
  title: string;
  description: string;
  icon?: ComponentType<any>; // Using any for flexibility since IconProps is not exported
}

export function StepHeader({ title, description, icon }: StepHeaderProps) {
  return (
    <div className="text-left mb-8">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0">
            <IconContainer icon={icon} size="lg" color="handdrawn" />
          </div>
        )}
        <div>
          <h3 className="text-xl font-black text-gray-900 mb-2 font-serif">
            {title}
          </h3>
          <p className="text-gray-600 text-lg">{description}</p>
        </div>
      </div>
    </div>
  );
}
