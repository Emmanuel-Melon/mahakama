import { defineRoutes } from "@mah/client/nav";

export const settingsRoutes = defineRoutes({
  index: { path: "settings", file: "routes/settings/index.tsx" },
});

export const SettingsPaths = settingsRoutes.to;
