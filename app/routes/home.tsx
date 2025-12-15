import type { Route } from "./+types/home";
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

export default HomeScreen;