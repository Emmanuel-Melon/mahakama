import { LayoutDashboard, UserPlus, ShieldCheck, BookOpen, Building2 } from "lucide-react";
import type { NavLinkItem } from "@mah/client/nav";

export const ADMIN_NAV_LINKS: NavLinkItem[] = [
  {
    id: "nav-dashboard",
    title: "nav.dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    id: "nav-corpus",
    title: "nav.corpus",
    url: "/corpus",
    icon: BookOpen,
  },
  {
    id: "nav-orgs",
    title: "nav.orgs",
    url: "/orgs",
    icon: Building2,
  },
  {
    id: "nav-lawyer-invites",
    title: "nav.lawyerInvites",
    url: "/lawyer-invites",
    icon: UserPlus,
  },
  {
    id: "nav-lawyer-profiles",
    title: "nav.lawyerProfiles",
    url: "/lawyer-profiles",
    icon: ShieldCheck,
  },
];

export const ALL_NAV_LINKS: NavLinkItem[] = ADMIN_NAV_LINKS;
