import type { Route } from "./+types/$matterId.documents.$documentId";
import {
  MatterDocumentScreen,
  MatterFeatureProvider,
} from "@mah/feature/matters";
import { useMatter } from "@mah/api/src/hooks/use-matters";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import appConfig from "~/config";
import { MattersPaths } from "~/feature/matters/MattersConfig";
import { ChatsPaths } from "~/feature/chats/ChatsConfig";
import { MessageBubble } from "~/feature/chats/components/MessageBubble";

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
      <div className="w-full px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="aspect-[4/3] bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-6">
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
    <MatterFeatureProvider
      value={{
        paths: MattersPaths,
        chatPathResolver: (chatId) =>
          ChatsPaths.chatDetail().replace(":chatId", chatId),
        MessageComponent: MessageBubble,
      }}
    >
      <MatterDocumentScreen
        matterId={matterId || ""}
        documentId={documentId || ""}
        role={isLawyer ? "lawyer" : "user"}
        currentUserId={user?.id}
        apiBaseURL={appConfig.api.baseURL}
      />
    </MatterFeatureProvider>
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
