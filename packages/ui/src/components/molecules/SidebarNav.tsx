import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../sidebar";

interface NavItem {
  id: string;
  title: string;
  url: string;
  icon: any;
}

interface SidebarNavProps {
  links: NavItem[];
}

export const SidebarNav = ({ links }: SidebarNavProps) => {
  const { t } = useTranslation("common");
  return (
    <SidebarMenu>
      {links.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton asChild className="mb-2">
            <NavLink
              to={item.url}
              viewTransition
              className={({ isActive }) => {
                return isActive ? "bg-yellow-300" : "bg-green-300";
              }}
            >
              <item.icon className="h-4 w-4" />
              <span>{t(item.title)}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
