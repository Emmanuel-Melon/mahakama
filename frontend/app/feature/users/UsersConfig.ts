import { defineRoutes } from "../../lib/nav/nav.paths";
import en from "../../locales/en/users.json";
import ar from "../../locales/ar/users.json";
import type { I18nConfig } from "~/lib/i18n/i18next.types";

export const usersRoutes = defineRoutes({
  profile: { path: "users/:profile", file: "routes/users/$profile.tsx" },
  settings: { path: "users/settings", file: "routes/users/settings.tsx" },
});

export const UsersPaths = usersRoutes.to;

export const usersI18n: I18nConfig<"users", typeof en> = {
  namespace: "users",
  resources: {
    en,
    ar,
  },
};
