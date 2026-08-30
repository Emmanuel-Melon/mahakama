import type { Route } from "./+types/$matterId.documents.$documentId";
import { MatterDocumentScreen } from "~/feature/matters/screens/MatterDocumentScreen";
import { useMatter } from "@mah/api/src/hooks/use-matters";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Document - Mahakama" },
    {
      name: "description",
      content: "View a matter document.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const token = context.get(authContext)?.token || null;

  return { user, token };
}

export default function MatterDocumentRoute({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { user } = loaderData;
  const { matterId, documentId } = params;
  const isLawyer = user?.role === "lawyer";

  const { data, isLoading, error } = useMatter(matterId || "");

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="aspect-[4/3] bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load matter
          </h2>
          <p className="text-gray-500">
            {error.errors?.[0]?.detail ?? "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <MatterDocumentScreen
      matterId={matterId || ""}
      documentId={documentId || ""}
      role={isLawyer ? "lawyer" : "user"}
      currentUserId={user?.id}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
