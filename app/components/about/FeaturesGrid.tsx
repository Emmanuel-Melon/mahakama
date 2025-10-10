import type { LucideIcon } from 'lucide-react';
import { Info, Heart } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { cn } from '~/lib/utils';
import { IconContainer } from '~/components/icon-container';

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
    <div className={cn("w-full", className)}>
      <div className="mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <IconContainer 
            icon={Heart} 
            color="handdrawn"
            className="mx-auto shadow-[2px_2px_0_0_#000]"
          />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Why Choose Mahakama?
        </h2>
        <p className="text-muted-foreground">
          We're making legal information accessible and understandable for everyone in East Africa
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column - About Intro */}
        <div className="text-muted-foreground space-y-6">
          <div className="w-12 h-12 rounded-full bg-yellow-100 border-2 border-gray-900 flex items-center justify-center mb-4"
               style={{ boxShadow: '3px 3px 0 0 #000' }}>
            <Info className="w-5 h-5 text-gray-900" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Legal Knowledge, Made Simple</h2>
          <div className="prose prose-lg space-y-4">
            <p>
              In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree.
            </p>
            <p>
              Mahakama changes that. Our AI-powered platform is completely free and lets you search using everyday language. Don't know the legal term for your issue? No problem. Just describe your situation as you would to a friend, and we'll find the relevant laws and regulations for you.
            </p>
            <p>
              While we can connect you with legal professionals if absolutely necessary, our primary goal is to empower you with knowledge first. Most legal questions can be resolved by understanding your rights and options - no lawyer required.
            </p>
          </div>
        </div>
        
        {/* Right Column - Features Grid */}
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
