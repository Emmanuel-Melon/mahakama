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
    if (user && token) {
      return redirect("/app");
    }
    return { user: null, token: null };
  } catch (error) {
    console.error("Error checking authentication:", error);
    return { user: null, token: null };
  }
}

export default function Mahakama({ loaderData }: Route.ComponentProps) {
  return <HomeScreen />;
}