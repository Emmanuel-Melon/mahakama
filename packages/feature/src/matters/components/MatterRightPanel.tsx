import { useState } from "react";
import { Maximize2, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
} from "@mah/ui/components/drawer";
import { MatterChatConversation } from "./chat/MatterChatConversation";
import { MatterThreadsConversation } from "./threads/MatterThreadsConversation";

type RightPanelTab = "chat" | "threads";

interface MatterRightPanelProps {
  chatId: string | null;
  threadId: string | null;
}

export function MatterRightPanel({ chatId, threadId }: MatterRightPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<RightPanelTab>("chat");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!chatId && !threadId) return null;

  return (
    <>
      {/* Desktop Panel */}
      {collapsed ? (
        <div className="hidden lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)] flex-col border-l-2 border-gray-900 bg-white">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand panel"
            className="flex flex-col items-center gap-3 py-5 px-3 hover:bg-gray-50"
          >
            <Maximize2 className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-bold text-gray-700 [writing-mode:vertical-rl] rotate-180">
              Panel
            </span>
          </button>
        </div>
      ) : (
        <aside className="hidden lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)] flex-col border-l-2 border-gray-900 bg-white w-[360px]">
          <header className="flex flex-col border-b-2 border-gray-900 bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("chat")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                      activeTab === "chat"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("threads")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                      activeTab === "threads"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Threads
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Close panel"
                className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "chat" && chatId && (
              <MatterChatConversation chatId={chatId} />
            )}
            {activeTab === "threads" && threadId && (
              <MatterThreadsConversation threadId={threadId} />
            )}
          </div>
        </aside>
      )}

      {/* Mobile Drawer & Trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-lg border-2 border-black bg-yellow-300 px-3 py-2 text-xs font-bold text-gray-900 shadow-[3px_3px_0_0_#000] hover:bg-yellow-400 lg:hidden"
      >
        Panel
      </button>

      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    activeTab === "chat"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Chat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("threads")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    activeTab === "threads"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Threads
                </button>
              </div>
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Close drawer"
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="overflow-y-auto pb-8">
            {activeTab === "chat" && chatId && (
              <MatterChatConversation chatId={chatId} />
            )}
            {activeTab === "threads" && threadId && (
              <MatterThreadsConversation threadId={threadId} />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
