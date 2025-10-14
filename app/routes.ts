import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("lawyers", "routes/lawyers.tsx"),
  route("about", "routes/about.tsx"),
  route("legal-database", "routes/legal-database.tsx"),
  route("lawyers/:lawyerId", "routes/lawyer.profile.tsx"),
  route("document/:documentId", "routes/document.details.tsx"),
  route("chat/:chatId", "routes/chat.tsx"),
  route("recents", "routes/recents.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("chat/new", "routes/chat.new.tsx"),
] satisfies RouteConfig;
