import { FileSearch, Plus, Home } from "lucide-react";

interface ActionButton {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  icon?: React.ReactNode;
}

interface EmptyStateProps {
  label?: string;
  title?: string;
  description?: string | React.ReactNode;
  className?: string;
  actions?: ActionButton[];
  showDefaultActions?: boolean;
}

export function EmptyState({
  label = "Empty State",
  title = "No Results Found",
  description = "No items match your search criteria. Try adjusting your filters or search term.",
  className = "",
  actions = [],
  showDefaultActions = true,
}: EmptyStateProps) {
  const defaultActions: ActionButton[] = [
    {
      label: "Go to Home",
      href: "/",
      variant: "outline",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      label: "Ask a Question",
      href: "/ask",
      variant: "default",
      icon: <Plus className="h-4 w-4 mr-2" />,
    },
  ];

  const displayActions = showDefaultActions
    ? [...defaultActions, ...actions]
    : actions;

  return (
    <fieldset
      className={`border-2 border-gray-900 rounded-lg p-6 bg-white ${className}`}
    >
      {label && (
        <legend className="px-3 text-xs font-bold uppercase tracking-wider bg-yellow-400 text-gray-900 border-2 border-gray-900 rounded-md">
          {label}
        </legend>
      )}

      <div className="flex flex-col items-center text-center py-8 px-4">
        {/* Empty Media Icon */}
        <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-900 flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <FileSearch className="h-5 w-5 text-gray-500" />
        </div>

        {/* Empty Header / Title / Description */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <div className="text-sm text-gray-600 max-w-md mb-6">
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>

        {/* Empty Content / Actions */}
        {displayActions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {displayActions.map((action, index) => {
              const isPrimary = action.variant === "default" || !action.variant;
              const buttonClass = isPrimary
                ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-gray-900 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white hover:bg-gray-50 text-gray-900 border-gray-900";

              const commonStyles = `relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 cursor-pointer ${buttonClass}`;
              const inlineStyles = {
                borderRadius: "8px 16px 8px 16px",
                boxShadow: "3px 3px 0 0 #000",
              };

              const content = (
                <>
                  <div className="flex items-center gap-2">
                    {action.icon}
                    {action.label}
                  </div>
                  {isPrimary && (
                    <>
                      <span className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-gray-900 bg-white"></span>
                      <span className="absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-900 bg-white"></span>
                    </>
                  )}
                </>
              );

              if (action.href) {
                return (
                  <a
                    key={index}
                    href={action.href}
                    className={commonStyles}
                    style={inlineStyles}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <button
                  key={index}
                  type="button"
                  onClick={action.onClick}
                  className={commonStyles}
                  style={inlineStyles}
                >
                  {content}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </fieldset>
  );
}

export default EmptyState;
