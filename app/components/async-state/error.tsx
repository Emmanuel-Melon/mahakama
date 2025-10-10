import { AlertTriangle } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface ErrorDisplayProps {
  title?: string;
  error: string | Error;
  className?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorDisplay({
  title = 'Something went wrong',
  error,
  className = '',
  onRetry,
  retryText = 'Try again',
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div 
      className={`relative bg-white border-2 border-gray-900 p-6 ${className}`}
      style={{
        borderRadius: '8px 16px 8px 16px',
        boxShadow: '3px 3px 0 0 #000',
        background: 'linear-gradient(135deg, #fff8f8 0%, #fff0f0 100%)',
      }}
    >
      {/* Corner decorations */}
      <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-red-600"></span>
      <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-red-600"></span>
      
      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-red-700 mb-4">{errorMessage}</p>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-sm text-gray-700 font-medium mb-2">
                While we work on fixing this, here's what you can do:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>
            
            {onRetry && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={onRetry}
                  className="border-2 border-gray-900 hover:bg-gray-100 transition-colors"
                  style={{
                    boxShadow: '2px 2px 0 0 #000',
                  }}
                >
                  {retryText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;