import { defineRoutes } from "@mah/client/nav";

export const mattersRoutes = defineRoutes({
  index: { path: "matters", file: "routes/matters/index.tsx" },
  new: { path: "matters/new", file: "routes/matters/new.tsx" },
  detail: { path: "matters/:matterId", file: "routes/matters/$matterId.tsx" },
});

export const MattersPaths = mattersRoutes.to;
