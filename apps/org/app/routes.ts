import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";
import { authRoutes } from "./feature/auth/AuthConfig";
import { mattersRoutes } from "./feature/matters/MattersConfig";
import { teamRoutes } from "./feature/team/TeamConfig";
import { notificationsRoutes } from "./feature/notifications/NotificationsConfig";
import { settingsRoutes } from "./feature/settings/SettingsConfig";
import { billingRoutes } from "./feature/billing/BillingConfig";
import type { RouteDefinition } from "@mah/client/nav";

export default [
  index("routes/home.tsx"),
  ...toRouteConfig(mattersRoutes),
  ...toRouteConfig(teamRoutes),
  ...toRouteConfig(notificationsRoutes),
  ...toRouteConfig(settingsRoutes),
  ...toRouteConfig(billingRoutes),
  ...toRouteConfig(authRoutes),
] satisfies RouteConfig;

function toRouteConfig<K extends string>(feature: RouteDefinition<K>) {
  return feature.entries.map(({ path, file }) => {
    if (path === "") {
      return index(file);
    }
    return route(path, file);
  });
}
