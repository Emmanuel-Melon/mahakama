import { createMockUser, createMockUsers } from "@/feature/users/users.factory";
import { type Client } from "./clients.types";

/*
 * Clients are users (reused type). Factories simply delegate to the users
 * factories since there is no dedicated clients table.
 */

export const createMockClient = (overrides?: Partial<Client>): Client =>
  createMockUser(overrides);

export const createMockClients = (
  count: number,
  overrides?: Partial<Client>,
): Client[] => createMockUsers(count, overrides);
