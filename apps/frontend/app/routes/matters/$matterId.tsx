import type { Route } from "./+types/$matterId";
import {
  MatterDetailScreen,
  MatterFeatureProvider,
} from "@mah/feature/matters";
import { useMatter } from "@mah/api/src/hooks/use-matters";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { MattersPaths } from "~/feature/matters/MattersConfig";
import { ChatsPaths } from "~/feature/chats/ChatsConfig";
import { MessageBubble } from "~/feature/chats/components/MessageBubble";

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

  return (
    <MatterFeatureProvider
      value={{
        paths: MattersPaths,
        chatPathResolver: (chatId) =>
          ChatsPaths.chatDetail().replace(":chatId", chatId),
        MessageComponent: MessageBubble,
      }}
    >
      <MatterDetailScreen
        matter={data?.data}
        isLoading={isLoading}
        error={error}
        role={isLawyer ? "lawyer" : "user"}
        currentUserId={user?.id}
      />
    </MatterFeatureProvider>
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
