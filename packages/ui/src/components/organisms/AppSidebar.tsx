import { useTranslation } from "react-i18next";

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
import { NavUser } from "./NavUser";
import type { NavLinkItem } from "@mah/client/nav";
import type { User } from "@mah/api/src/clients/users.api";

interface AppSidebarProps {
  navLinks: NavLinkItem[];
  user: User | null;
  onLogout: () => void;
  footer?: React.ReactNode;
}

export function AppSidebar({
  navLinks,
  user,
  onLogout,
  footer,
}: AppSidebarProps) {
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
        {footer}
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
