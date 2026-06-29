import { Users, Library, History, Scale, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarGroupLabel,
} from "~/components/ui/sidebar";
import { NavUser } from "~/components/nav-user";
import { OnboardingProgress } from "~/components/onboarding-progress";
import { SidebarNav } from "~/components/SidebarNav";

const userItems = [
  {
    id: "nav-home",
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    id: "nav-recents",
    title: "Recent Chats",
    url: "/chats/recents",
    icon: History,
  },
  {
    id: "nav-find-lawyer",
    title: "Find a Lawyer",
    url: "/lawyers",
    icon: Users,
  },
  {
    id: "nav-justice-hub",
    title: "Justice Hub",
    url: "/legal-hub",
    icon: Scale,
  },
  {
    id: "nav-legal-database",
    title: "Legal Database",
    url: "/documents",
    icon: Library,
  },
];

export function AppSidebar() {
  const navigationItems = userItems;
  return (
    <Sidebar variant="inset">
      <SidebarHeader></SidebarHeader>
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
  );
}
