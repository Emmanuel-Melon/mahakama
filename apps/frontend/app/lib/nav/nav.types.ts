import { type LucideIcon } from "lucide-react";

export interface NavLinkItem {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number | string;
}

export type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string | number } & ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: string | number }
      : {};

export type IsEmptyObject<T> = keyof T extends never ? true : false;

export type RouteDefinition<
  K extends string,
  Map extends Record<K, { path: string; file: string }> = Record<
    K,
    { path: string; file: string }
  >,
> = {
  routes: { [Key in K]: Map[Key]["path"] };
  paths: { [Key in K]: `/${Map[Key]["path"]}` };
  to: {
    [Key in K]: IsEmptyObject<
      ExtractParams<Map[Key]["path"] & string>
    > extends true
      ? () => string
      : (params: ExtractParams<Map[Key]["path"] & string>) => string;
  };
  entries: readonly { path: string; file: string }[];
};
