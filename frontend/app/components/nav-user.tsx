import { User, Settings, LogOut, MoreVertical } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { useUser } from "~/context/user-provider";
import { useLogout } from "~/feature/auth/hooks/use-auth";
import { NavLink } from "react-router";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const logoutMutation = useLogout();

  const userItems = [
    {
      id: "user-account",
      title: "Account",
      icon: User,
      url: "/users/profile",
    },
    {
      id: "user-settings",
      title: "Settings",
      icon: Settings,
      url: "/users/settings",
    },
    {
      id: "user-logout",
      title: "Sign out",
      icon: LogOut,
      action: "logout",
    },
  ];

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-2 border-gray-900 bg-white hover:bg-yellow-50 font-bold"
              style={{
                boxShadow: "2px 2px 0 0 #000",
                borderRadius: "4px 8px 4px 8px",
              }}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.name || user?.email || "User"}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name || user?.email || "User"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {userItems.map((item) => {
                const Icon = item.icon;
                if (item.action === "logout") {
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => logoutMutation.mutate()}
                      className="text-red-600 hover:bg-yellow-50 cursor-pointer"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </DropdownMenuItem>
                  );
                }
                return (
                  <DropdownMenuItem key={item.id} asChild>
                    <NavLink
                      to={item.url || "#"}
                      viewTransition
                      className="flex items-center text-gray-900 hover:bg-yellow-50 cursor-pointer"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </NavLink>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
