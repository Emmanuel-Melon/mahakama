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
import { useTranslation } from "react-i18next";

interface AppSidebarProps {
  navLinks: NavLinkItem[];
}

export function AppSidebar({ navLinks }: AppSidebarProps) {
  const { t } = useTranslation("common");
  return (
    <Sidebar variant="inset">
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.group")}</SidebarGroupLabel>
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
