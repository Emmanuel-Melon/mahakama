import { useTranslation } from "react-i18next";

import { type LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "../sidebar";
import { SidebarNav } from "../molecules/SidebarNav";
import { OnboardingProgress } from "../molecules/OnboardingProgress";
import { NavUser } from "./NavUser";
import { useUser } from "~/context/user-provider";

export interface NavLinkItem {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number | string;
}

interface AppSidebarProps {
  navLinks: NavLinkItem[];
}

export function AppSidebar({ navLinks }: AppSidebarProps) {
  const { t } = useTranslation("common");
  const { user, logout } = useUser();
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
        <NavUser user={user} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}
