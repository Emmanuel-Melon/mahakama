import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";
import type { RouteDefinition } from "./lib/nav/nav.types";
import { websiteRoutes } from "./feature/www/WebsiteConfig";
import { authRoutes } from "./feature/auth/AuthConfig";
import { chatsRoutes, messagesRoutes } from "./feature/chats/ChatsConfig";
import { documentsRoutes } from "./feature/documents/DocumentsConfig";
import { lawyersRoutes } from "./feature/lawyers/LawyersConfig";
import { notificationsRoutes } from "./feature/notifications/NotificationsConfig";
import { usersRoutes } from "./feature/users/UsersConfig";

export default [
  index("routes/index.tsx"),
  layout("./feature/website/layouts/website.layout.tsx", [
    ...toRouteConfig(websiteRoutes),
  ]),
  route("app", "routes/app/index.tsx"),
  ...toRouteConfig(notificationsRoutes),
  ...toRouteConfig(authRoutes),
  ...toRouteConfig(chatsRoutes),
  ...toRouteConfig(documentsRoutes),
  ...toRouteConfig(lawyersRoutes),
  ...toRouteConfig(usersRoutes),
  ...toRouteConfig(messagesRoutes),
  route("onboarding", "routes/users/onboarding.tsx"),
  route("help", "routes/help.tsx"),
] satisfies RouteConfig;

function toRouteConfig<K extends string>(feature: RouteDefinition<K>) {
  return feature.entries.map(({ path, file }) => {
    if (path === "") {
      return index(file);
    }
    return route(path, file);
  });
}
