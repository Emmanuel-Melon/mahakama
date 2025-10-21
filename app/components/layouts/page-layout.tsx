import type { ReactNode } from "react";
import { Button } from "../ui/button";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

import { useNavigate, useLocation, Link } from "react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  showBackButton?: boolean;
  className?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export function PageHeader({
  showBackButton = true,
  className = "",
  breadcrumbs,
  children,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Use custom breadcrumbs if provided, otherwise fall back to path segments
  const pathSegments =
    breadcrumbs ||
    location.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => ({
        label: segment.replace(/-/g, " "),
        to: undefined,
      }));

  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <nav className="flex items-center text-sm">
          {pathSegments.map((segment, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 mx-2 text-muted-foreground/60" />
              )}
              {segment.to ? (
                <Link
                  to={segment.to}
                  className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50"
                >
                  {segment.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground px-2 py-1">
                  {segment.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {children && (
        <div className="flex items-center space-x-2">{children}</div>
      )}
    </div>
  );
}
