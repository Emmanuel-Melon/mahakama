import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { Toaster } from 'sonner';
import { CountryProvider } from '~/context/country-context';
import { NavigationLoader } from '~/components/navigation-loader';

interface AppShellProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const AppShell = ({ children, pageTitle }: AppShellProps) => {
  return (
    <CountryProvider>
      <Toaster />
      <main className="flex-1 pb-16 md:pb-0">
        <NavigationLoader />
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset >
            <SiteHeader title={pageTitle} />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </main>
    </CountryProvider>

  )
}