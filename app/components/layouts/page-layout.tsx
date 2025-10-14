import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

type PathSegment = string;

interface PageHeaderProps {
  showBackButton?: boolean;
  className?: string;
  children?: ReactNode;
}

export function PageHeader({
  showBackButton = true,
  className = "",
  children,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments: PathSegment[] = location.pathname
    .split("/")
    .filter(Boolean);

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
        <nav className="flex items-center text-sm text-muted-foreground">
          {pathSegments.map((segment, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <span className="capitalize">{segment.replace(/-/g, " ")}</span>
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
