import { HelpCircle, PhoneCall } from "lucide-react";
import { NavLink } from "react-router";
import { NotificationsDropdown } from "../../molecules/NotificationsDropdown";
import { LanguageSwitcher } from "../../molecules/LanguageSwitcher";

export function HeaderActions() {
  return (
    <>
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
            description: "Your case status has been updated to 'In Progress'",
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
    </>
  );
}
