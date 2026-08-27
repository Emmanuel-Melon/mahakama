import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { HelpCircle, PhoneCall } from "lucide-react";
import { NavLink } from "react-router";
import { NotificationsDropdown } from "../molecules/notifications-dropdown";
import { LanguageSwitcher } from "../molecules/language-switcher";

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
        {rightContent ?? (
          <div className="flex items-center gap-2">
            <NotificationsDropdown
              notifications={[
                {
                  id: "1",
                  title: "New document shared",
                  description: "John Doe shared a legal document with you",
                  time: "2 minutes ago",
                  read: false,
                },
                {
                  id: "2",
                  title: "Case update",
                  description:
                    "Your case status has been updated to 'In Progress'",
                  time: "1 hour ago",
                  read: false,
                },
                {
                  id: "3",
                  title: "Appointment reminder",
                  description:
                    "You have a consultation scheduled for tomorrow at 2:00 PM",
                  time: "3 hours ago",
                  read: true,
                },
              ]}
              onMarkAsRead={(id) => console.log("Mark as read:", id)}
              onShowAll={() => console.log("Show all notifications")}
            />
            <LanguageSwitcher />
            <NavLink
              to="/help"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </NavLink>
            <NavLink
              to="/contact"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Contact Us</span>
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
