import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("lawyers", "routes/lawyers.tsx"),
    route("about", "routes/about.tsx"),
    route("legal-database", "routes/legal-database.tsx"),
] satisfies RouteConfig;
