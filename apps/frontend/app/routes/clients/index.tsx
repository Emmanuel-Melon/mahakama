import type { Route } from "./+types/index";
import { ClientsScreen } from "~/feature/clients/screens/ClientsScreen";
import { useClients } from "@mah/api/src/hooks/use-clients";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clients" },
    {
      name: "description",
      content: "View the clients who have matters with you.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const token = context.get(authContext)?.token || null;

  return { user, token };
}

export default function ClientsIndex({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  const isLawyer = user?.role === "lawyer";

  const { data: clientsPage, isLoading, error } = useClients(
    isLawyer && user ? { lawyerUserId: user.id } : undefined,
  );

  return (
    <ClientsScreen
      clients={clientsPage?.data ?? []}
      isLoading={isLoading}
      error={error}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
