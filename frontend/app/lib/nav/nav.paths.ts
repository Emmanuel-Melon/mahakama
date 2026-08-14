import type { RouteDefinition } from "./nav.types";

export function createPath(
  path: string,
  params: Record<string, string | number> = {},
): string {
  let renderedPath = path.startsWith("/") ? path : `/${path}`;
  Object.entries(params).forEach(([key, value]) => {
    renderedPath = renderedPath.replace(`:${key}`, String(value));
  });
  return renderedPath;
}

export function defineRoutes<
  T extends Record<string, { path: string; file: string }>,
>(map: T): RouteDefinition<keyof T & string, T> {
  const keys = Object.keys(map) as (keyof T & string)[];

  const routes = {} as RouteDefinition<keyof T & string, T>["routes"];
  const paths = {} as RouteDefinition<keyof T & string, T>["paths"];
  const to = {} as RouteDefinition<keyof T & string, T>["to"];

  keys.forEach((k) => {
    const routePath = map[k].path;
    routes[k] = routePath as any;
    paths[k] = `/${routePath}` as any;
    to[k] = ((params?: Record<string, string | number>) =>
      createPath(routePath, params)) as any;
  });

  const entries = keys.map((k) => ({
    path: map[k].path,
    file: map[k].file,
  }));

  return { routes, paths, entries, to };
}
