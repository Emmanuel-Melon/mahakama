import { defineRoutes } from "../../lib/nav/nav.paths";

export const usersRoutes = defineRoutes({
  profile: { path: "users/:profile", file: "routes/users/$profile.tsx" },
  settings: { path: "users/settings", file: "routes/users/settings.tsx" },
});

export const UsersPaths = usersRoutes.to;
