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
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
