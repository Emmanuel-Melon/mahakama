import type { Route } from "./+types/settings";
import { SettingsScreen } from "~/feature/users/screens/SettingsScreen";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Settings - Mahakama" },
    {
      name: "description",
      content:
        "Settings page for Mahakama account to access your legal resources and history.",
    },
  ];
}

export default function SettingsPage() {
  return <SettingsScreen />;
}