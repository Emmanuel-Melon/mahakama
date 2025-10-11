import { cn } from "~/lib/utils";
import { HeroSectionAction } from "~/components/ui/hero-section-action";
import { IconContainer } from "~/components/icon-container";
import { Scale } from "lucide-react";

import type { LucideIcon } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  description: string;
  className?: string;
  actionVariant?: 'cta' | 'search';
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  icon?: LucideIcon;
}
export function HeroSection({ 
  title, 
  description, 
  className, 
  actionVariant = 'cta',
  onSearch,
  searchPlaceholder,
  icon: Icon = Scale
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
        </div>
      </div>

    </div>
  );
}
