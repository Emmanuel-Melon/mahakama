import type { Route } from "./+types/root";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { Header } from "~/layouts/header";
import { UserProvider } from '~/context/user-provider';
import { QueryClientProviderWrapper } from '~/context/query-client-provider';
import "./app.css";
import { NotFound } from "./routes/$";
import { parseCookies, getAuthToken, requireAuth } from "~/lib/api/utils";
import { usersApi, UsersApiClient } from "~/lib/api/users.api";
import { FetchApiClient } from "~/lib/api/fetch";
import { Toaster } from 'sonner';
import { userContext, authContext } from "~/middleware/context";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar";

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
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    return { user, token };
  } catch (error) {
    return { user: null, token: null };
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
  const user = loaderData?.user || null;
  console.log('from middleware', user);
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-['Helvetica'] antialiased">
        <QueryClientProviderWrapper>
          <UserProvider user={user}>
          
            <Toaster />
            {/* Header for mobile only */}
            <div className="md:hidden">
              <Header />
            </div>
            <main className="flex-1">
              <SidebarProvider>
                <AppSidebar />
                {children}
              </SidebarProvider>
            </main>
          </UserProvider>
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

async function authMiddleware({ request, context }: Route.LoaderArgs) {
  const token = getAuthToken(request);
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return;
  }

  if (!token) { throw redirect("/login"); }
  const cookieHeader = request.headers.get('cookie');
  const apiClient = cookieHeader ? new UsersApiClient(new FetchApiClient({ Cookie: cookieHeader })) : usersApi;
  
  try {
    const user = await apiClient.getCurrentUser();
    console.log("this failed", user);
    if (!user.isOnboarded) {
      // throw redirect("/onboarding");
    }
    context.set(userContext, user);
    context.set(authContext, { token });
  } catch (error) {
    throw redirect("/login");
  }
}

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
];

