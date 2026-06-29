import { createContext } from "react-router";
import type { components } from "~/lib/api/generated/api.types";
type User = components["schemas"]["User"];
export const userContext = createContext<User | null>(null);
export const authContext = createContext<{ token: string | null }>({ token: null });