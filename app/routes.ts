import {
  type RouteConfig,
  route,
  index,
  prefix,
  layout,
} from "@react-router/dev/routes";
import { AUTH_ROUTES } from "./feature/auth/AuthConfig";
import { LAWYERS_ROUTES } from "./feature/lawyers/LawyersConfig";
import { DOCUMENTS_ROUTES } from "./feature/documents/DocumentsConfig";
import { USERS_ROUTES } from "./feature/users/UsersConfig";
import { CHATS_ROUTES } from "./feature/chats/ChatsConfig";
import { WEBSITE_ROUTES } from "./feature/website/WebsiteConfig";

export default [
  layout(WEBSITE_ROUTES.LAYOUT, [
    index(WEBSITE_ROUTES.HOME.PATH),
    route(WEBSITE_ROUTES.ABOUT.URL_SEGMENT, WEBSITE_ROUTES.ABOUT.PATH),
    route(WEBSITE_ROUTES.CONTACT.URL_SEGMENT, WEBSITE_ROUTES.CONTACT.PATH),
  ]),
  route("app", "routes/app/index.tsx"),
  route(WEBSITE_ROUTES.LEGAL_HUB.URL_SEGMENT, WEBSITE_ROUTES.LEGAL_HUB.PATH),
  route(WEBSITE_ROUTES.SERVICE_DETAIL.URL_SEGMENT, WEBSITE_ROUTES.SERVICE_DETAIL.PATH),
  layout(AUTH_ROUTES.LAYOUT, [
    route(AUTH_ROUTES.LOGIN.URL_SEGMENT, AUTH_ROUTES.LOGIN.PATH),
    route(AUTH_ROUTES.SIGNUP.URL_SEGMENT, AUTH_ROUTES.SIGNUP.PATH),
  ]),
  ...prefix("chats", [
    route(CHATS_ROUTES.NEW.URL_SEGMENT, CHATS_ROUTES.NEW.PATH),
    route(CHATS_ROUTES.RECENTS.URL_SEGMENT, CHATS_ROUTES.RECENTS.PATH),
    route(CHATS_ROUTES.CHAT_DETAIL.URL_SEGMENT, CHATS_ROUTES.CHAT_DETAIL.PATH),
  ]),
  ...prefix(DOCUMENTS_ROUTES.INDEX.URL_SEGMENT, [
    index(DOCUMENTS_ROUTES.INDEX.PATH),
    route(DOCUMENTS_ROUTES.DETAIL.URL_SEGMENT, DOCUMENTS_ROUTES.DETAIL.PATH),
  ]),
  ...prefix(LAWYERS_ROUTES.INDEX.URL_SEGMENT, [
    index(LAWYERS_ROUTES.INDEX.PATH),
    route(LAWYERS_ROUTES.DETAIL.URL_SEGMENT, LAWYERS_ROUTES.DETAIL.PATH),
  ]),
  ...prefix("users", [
    route(USERS_ROUTES.PROFILE.URL_SEGMENT, USERS_ROUTES.PROFILE.PATH),
    route(USERS_ROUTES.SETTINGS.URL_SEGMENT, USERS_ROUTES.SETTINGS.PATH),
    route("onboarding", "routes/users/onboarding.tsx"),
  ]),
  route("help", "routes/help.tsx"),
] satisfies RouteConfig;
