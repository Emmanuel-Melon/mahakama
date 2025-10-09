import type { LucideIcon } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type FeaturesGridProps = {
  features: Feature[];
  className?: string;
};

export function FeaturesGrid({ features, className }: FeaturesGridProps) {
  return (
    <div className={className}>
      <div className="max-w-6xl mx-auto">
        <div className="divide-y divide-border">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
