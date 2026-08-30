import type { Route } from "./+types/index";
import { MattersScreen } from "~/feature/matters/screens/MattersScreen";
import { useMatters } from "@mah/api/src/hooks/use-matters";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Matters" },
    {
      name: "description",
      content: "View and track your legal matters.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const token = context.get(authContext)?.token || null;

  return { user, token };
}

export default function MattersIndex({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const isLawyer = user?.role === "lawyer";

  const {
    data: mattersPage,
    isLoading,
    error,
  } = useMatters(
    isLawyer ? { lawyerUserId: user?.id } : { clientUserId: user?.id },
  );

  const matters = mattersPage?.data ?? [];

  return (
    <MattersScreen
      matters={matters}
      isLoading={isLoading}
      error={error}
      role={isLawyer ? "lawyer" : "user"}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
