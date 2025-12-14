import { User, LogOut } from "lucide-react";
import { Link } from "react-router";
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

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 rounded-full mr-2"
        aria-label="User menu"
      >
        <div 
          className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center text-gray-900 font-bold
                   border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]
                   transition-all duration-200 transform hover:-translate-y-0.5"
        >
          {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
        </div>
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
        
        <DropdownMenuItem asChild>
          <Link
            to="/users/profile"
            className="flex items-center text-gray-900 hover:bg-yellow-50 cursor-pointer"
          >
            <User className="h-4 w-4 mr-2" />
            View Profile
          </Link>
        </DropdownMenuItem>
        
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