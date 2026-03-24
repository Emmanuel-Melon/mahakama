import type { Route } from "./+types/index";
import { authContext, userContext } from "~/middleware/context";
import { redirect } from "react-router";
import { HomeScreen } from "~/feature/website/screens/HomeScreen";
import { handleRouteError } from "~/lib/errors/errors.utils";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Mahakama - Legal Knowledge and Access for Everyone" },
    {
      name: "description",
      content:
        "Access free legal information and resources for South Sudan and Uganda. Understand your rights in simple language.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    const isAuth = user && token;
    if (isAuth) {
      return redirect("/app");
    }
    return { user: null, isAuth };
  } catch (error) {
    handleRouteError(error, "Failed to load mahakama");
  }
}

export default function Mahakama({ loaderData }: Route.ComponentProps) {
  const { user, isAuth } = loaderData;
  if (isAuth) {
    return redirect("/app");
  }
  console.log("User is not authenticated", user, isAuth);
  return <HomeScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return (
    <MahErrorBoundary
      status={error.status}
      data={error.data}
    />
  );
}