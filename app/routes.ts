import {
  type RouteConfig,
  route,
  index,
  prefix,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./website/website.layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
  route("app", "routes/app/index.tsx"),
  route("onboarding", "routes/onboarding/index.tsx"),
  layout("./auth/auth.layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("signup", "routes/auth/signup.tsx"),
  ]),
  ...prefix("chats", [
    route("new", "routes/chats/chats.new.tsx"),
    route("recents", "routes/chats/chats.recents.tsx"),
    route(":chatId", "routes/chats/chats.$chatId.tsx"),
  ]),
  // ...prefix("documents", [
  //   index("routes/documents/index.tsx"),
  //   route(":documentId", "routes/documents/documents.$documentId.tsx"),
  // ]),
  // ...prefix("lawyers", [
  //   index("routes/lawyers/index.tsx"),
  //   route(":lawyerId", "routes/lawyers/lawyers.$lawyerId.tsx"),
  // ]),
  layout("./search/search.layout.tsx", [

    route("lawyers", "routes/lawyers/index.tsx"),
    route("documents", "routes/documents/index.tsx"),
  ]),
  ...prefix("users", [
    route(":profile", "routes/users/$profile.tsx"),
    route("settings", "routes/users/settings.tsx"),
  ]),
  route("legal-hub", "routes/legal-hub.tsx"),
] satisfies RouteConfig;
