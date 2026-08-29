import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";
import { websiteRoutes } from "./feature/www/WebsiteConfig";
import { authRoutes } from "./feature/auth/AuthConfig";
import { chatsRoutes, messagesRoutes } from "./feature/chats/ChatsConfig";
import { corpusRoutes } from "./feature/corpus/CorpusConfig";
import { consultationsRoutes } from "./feature/consultations/ConsultationsConfig";
import { lawyersRoutes } from "./feature/lawyers/LawyersConfig";
import { mattersRoutes } from "./feature/matters/MattersConfig";
import { notificationsRoutes } from "./feature/notifications/NotificationsConfig";
import { usersRoutes } from "./feature/users/UsersConfig";
import type { RouteDefinition } from "@mah/client/nav";

export default [
  index("routes/index.tsx"),
  layout("./feature/www/layouts/website.layout.tsx", [
    ...toRouteConfig(websiteRoutes),
  ]),
  route("app", "routes/app/index.tsx"),
  ...toRouteConfig(notificationsRoutes),
  ...toRouteConfig(authRoutes),
  ...toRouteConfig(chatsRoutes),
  ...toRouteConfig(corpusRoutes),
  ...toRouteConfig(consultationsRoutes),
  ...toRouteConfig(lawyersRoutes),
  ...toRouteConfig(mattersRoutes),
  ...toRouteConfig(usersRoutes),
  ...toRouteConfig(messagesRoutes),
  layout("./feature/users/layouts/onboarding.layout.tsx", [
    route("onboarding", "routes/users/onboarding.tsx"),
    route("onboarding/lawyer", "routes/users/lawyer-onboarding.tsx"),
  ]),
  route("help", "routes/help.tsx"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;

function toRouteConfig<K extends string>(feature: RouteDefinition<K>) {
  return feature.entries.map(({ path, file }) => {
    if (path === "") {
      return index(file);
    }
    return route(path, file);
  });
}
