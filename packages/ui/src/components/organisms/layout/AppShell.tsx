import { SidebarProvider, SidebarInset } from "../../sidebar";
import { AppSidebar } from "./AppSidebar";
import { SiteHeader } from "./SiteHeader";
import type { NavLinkItem } from "@mah/client/nav";
import type { User } from "@mah/api/src/clients/users.api";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle: string;
  navLinks: NavLinkItem[];
  user: User | null;
  onLogout: () => void;
  headerRightContent?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
}

export function AppShell({
  children,
  pageTitle,
  navLinks,
  user,
  onLogout,
  headerRightContent,
  sidebarFooter,
}: AppShellProps) {
  return (
    <main className="h-svh overflow-hidden">
      <SidebarProvider className="h-full">
        <AppSidebar
          navLinks={navLinks}
          user={user}
          onLogout={onLogout}
          footer={sidebarFooter}
        />
        <SidebarInset>
          <SiteHeader title={pageTitle} rightContent={headerRightContent} />
          <div className="p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
