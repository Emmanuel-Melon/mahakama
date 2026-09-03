import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { QueryClientProviderWrapper } from "~/context/query-client-provider";
import { UserProvider } from "~/context/user-provider";
import { AppShell } from "@mah/ui/components/organisms/layout/AppShell";
import { Toaster } from "@mah/ui/components/Sonner";
import { AuthLayout } from "@mah/ui/components/organisms/layout/AuthLayout";
import { useNavLinks } from "~/lib/nav/nav.permissions";
import { useUser } from "~/context/user-provider";
import { isAuthPageRoute } from "~/config/routes.config";
import { configureApi } from "@mah/api/src/api/api.config";
import { appConfig } from "~/config";
import i18n from "~/lib/i18n";
import { userContext, authContext } from "~/middleware/context";
import { getAuthToken, decodeJWT } from "@mah/api/src/api/api.utils";
import { createIsolatedClient } from "@mah/api/src/axios/axios.ssr";
import { AuthApiClient } from "@mah/api/src/clients/auth.api";

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

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = context.get(userContext) || null;
  const auth = context.get(authContext) || null;

  let fullUser = user;
  if (auth?.token) {
    try {
      const isolatedClient = createIsolatedClient(request);
      const authApi = new AuthApiClient(isolatedClient);
      const res = await authApi.getMe();
      if (res?.data) {
        fullUser = res.data;
      }
    } catch (error) {
      console.error(
        "Failed to fetch full user info via Auth API in admin root loader:",
        error,
      );
    }
  }

  return { user: fullUser };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
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
  const isAuthPage = isAuthPageRoute(location.pathname);
  const isOnboardingRoute = location.pathname.startsWith("/onboarding");

  return (
    <QueryClientProviderWrapper>
      <UserProvider user={user}>
        {isOnboardingRoute ? (
          <Outlet />
        ) : isAuthPage ? (
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        ) : (
          <AdminShell>
            <Outlet />
          </AdminShell>
        )}
      </UserProvider>
    </QueryClientProviderWrapper>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const navLinks = useNavLinks();
  const { user, logout } = useUser();

  return (
    <AppShell
      pageTitle="Mahakama Admin"
      navLinks={navLinks}
      user={user}
      onLogout={logout}
    >
      {children}
      <Toaster position="bottom-right" />
    </AppShell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

async function authMiddleware({ request, context }) {
  const token = getAuthToken(request);
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (isAuthPageRoute(pathname)) {
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

    const user = {
      id: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      isOnboarded: decodedToken.isOnboarded,
      role: decodedToken.role,
    };

    context.set(userContext, user);
    context.set(authContext, { token });
  } catch (error) {
    console.error("Auth middleware error:", error);
  }
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];
