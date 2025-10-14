import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";
import { StateActionItems } from "~/components/ui/state-action-items";

interface ErrorDisplayProps {
  title?: string;
  error: string | Error;
  className?: string;
  onRetry?: () => void;
  retryText?: string;
  label?: string;
  showDefaultActions?: boolean;
}

export function ErrorDisplay({
  title = "Something went wrong",
  error,
  className = "",
  onRetry,
  retryText = "Try again",
  label = "Error",
  showDefaultActions = true,
}: ErrorDisplayProps) {
  const errorMessage = typeof error === "string" ? error : error.message;

  const defaultActions = [
    {
      label: "Go to Home",
      href: "/",
      variant: "outline",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      label: retryText,
      onClick: onRetry,
      variant: "default",
      icon: <RotateCcw className="h-4 w-4 mr-2" />,
    },
  ];

  const displayActions = showDefaultActions
    ? defaultActions.filter(
        (action) => action.onClick === undefined || onRetry !== undefined,
      )
    : [];

  return (
    <CardWithLabel
      label={label}
      className={`bg-white ${className}`}
      labelClassName="text-red-600"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-red-700 text-sm mb-4">{errorMessage}</p>

          <StateActionItems
            title="Recovery Steps"
            items={[
              "Check your internet connection",
              "Try refreshing the page",
              "Contact support if the issue persists",
            ]}
          />

          {displayActions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {displayActions.map((action, index) => {
                const isPrimary =
                  action.variant === "default" || !action.variant;
                const buttonClass = isPrimary
                  ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-gray-900 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white hover:bg-gray-50 text-gray-900 border-gray-900";

                return (
                  <a
                    key={index}
                    href={action.href || "#"}
                    className={`relative px-6 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${buttonClass}`}
                    style={{
                      borderRadius: "8px 16px 8px 16px",
                      boxShadow: "3px 3px 0 0 #000",
                    }}
                    onClick={(e) => {
                      if (action.onClick) {
                        e.preventDefault();
                        action.onClick();
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {action.icon}
                      {action.label}
                    </div>
                    {isPrimary && (
                      <>
                        <span className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-gray-900"></span>
                        <span className="absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-900"></span>
                      </>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CardWithLabel>
  );
}

export default ErrorDisplay;
