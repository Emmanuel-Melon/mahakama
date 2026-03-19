import type { Route } from "./+types/root";
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
import { AppShell } from "~/layouts/AppShell";
import { WebsiteLayout } from "~/layouts/WebsiteLayout";
import { AuthLayout } from "~/layouts/AuthLayout";
import { QueryClientProviderWrapper } from '~/context/query-client-provider';
import "./app.css";
import { NotFound } from "./routes/$";
import { userContext, authContext } from "~/middleware/context";
import { getAuthToken, decodeJWT } from "~/lib/api/utils";
import { getPageTitle, isAuthRoute, isAuthPageRoute } from "~/config/routes.config";

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
  try {
    const user = null;
    const token = null;
    return { user, token };
  } catch (error) {
    return { user: null, token: null };
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
  const user = loaderData?.user || null;
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);
  const isAppRoute = isAuthRoute(location.pathname);
  const isAuthRoutePage = isAuthPageRoute(location.pathname);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-['Inter'] antialiased">
        <QueryClientProviderWrapper>
          {isAuthRoutePage ? (
            <AuthLayout>
              {children}
            </AuthLayout>
          ) : isAppRoute ? (
            <AppShell pageTitle={pageTitle} user={user}>
              {children}
            </AppShell>
          ) : (
            <WebsiteLayout>
              {children}
            </WebsiteLayout>
          )}
        </QueryClientProviderWrapper>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
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

    if (error.status === 404) {
      return <NotFound />;
    }
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
  console.log("token", token);
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
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
    console.error('Auth middleware error:', error);
  }
}

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
];

