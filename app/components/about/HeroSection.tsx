import { cn } from "~/lib/utils";
import { HeroSectionAction } from "~/components/ui/hero-section-action";

interface HeroSectionProps {
  title: string;
  description: string;
  className?: string;
  actionVariant?: 'cta' | 'search';
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}
export function HeroSection({ 
  title, 
  description, 
  className, 
  actionVariant = 'cta',
  onSearch,
  searchPlaceholder
}: HeroSectionProps) {
  return (
    <div className={cn("bg-background relative overflow-hidden", className)}>
      <div className="px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
          <div className="mt-10">
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
