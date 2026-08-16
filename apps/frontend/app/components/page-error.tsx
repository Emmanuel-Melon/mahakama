import { AlertTriangle, RefreshCw } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";

interface PageErrorProps {
  title?: string;
  description?: string;
  error?: string | Error;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function PageError({
  title = "Error Loading Page",
  description = "Something went wrong while loading this page. Please try again later.",
  error,
  onRetry,
  showRetry = true,
  className = "",
}: PageErrorProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className={`space-y-6 ${className}`}>
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
            <div className="text-gray-700 text-sm mb-6">
              <p>{description}</p>
              {errorMessage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-xs font-mono">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>
            {showRetry && onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-2 border-red-800 shadow-[3px_3px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            )}
          </div>
        </div>
      </CardWithLabel>
    </div>
  );
}

export default PageError;
