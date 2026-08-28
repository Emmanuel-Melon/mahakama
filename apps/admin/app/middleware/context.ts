import { createContext } from "react-router";
import type { User } from "@mah/api/src/clients/auth.api";

export const userContext = createContext<User | null>(null);
export const authContext = createContext<{ token: string | null }>({
  token: null,
});
