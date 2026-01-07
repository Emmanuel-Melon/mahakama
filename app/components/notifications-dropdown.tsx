import { Bell, Settings, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "app/components/ui/dropdown-menu";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationsDropdownProps {
  notifications?: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onShowAll?: () => void;
  className?: string;
}

export function NotificationsDropdown({
  notifications = [],
  onMarkAsRead,
  onShowAll,
  className = "",
}: NotificationsDropdownProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 border-2 border-gray-900 bg-white"
        style={{ boxShadow: "3px 3px 0 0 #000" }}
      >
        <DropdownMenuLabel className="text-sm font-medium text-gray-900">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="px-3 py-5 text-center text-sm text-gray-500">
            No new notifications
          </div>
        ) : (
          <>
            {notifications.slice(0, 3).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3 hover:bg-gray-50"
                onClick={() => onMarkAsRead?.(notification.id)}
              >
                <div className="flex items-start gap-2 w-full">
                  <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                    notification.read ? "bg-gray-300" : "bg-blue-500"
                  }`}>
                    {notification.read && <CheckCircle className="w-2 h-2 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            
            {notifications.length > 3 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="px-3 py-2 text-center text-sm text-blue-600 hover:bg-blue-50 font-medium"
                  onClick={onShowAll}
                >
                  Show all notifications
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
