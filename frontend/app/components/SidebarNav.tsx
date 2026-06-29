import { NavLink } from "react-router";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

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
              <span>{item.title}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
