import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  itemCount?: number;
  className?: string;
  message?: string;
}

export function LoadingState({
  itemCount = 3,
  className = '',
  message = 'Loading content...',
}: LoadingStateProps) {
  return (
    <div 
      className={`relative bg-white border-2 border-gray-900 p-6 ${className}`}
      style={{
        borderRadius: '8px 16px 8px 16px',
        boxShadow: '3px 3px 0 0 #000',
        background: 'linear-gradient(135deg, #f9fff8 0%, #f0fff0 100%)',
      }}
    >
      {/* Corner decorations */}
      <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-green-600"></span>
      <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-green-600"></span>
      
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative mb-6">
            <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
          </div>
          
          <p className="text-gray-700 font-medium mb-6">{message}</p>
          
          <div className="w-full space-y-4">
            {Array.from({ length: itemCount }).map((_, i) => (
              <div 
                key={i}
                className="h-16 w-full bg-gray-100 rounded-md animate-pulse"
                style={{
                  border: '1px solid #e5e7eb',
                  boxShadow: '2px 2px 0 0 #000',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;