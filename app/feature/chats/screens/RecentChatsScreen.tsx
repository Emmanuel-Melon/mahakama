import type { components } from "~/lib/api/generated/api.types";
import { PageLayout } from "~/layouts/page-layout";
import { ChatHeader } from "../components/ChatHeader";
import { ChatList } from "../components/ChatList";
export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse = components["schemas"]["ChatsCollectionResponse"];
export type ChatMessage = components["schemas"]["Message"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];


export const RecentChatsScreen = ({ chats, error }: { chats: Chat[], error: any }) => {

  return (
    <PageLayout>
        <div className="space-y-4">
          <ChatHeader />
          <ChatList
            chats={chats}
            error={error}
            onRename={() => { }}
            onDelete={() => { }}
          />
        </div>
    </PageLayout>
  );
}
