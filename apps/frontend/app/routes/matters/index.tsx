import type { Route } from "./+types/index";
import { MattersScreen, MatterFeatureProvider } from "@mah/feature/matters";
import { useMatters } from "@mah/api/src/hooks/use-matters";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { MattersPaths } from "~/feature/matters/MattersConfig";
import { ChatsPaths } from "~/feature/chats/ChatsConfig";
import { MessageBubble } from "~/feature/chats/components/MessageBubble";

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
    <MatterFeatureProvider
      value={{
        paths: MattersPaths,
        chatPathResolver: (chatId) =>
          ChatsPaths.chatDetail().replace(":chatId", chatId),
        MessageComponent: MessageBubble,
      }}
    >
      <MattersScreen
        matters={matters}
        isLoading={isLoading}
        error={error}
        role={isLawyer ? "lawyer" : "user"}
      />
    </MatterFeatureProvider>
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
