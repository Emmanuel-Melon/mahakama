import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Bell,
  Settings,
  CreditCard,
} from "lucide-react";
import type { NavLinkItem } from "@mah/client/nav";

export const ORG_NAV_LINKS: NavLinkItem[] = [
  {
    id: "nav-home",
    title: "nav.home",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    id: "nav-matters",
    title: "nav.matters",
    url: "/matters",
    icon: FolderOpen,
  },
  {
    id: "nav-team",
    title: "nav.team",
    url: "/team",
    icon: Users,
  },
  {
    id: "nav-notifications",
    title: "nav.notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    id: "nav-settings",
    title: "nav.settings",
    url: "/settings",
    icon: Settings,
  },
  {
    id: "nav-billing",
    title: "nav.billing",
    url: "/billing",
    icon: CreditCard,
  },
];

export const ALL_NAV_LINKS: NavLinkItem[] = ORG_NAV_LINKS;
