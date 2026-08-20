import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/organisms/app-sidebar";
import { SiteHeader } from "~/components/organisms/site-header";
import { Toaster } from "sonner";
import { CountryProvider } from "~/context/country-context";
import { NavigationLoader } from "~/components/atoms/navigation-loader";
import { useNavLinks } from "~/hooks/use-nav-links";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const AppShell = ({ children, pageTitle }: AppShellProps) => {
  const navLinks = useNavLinks();

  return (
    <CountryProvider>
      <Toaster />
      <main className="h-svh overflow-hidden">
        <NavigationLoader />
        <SidebarProvider className="h-full">
          <AppSidebar navLinks={navLinks} />
          <SidebarInset>
            <SiteHeader title={pageTitle} />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </main>
    </CountryProvider>
  );
};
