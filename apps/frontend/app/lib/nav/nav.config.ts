import type { NavLinkItem } from "@mah/client/nav";
import {
  Users,
  Library,
  History,
  Scale,
  Home,
  Briefcase,
  ClipboardList,
  FolderOpen,
} from "lucide-react";

export const BASE_NAV_LINKS: NavLinkItem[] = [
  {
    id: "nav-home",
    title: "nav.home",
    url: "/",
    icon: Home,
  },
  {
    id: "nav-matters",
    title: "nav.matters",
    url: "/matters",
    icon: FolderOpen,
  },
];

export const APP_NAV_LINKS: NavLinkItem[] = [
  ...BASE_NAV_LINKS,
  {
    id: "nav-find-lawyer",
    title: "nav.findLawyer",
    url: "/lawyers",
    icon: Users,
  },
  {
    id: "nav-justice-hub",
    title: "nav.justiceHub",
    url: "/legal-hub",
    icon: Scale,
  },
  {
    id: "nav-legal-database",
    title: "nav.legalDatabase",
    url: "/documents",
    icon: Library,
  },
  {
    id: "nav-recents",
    title: "nav.recents",
    url: "/chats/recents",
    icon: History,
  },
];

export const LAWYER_NAV_LINKS: NavLinkItem[] = [
  ...BASE_NAV_LINKS,
  {
    id: "nav-clients",
    title: "nav.clients",
    url: "/clients",
    icon: Briefcase,
  },
  {
    id: "nav-consultations",
    title: "nav.consultations",
    url: "/consultations",
    icon: ClipboardList,
  },
  {
    id: "nav-legal-database",
    title: "nav.legalDatabase",
    url: "/documents",
    icon: Library,
  },
];

export const ROLE_NAV_LINKS: Record<string, NavLinkItem[]> = {
  lawyer: LAWYER_NAV_LINKS,
  user: APP_NAV_LINKS,
  admin: [],
};

export const ALL_NAV_LINKS: NavLinkItem[] = Array.from(
  new Map(
    [...APP_NAV_LINKS, ...LAWYER_NAV_LINKS].map((item) => [item.id, item]),
  ).values(),
);
