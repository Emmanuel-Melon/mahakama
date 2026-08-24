import { createContext } from "react-router";
import type { AccessPayload } from "@mah/api/src/clients/auth.api";

export const authPayloadContext = createContext<AccessPayload | null>(null);

export const authContext = createContext<{ token: string | null }>({
  token: null,
});
