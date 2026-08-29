import type { Route } from "./+types/$matterId";
import { MatterDetailScreen } from "~/feature/matters/screens/MatterDetailScreen";
import {
  useMatter,
  useMatterTimeline,
} from "@mah/api/src/hooks/use-matters";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Matter Details - Mahakama" },
    {
      name: "description",
      content: "View the details of a legal matter.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const token = context.get(authContext)?.token || null;

  return { user, token };
}

export default function MatterDetailsRoute({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { user } = loaderData;
  const { matterId } = params;
  const isLawyer = user?.role === "lawyer";

  const { data, isLoading, error } = useMatter(matterId || "");
  const { data: timeline, isLoading: timelineLoading } =
    useMatterTimeline(matterId || "");

  return (
    <MatterDetailScreen
      matter={data?.data}
      timeline={timeline}
      isLoading={isLoading || timelineLoading}
      error={error}
      role={isLawyer ? "lawyer" : "user"}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}