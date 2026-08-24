import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";
import { dashboardRoutes } from "./feature/dashboard/DashboardConfig";
import type { RouteDefinition } from "@mah/client/nav";

export default [
  ...toRouteConfig(dashboardRoutes),
] satisfies RouteConfig;

function toRouteConfig<K extends string>(feature: RouteDefinition<K>) {
  return feature.entries.map(({ path, file }) => {
    if (path === "") {
      return index(file);
    }
    return route(path, file);
  });
}