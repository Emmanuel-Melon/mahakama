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
import { WebsiteLayout } from "@mah/ui/components/organisms/layout/WebsiteLayout";
import { AuthLayout } from "@mah/ui/components/organisms/layout/AuthLayout";
import { useNavLinks } from "~/hooks/use-nav-links";
import { useUser, UserProvider } from "~/context/user-provider";
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
import { useEffect } from "react";
import i18n from "~/lib/i18n";
import { RootErrorBoundary } from "./components/RootErrorBoundary";
import { AppShell } from "@mah/ui/components/organisms/layout/AppShell";

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
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const isAppRoute = isAuthRoute(location.pathname);
  const isAuthRoutePage = isAuthPageRoute(location.pathname);

  return (
    <QueryClientProviderWrapper>
      <UserProvider user={user}>
        <AuthenticatedApp
          pageTitle={pageTitle}
          isAppRoute={isAppRoute}
          isAuthRoutePage={isAuthRoutePage}
        />
      </UserProvider>
    </QueryClientProviderWrapper>
  );
}

function AuthenticatedApp({
  pageTitle,
  isAppRoute,
  isAuthRoutePage,
}: {
  pageTitle: string;
  isAppRoute: boolean;
  isAuthRoutePage: boolean;
}) {
  const navLinks = useNavLinks();
  const { user, logout } = useUser();

  if (isAuthRoutePage) {
    return (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    );
  }

  if (isAppRoute) {
    return (
      <AppShell
        pageTitle={pageTitle}
        navLinks={navLinks}
        user={user}
        onLogout={logout}
      >
        <Outlet />
      </AppShell>
    );
  }

  return (
    <WebsiteLayout>
      <Outlet />
    </WebsiteLayout>
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
