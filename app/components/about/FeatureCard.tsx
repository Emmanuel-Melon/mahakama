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
    <div 
      className={cn(
        "relative p-4 bg-white border-2 border-gray-900 group transition-all duration-200 transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
        "flex gap-4 h-full",
        className
      )}
      style={{
        borderRadius: '16px 8px 16px 8px',
        border: '2px solid #000',
        boxShadow: '4px 4px 0 0 #000',
      }}
    >
      {/* Decorative corner elements */}
      <div className="absolute -right-2 -top-2 w-3 h-3 border-t-2 border-r-2 border-gray-900 bg-yellow-300"></div>
      <div className="absolute -left-2 -bottom-2 w-3 h-3 border-b-2 border-l-2 border-gray-900 bg-yellow-300"></div>
      
      {/* Icon Container */}
      <div className="flex-shrink-0">
        <div 
          className="w-12 h-12 rounded-full bg-yellow-100 border-2 border-gray-900 flex items-center justify-center mt-1"
          style={{
            boxShadow: '3px 3px 0 0 #000',
          }}
        >
          <Icon className="w-5 h-5 text-gray-900" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <h3 className="text-lg font-black text-gray-900 mb-2 relative inline-block">
          {title}
          <div className="absolute -bottom-0.5 left-0 right-0 h-1.5 bg-yellow-200/60 -rotate-1 -z-10"></div>
        </h3>
        
        <p className="text-gray-700 text-sm leading-relaxed">
          {description}
        </p>
        
        <div 
          className="w-full h-0.5 bg-gray-200 mt-3"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)',
          }}
        ></div>
      </div>
    </div>
  );
}
