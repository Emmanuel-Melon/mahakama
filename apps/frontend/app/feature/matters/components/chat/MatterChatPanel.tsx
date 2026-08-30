import { useState } from "react";
import { MatterChatDesktop } from "./MatterChatDesktop";
import { MatterChatMobile } from "./MatterChatMobile";

export function MatterChatPanel({ chatId }: { chatId: string | null }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!chatId) return null;

  return (
    <>
      <MatterChatDesktop
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        chatId={chatId}
      />
      <MatterChatMobile chatId={chatId} />
    </>
  );
}
