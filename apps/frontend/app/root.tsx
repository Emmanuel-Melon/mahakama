import type { Route } from "./+types/root";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  redirect,
} from "react-router";
import { WebsiteLayout } from "@mah/ui/components/organisms/layout/WebsiteLayout";
import { AuthLayout } from "@mah/ui/components/organisms/layout/AuthLayout";
import { useNavLinks } from "~/hooks/use-nav-links";
import { useUser, UserProvider } from "~/context/user-provider";
import { QueryClientProviderWrapper } from "~/context/query-client-provider";
import "./app.css";
import { userContext, authContext } from "~/middleware/context";
import { getAuthToken, decodeJWT } from "@mah/api/src/api/api.utils";
import { createIsolatedClient } from "@mah/api/src/axios/axios.ssr";
import { AuthApiClient } from "@mah/api/src/clients/auth.api";
import {
  LawyersApiClient,
  type Lawyer,
} from "@mah/api/src/clients/lawyers.api";
import type { User } from "@mah/api/src/clients/users.api";
import { getOnboardingPath } from "@mah/client/nav";
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

export async function loader({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
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
        "Failed to fetch full user info via Auth API in loader:",
        error,
      );
    }
  }

  let lawyerProfile = null;
  if (
    auth?.token &&
    fullUser?.role === "lawyer" &&
    fullUser.isOnboarded === false &&
    !url.pathname.startsWith("/onboarding")
  ) {
    try {
      const isolatedClient = createIsolatedClient(request);
      const lawyersApi = new LawyersApiClient(isolatedClient);
      const res = await lawyersApi.getProfile();
      lawyerProfile = res?.data ?? null;
    } catch (error) {
      console.error(
        "Failed to fetch lawyer profile info via API in loader:",
        error,
      );
    }
  }

  if (
    auth?.token &&
    fullUser &&
    fullUser.role !== "admin" &&
    fullUser.isOnboarded === false &&
    !url.pathname.startsWith("/onboarding") &&
    isAuthRoute(url.pathname)
  ) {
    if (fullUser.role === "lawyer") {
      const status = lawyerProfile?.status;
      if (status !== "submitted" && status !== "approved") {
        return redirect(getOnboardingPath(fullUser.role));
      }
    } else {
      return redirect(getOnboardingPath(fullUser.role));
    }
  }

  return { user: fullUser, token: auth?.token, lawyerProfile };
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
  const { user, lawyerProfile } = useLoaderData<typeof loader>();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const isAppRoute = isAuthRoute(location.pathname);
  const isAuthRoutePage = isAuthPageRoute(location.pathname);
  const isOnboardingRoute = location.pathname.startsWith("/onboarding");

  return (
    <QueryClientProviderWrapper>
      <UserProvider user={user}>
        <AuthenticatedApp
          pageTitle={pageTitle}
          isAppRoute={isAppRoute}
          isAuthRoutePage={isAuthRoutePage}
          isOnboardingRoute={isOnboardingRoute}
          lawyerProfile={lawyerProfile}
        />
      </UserProvider>
    </QueryClientProviderWrapper>
  );
}

function AuthenticatedApp({
  pageTitle,
  isAppRoute,
  isAuthRoutePage,
  isOnboardingRoute,
  lawyerProfile,
}: {
  pageTitle: string;
  isAppRoute: boolean;
  isAuthRoutePage: boolean;
  isOnboardingRoute: boolean;
  lawyerProfile: Lawyer | null;
}) {
  const navLinks = useNavLinks();
  const { user, logout } = useUser();

  if (isOnboardingRoute) {
    return <Outlet />;
  }

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
        <LawyerReviewBanner lawyerProfile={lawyerProfile} role={user?.role} />
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

function LawyerReviewBanner({
  lawyerProfile,
  role,
}: {
  lawyerProfile: Lawyer | null;
  role?: User["role"];
}) {
  if (role !== "lawyer" || lawyerProfile?.status !== "submitted") {
    return null;
  }

  return (
    <div className="border-b-2 border-amber-300 bg-amber-50">
      <p className="mx-auto max-w-6xl px-4 py-2 text-sm text-amber-800">
        Your lawyer profile has been submitted for review. You will be notified
        once it has been approved.
      </p>
    </div>
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
