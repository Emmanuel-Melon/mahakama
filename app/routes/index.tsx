import type { Route } from "./+types/index";
import { authContext, userContext } from "~/middleware/context";
import { redirect } from "react-router";
import { HomeScreen } from "~/feature/website/screens/HomeScreen";

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
    console.error("Error checking authentication:", error);
    return { user: null, isAuth: false };
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