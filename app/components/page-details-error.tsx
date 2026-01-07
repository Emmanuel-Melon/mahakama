import { AlertTriangle, RefreshCw } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";
import { PageLayout } from "~/layouts/page-layout";

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
    <PageLayout>
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
      </div>
    </PageLayout>
  );
}

export default PageDetailsError;
