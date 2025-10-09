import type { LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

export function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  className 
}: FeatureCardProps) {
  return (
    <div className={cn(
      "relative py-8 px-4 sm:px-6 lg:px-8 group",
      "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-px after:bg-border",
      "last:after:hidden",
      className
    )}>
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="p-3 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
