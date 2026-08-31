import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { type Client } from "./clients.types";

export const ClientSerializer: JsonApiResourceConfig<Client> = {
  type: "user",
  attributes: (client: Client) => client,
};
