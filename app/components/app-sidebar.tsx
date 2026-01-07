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
    Briefcase,
} from "lucide-react"
// import { useUser } from '~/context/user-provider';
import { useLogout } from '~/feature/auth/hooks/use-auth';
import { NavLink } from "react-router";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarGroupLabel
} from "~/components/ui/sidebar"
import { NavUser } from "~/components/nav-user";
import { CountrySelector } from "~/components/country-selector";
import { OnboardingProgress } from "~/components/onboarding-progress";
import { SidebarNav } from "~/components/SidebarNav";

const userItems = [
    {
        id: 'nav-recents',
        title: "Recent Chats",
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
    },
    {
        id: 'nav-messages',
        title: "Messages",
        url: "/messages",
        icon: Mail,
    }
];

const lawyerItems = [
    {
        id: 'nav-recents',
        title: "Recents",
        url: "/chats/recents",
        icon: History,
    },
    {
        id: 'nav-my-clients',
        title: "My Clients",
        url: "/lawyers/clients",
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
    },
    {
        id: 'nav-messages',
        title: "Messages",
        url: "/messages",
        icon: Mail,
    },
    {
        id: 'nav-case-management',
        title: "Case Management",
        url: "/lawyers/cases",
        icon: Briefcase,
    }
];

export function AppSidebar() {
    // const { user } = useUser();
    const navigationItems = userItems; // Default to user items for now

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
             
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarNav links={navigationItems} />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="py-4">
                <OnboardingProgress />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}