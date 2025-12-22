import { AlertTriangle, RefreshCw } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";

interface PageDetailsErrorProps {
  error?: Error | string;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function PageDetailsError({
  error,
  title = "Error Loading Details",
  description = "We couldn't load the details you requested. Please try again.",
  onRetry,
  className = "",
}: PageDetailsErrorProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Header */}
      <CardWithLabel
        label="Error"
        className="bg-white"
        labelClassName="text-red-600"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <div className="text-gray-700 text-sm">
              <p>{description}</p>
              {errorMessage && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
                </div>
              )}
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-2 border-red-800 shadow-[3px_3px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
          </div>
        </div>
      </CardWithLabel>

      {/* Error State Illustration */}
      <div className="bg-white border-2 border-gray-900 rounded-lg p-8 text-center" style={{ borderRadius: "8px 16px 8px 16px" }}>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-6">
          We encountered an issue while loading the content. This could be due to a temporary problem or the content might not be available.
        </p>
        
        {/* Suggested Actions */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-2 border-red-800 shadow-[3px_3px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Loading
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors border-2 border-gray-800 shadow-[3px_3px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] font-medium"
            >
              Refresh Page
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>If the problem persists, you can:</p>
            <ul className="mt-2 space-y-1">
              <li>• Check your internet connection</li>
              <li>• Try again later</li>
              <li>• Contact support if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageDetailsError;
