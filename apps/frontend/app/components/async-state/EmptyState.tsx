import { FileSearch, Plus, Home } from "lucide-react";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Button } from "~/components/ui/button";

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
    <CardWithLabel label={label} className={className}>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileSearch className="h-5 w-5 text-gray-400" />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>
            {typeof description === "string" ? (
              <p>{description}</p>
            ) : (
              description
            )}
          </EmptyDescription>
        </EmptyHeader>
        {displayActions.length > 0 && (
          <EmptyContent>
            <div className="flex flex-wrap gap-4">
              {displayActions.map((action, index) => {
                const isPrimary =
                  action.variant === "default" || !action.variant;
                const buttonClass = isPrimary
                  ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-gray-900 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white hover:bg-gray-50 text-gray-900 border-gray-900";

                return (
                  <Button
                    key={index}
                    asChild={!!action.href}
                    className={`relative px-6 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${buttonClass}`}
                    style={{
                      borderRadius: "8px 16px 8px 16px",
                      boxShadow: "3px 3px 0 0 #000",
                    }}
                    onClick={action.onClick}
                  >
                    {action.href ? (
                      <a href={action.href}>
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
                    ) : (
                      <div className="flex items-center gap-2">
                        {action.icon}
                        {action.label}
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </EmptyContent>
        )}
      </Empty>
    </CardWithLabel>
  );
}

export default EmptyState;
