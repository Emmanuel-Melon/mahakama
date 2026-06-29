import { User, LogOut, Settings, Info } from "lucide-react";
import { Link } from "react-router";
import { IconContainer } from "~/components/icon-container";
import type { User as UserType } from "~/lib/api/users.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface UserDropdownProps {
  user: UserType;
  onLogout: () => void;
}

const navLinks = [
  {
    id: 0,
    title: "Profile",
    icon: User,
    url: "/users/profile",
  },
  {
    id: 1,
    title: "Settings",
    icon: Settings,
    url: "/users/settings",
  },
  {
    id: 2,
    title: "About Us",
    icon: Info,
    url: "/about",
  },
];

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger
        className="rounded-full mr-2"
        aria-label="User menu"
      >
        <IconContainer
          size="sm"
          color="handdrawn"
          text={user.name ? user.name.charAt(0).toUpperCase() : undefined}
          icon={!user.name ? User : undefined}
          className="cursor-pointer"
        />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-lg"
        align="end"
      >
        <DropdownMenuLabel className="px-4 py-2 border-b-2 border-gray-200">
          <p className="text-sm font-bold text-gray-900 truncate">
            {user.name || user.email}
          </p>
          <p className="text-xs text-gray-600 font-normal truncate">{user.email}</p>
        </DropdownMenuLabel>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <DropdownMenuItem key={link.id} asChild>
              <Link
                to={link.url}
                className="flex items-center text-gray-900 hover:bg-yellow-50 cursor-pointer"
              >
                <Icon className="h-4 w-4 mr-2" />
                {link.title}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem 
          onClick={onLogout}
          className="text-red-600 hover:bg-yellow-50 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}