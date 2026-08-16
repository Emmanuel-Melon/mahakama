import path from "path";

export function resolveAbsolutePaths<T extends string>(
  relativePaths: readonly T[],
): string[] {
  return relativePaths.map((p) => path.join(process.cwd(), p));
}
