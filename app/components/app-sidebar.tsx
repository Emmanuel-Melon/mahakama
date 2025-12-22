import {
    Users,
    Library,
    History,
    Mail,
    ChevronUp,
    LogOut,
    Settings,
    User,
    Scale,
    HelpCircle,
} from "lucide-react"
import { useUser } from '~/context/user-provider';
import { useLogout } from '~/feature/auth/hooks/use-auth';
import { NavLink } from "react-router";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroupLabel
} from "~/components/ui/sidebar"
import { NavUser } from "~/components/nav-user";
import { CountrySelector } from "~/components/country-selector";

const items = [
    {
        id: 'nav-recents',
        title: "Recents",
        url: "/chats/recents",
        icon: History,
    },
    {
        id: 'nav-find-lawyer',
        title: "Find a Lawyer",
        url: "/lawyers",
        icon: Users,
    },
    {
        id: 'nav-justice-hub',
        title: "Justice Hub",
        url: "/legal-hub",
        icon: Scale,
    },
    {
        id: 'nav-legal-database',
        title: "Legal Database",
        url: "/documents",
        icon: Library,
    }
]

export function AppSidebar() {
    const { user } = useUser();
    const logoutMutation = useLogout();
    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <CountrySelector />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton asChild className="mb-2">
                                        <NavLink
                                            to={item.url}
                                            viewTransition
                                            className={({ isActive }) =>
                                                `flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-2 border-black rounded-lg ${isActive
                                                    ? "bg-yellow-300 shadow-[2px_2px_0_0_#000] translate-x-0 translate-y-0"
                                                    : "bg-white shadow-[3px_3px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                                                }`
                                            }
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="mb-2">
                            <NavLink
                                to="/help"
                                viewTransition
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all border-2 border-gray-900 rounded-lg bg-white shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                            >
                                <HelpCircle className="h-4 w-4" />
                                <span>Help & Support</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}