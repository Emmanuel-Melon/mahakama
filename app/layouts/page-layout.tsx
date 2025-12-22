import type { ReactNode } from "react";
import { SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";
import { useNavigate, useLocation, Link, NavLink } from "react-router";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="w-full py-4">
          <div className={className}>{children}</div>
        </div>
      </div>
    </SidebarInset>
  );
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: LucideIcon;
}

interface PageHeaderProps {
  showBackButton?: boolean;
  className?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  backTo?: string;
}

export function PageHeader({
  showBackButton = true,
  className = "",
  breadcrumbs,
  children,
  backTo,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Use custom breadcrumbs if provided, otherwise fall back to path segments
  const pathSegments =
    breadcrumbs ||
    location.pathname
      .split("/")
      .filter(Boolean)
      .map((segment, index) => ({
        label: segment.replace(/-/g, " "),
        to: undefined,
        icon: index === 0 ? Home : undefined,
      }));

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        {showBackButton && (
          backTo ? (
            <NavLink
              to={backTo}
              viewTransition
              className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </NavLink>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )
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
                  viewTransition
                  className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50 flex items-center gap-1"
                >
                  {segment.icon && <segment.icon className="w-3.5 h-3.5" />}
                  {segment.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground px-2 py-1 flex items-center gap-1">
                  {segment.icon && <segment.icon className="w-3.5 h-3.5" />}
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
