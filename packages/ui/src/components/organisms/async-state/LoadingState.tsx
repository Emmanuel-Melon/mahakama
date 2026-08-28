import { Loader2 } from "lucide-react";
import { Card } from "../../Card";

interface LoadingStateProps {
  label?: string;
  title?: string;
  description?: string | React.ReactNode;
  className?: string;
}

export function LoadingState({
  label = "Loading",
  title = "Loading Content",
  description = "Please wait while we load your content...",
  className = "",
}: LoadingStateProps) {
  return (
    <Card className={`bg-white ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-3">
        {label}
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <div className="text-gray-700 text-sm mb-6">
            {typeof description === "string" ? (
              <p>{description}</p>
            ) : (
              description
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default LoadingState;
