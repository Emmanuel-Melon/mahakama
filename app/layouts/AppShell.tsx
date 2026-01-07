import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { Toaster } from 'sonner';
import { UserProvider } from '~/context/user-provider';
import { CountryProvider } from '~/context/country-context';

interface AppShellProps {
  children: React.ReactNode;
  pageTitle: string;
  user: any;
}

export const AppShell = ({ children, pageTitle, user }: AppShellProps) => {
  return (
  
      <CountryProvider>
        <Toaster />
        <main className="flex-1 pb-16 md:pb-0">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset >
              <SiteHeader title={pageTitle} role={user?.role} />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </main>
      </CountryProvider>

  )
}