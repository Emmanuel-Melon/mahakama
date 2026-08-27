import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarGroupLabel,
} from "~/components/ui/sidebar";
import { NavUser } from "~/components/organisms/nav-user";
import { OnboardingProgress } from "~/components/molecules/onboarding-progress";
import { SidebarNav } from "~/components/molecules/SidebarNav";
import type { NavLinkItem } from "~/lib/nav/nav.types";
import type { User } from "@mah/api/src/clients/users.api";
import { useTranslation } from "react-i18next";

interface AppSidebarProps {
  navLinks: NavLinkItem[];
  user: User | null;
  onLogout: () => void;
}

export function AppSidebar({ navLinks, user, onLogout }: AppSidebarProps) {
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
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
