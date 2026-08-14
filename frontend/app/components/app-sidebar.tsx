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
import type { NavLinkItem } from "~/lib/nav/nav.types";

interface AppSidebarProps {
  navLinks: NavLinkItem[];
}

export function AppSidebar({ navLinks }: AppSidebarProps) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarNav links={navLinks} />
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
