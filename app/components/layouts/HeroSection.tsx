import { cn } from "~/lib/utils";
import { HeroSectionAction } from "~/components/ui/hero-section-action";
import { IconContainer } from "~/components/icon-container";
import { SpecializationButton } from "~/components/ui/specialization-button";
import {
  ArrowRight,
  Scale,
  Gavel,
  Briefcase,
  Home,
  Copyright,
  Users,
  Landmark,
  FileText,
  Handshake,
  Shield,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface HeroSectionProps {
  title: string;
  description: string;
  className?: string;
  actionVariant?: "cta" | "search";
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  icon?: LucideIcon;
}

const specializations = [
  { name: "Family Law", icon: Users },
  { name: "Criminal Defense", icon: Gavel },
  { name: "Corporate Law", icon: Briefcase },
  { name: "Real Estate", icon: Home },
  { name: "Intellectual Property", icon: Copyright },
  { name: "Immigration", icon: Landmark },
  { name: "Personal Injury", icon: FileText },
  { name: "Tax Law", icon: Handshake },
  { name: "Employment Law", icon: Briefcase },
  { name: "Human Rights", icon: Shield },
];

const LegalSpecializations = ({
  specializations,
}: {
  specializations: { name: string; icon: LucideIcon }[];
}) => (
  <div className="hidden sm:block pt-4 w-full">
    <h2 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 sm:mb-4 px-2 sm:px-0">
      Browse by Specialization:
    </h2>
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 px-2 sm:px-0">
      {specializations.map(({ name, icon }, index) => (
        <SpecializationButton
          key={index}
          name={name}
          icon={icon}
          index={index}
        />
      ))}
    </div>
  </div>
);

export function HeroSection({
  title,
  description,
  className,
  actionVariant = "cta",
  onSearch,
  searchPlaceholder,
  icon: Icon = Scale,
}: HeroSectionProps) {
  return (
    <div className={cn("bg-background relative overflow-hidden", className)}>
      <div className="px-6 py-8 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <div className="flex justify-center">
            <IconContainer icon={Icon} color="handdrawn" size="lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {title}
          </h1>
          <p className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
          <div>
            <HeroSectionAction
              variant={actionVariant}
              onSearch={onSearch}
              searchPlaceholder={searchPlaceholder}
            />
          </div>
          <LegalSpecializations specializations={specializations} />
        </div>
      </div>
    </div>
  );
}
