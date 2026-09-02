import { defineRoutes } from "@mah/client/nav";

export const teamRoutes = defineRoutes({
  index: { path: "team", file: "routes/team/index.tsx" },
  member: { path: "team/:memberId", file: "routes/team/$memberId.tsx" },
});

export const TeamPaths = teamRoutes.to;
