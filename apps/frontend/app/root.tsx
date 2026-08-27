import type { Route } from "./+types/root";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";
import { AppShell as GenericAppShell } from "@mah/ui/components/organisms/AppShell";
import { WebsiteLayout } from "@mah/ui/components/organisms/WebsiteLayout";
import { AuthLayout } from "@mah/ui/components/organisms/AuthLayout";
import { Toaster } from "sonner";
import { CountryProvider } from "~/context/country-context";
import { NavigationLoader } from "~/components/atoms/navigation-loader";
import { useNavLinks } from "~/hooks/use-nav-links";
import { useUser } from "~/context/user-provider";
import { HeaderActions } from "~/components/organisms/header-actions";
import { OnboardingProgress } from "~/components/molecules/onboarding-progress";
import { QueryClientProviderWrapper } from "~/context/query-client-provider";
import "./app.css";
import { userContext, authContext } from "~/middleware/context";
import { getAuthToken, decodeJWT } from "@mah/api/src/api/api.utils";
import { configureApi } from "@mah/api/src/api/api.config";
import { appConfig } from "~/config";
import {
  getPageTitle,
  isAuthRoute,
  isAuthPageRoute,
} from "~/config/routes.config";
import { UserProvider } from "~/context/user-provider";
import { RootErrorBoundary } from "~/components/errors/ErrorBoundary";
import { useEffect } from "react";
import i18n from "~/lib/i18n";

configureApi({
  baseURL: appConfig.api.baseURL,
});

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext) || null;
  const auth = context.get(authContext) || null;
  return { user, token: auth?.token };
}

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
  }, []);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-['Inter'] antialiased">
        <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  pageTitle: string;
}

function AppShell({ children, pageTitle }: AppShellProps) {
  const navLinks = useNavLinks();
  const { user, logout } = useUser();

  return (
    <CountryProvider>
      <Toaster />
      <NavigationLoader />
      <GenericAppShell
        pageTitle={pageTitle}
        navLinks={navLinks}
        user={user}
        onLogout={logout}
        headerRightContent={<HeaderActions />}
        sidebarFooter={<OnboardingProgress />}
      >
        {children}
      </GenericAppShell>
    </CountryProvider>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const isAppRoute = isAuthRoute(location.pathname);
  const isAuthRoutePage = isAuthPageRoute(location.pathname);

  return (
    <UserProvider user={user}>
      {isAuthRoutePage ? (
        <AuthLayout>
          <Outlet />
        </AuthLayout>
      ) : isAppRoute ? (
        <AppShell pageTitle={pageTitle}>
          <Outlet />
        </AppShell>
      ) : (
        <WebsiteLayout>
          <Outlet />
        </WebsiteLayout>
      )}
    </UserProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RootErrorBoundary error={error} />;
}

async function authMiddleware({ request, context }) {
  const token = getAuthToken(request);
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return;
  }

  if (!token) {
    return;
  }

  try {
    const decodedToken = await decodeJWT(token);
    if (!decodedToken) {
      return;
    }

    // Extract user info from decoded token
    const user = {
      id: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      isOnboarded: decodedToken.isOnboarded,
      // Add any other user fields from your token payload
    };

    context.set(userContext, user);
    context.set(authContext, { token });
  } catch (error) {
    console.error("Auth middleware error:", error);
  }
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];
