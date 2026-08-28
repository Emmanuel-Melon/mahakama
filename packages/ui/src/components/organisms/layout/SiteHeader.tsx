import { SidebarTrigger } from "../../sidebar";
import { Separator } from "../../separator";
import { NavLink } from "react-router";

interface SiteHeaderProps {
  title?: string;
  rightContent?: React.ReactNode;
}

export function SiteHeader({
  title = "Documents",
  rightContent,
}: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) py-2 hidden md:flex">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-1 px-2 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <NavLink
            to="/"
            viewTransition
            className="flex items-center gap-2 group"
          >
            <span className="text-base font-semibold">{title}</span>
          </NavLink>
        </div>
        {rightContent && (
          <div className="flex items-center gap-2">{rightContent}</div>
        )}
      </div>
    </header>
  );
}
