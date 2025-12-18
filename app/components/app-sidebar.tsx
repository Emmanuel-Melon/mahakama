import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
    Scale,
    Users,
    Library,
    History,
    Info,
    Mail,
    ChevronDown,
    Globe,
    ChevronUp,
    User2,
    LogOut,
    Settings,
    User,
} from "lucide-react"

import { useUser } from '~/context/user-provider';
import { useLogout } from '~/feature/auth/hooks/use-auth';
import { NavLink } from "react-router";
import { IconContainer } from "~/components/icon-container";
import { useState } from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar"
const workspaceItems = [
    {
        title: "South Sudan",
        icon: Globe,
    },
    {
        title: "Uganda",
        icon: Globe,
    },
    {
        title: "Kenya",
        icon: Globe,
    },
]

// User dropdown items
const userItems = [
    {
        title: "Account",
        icon: User,
        url: "/users/profile",
    },
    {
        title: "Settings",
        icon: Settings,
        url: "/users/settings",
    },
    {
        title: "Sign out",
        icon: LogOut,
        action: "logout",
    },
]
const items = [
    {
        title: "Recents",
        url: "/chats/recents",
        icon: History,
    },
    {
        title: "Find a Lawyer",
        url: "/lawyers",
        icon: Users,
    },
    {
        title: "Justice Hub",
        url: "/legal-hub",
        icon: Scale,
    },
    {
        title: "Legal Database",
        url: "/documents",
        icon: Library,
    },
        {
        title: "Messages",
        url: "/messages",
        icon: Mail,
    },
]

export function AppSidebar() {
  const { user } = useUser();
  const logoutMutation = useLogout();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="border-2 border-gray-900 bg-white hover:bg-yellow-50 font-bold" style={{
                                  boxShadow: "2px 2px 0 0 #000",
                                  borderRadius: "4px 8px 4px 8px",
                                }}>
                                    {selectedCountry || 'Select Country'}
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                className="w-56 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-lg"
                            >
                                <DropdownMenuLabel className="px-4 py-2 border-b-2 border-gray-200">
                                    <p className="text-sm font-bold text-gray-900">Select Country</p>
                                </DropdownMenuLabel>
                                {workspaceItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <DropdownMenuItem 
                                            key={item.title} 
                                            className="flex items-center text-gray-900 hover:bg-yellow-50 cursor-pointer"
                                            onClick={() => setSelectedCountry(item.title)}
                                        >
                                            <Icon className="h-4 w-4 mr-2" />
                                            {item.title}
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="border-2 border-gray-900 bg-white hover:bg-yellow-50 font-bold" style={{
                                  boxShadow: "2px 2px 0 0 #000",
                                  borderRadius: "4px 8px 4px 8px",
                                }}>
                                    <span className="truncate">{user?.email || 'User'}</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-56 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-lg mb-4"
                            >
                                <DropdownMenuLabel className="px-4 py-2 border-b-2 border-gray-200">
                                    <p className="text-sm font-bold text-gray-900 truncate">
                                        {user?.name || user?.email}
                                    </p>
                                    <p className="text-xs text-gray-600 font-normal truncate">{user?.email}</p>
                                </DropdownMenuLabel>
                                {userItems.map((item) => {
                                    const Icon = item.icon;
                                    if (item.action === "logout") {
                                        return (
                                            <DropdownMenuItem 
                                                key={item.title}
                                                onClick={() => logoutMutation.mutate()}
                                                className="text-red-600 hover:bg-yellow-50 cursor-pointer"
                                            >
                                                <Icon className="h-4 w-4 mr-2" />
                                                {item.title}
                                            </DropdownMenuItem>
                                        );
                                    }
                                    return (
                                        <DropdownMenuItem key={item.title} asChild>
                                            <NavLink
                                                to={item.url || "#"}
                                                className="flex items-center text-gray-900 hover:bg-yellow-50 cursor-pointer"
                                            >
                                                <Icon className="h-4 w-4 mr-2" />
                                                {item.title}
                                            </NavLink>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}