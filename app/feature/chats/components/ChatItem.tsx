import { useNavigate } from "react-router";
import { MoreVertical, MessageSquare } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { NavLink } from "react-router";
import type { components } from "~/lib/api/generated/api.types";

export type Chat = components["schemas"]["Chat"];
interface ChatItemProps {
  chat: Chat;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
}
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function ChatItem({
  chat,
  onRename,
  onDelete,
}: ChatItemProps) {
  const navigate = useNavigate();
  return (
    <div className="group relative">
      <div
        className="bg-white p-3 sm:p-4 transition-all duration-200 hover:shadow-[3px_3px_0_0_#000]"
        style={{
          border: "2px solid #000",
          borderRadius: "8px 16px 8px 16px",
          boxShadow: "3px 3px 0 0 #000",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <NavLink
            to={`/chats/${chat.id}`}
            className={({ isActive }) =>
              `flex-1 min-w-0 cursor-pointer ${isActive ? 'ring-2 ring-yellow-400' : ''}`
            }
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                {chat.title || "Legal Consultation"}
              </h3>
            </div>
          </NavLink>

          <div className="flex items-center justify-between sm:items-center space-x-2 sm:space-x-3">
            <span className="text-xs text-gray-400 whitespace-nowrap font-mono">
              {formatDate(chat?.updatedAt!)}
            </span>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[180px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50"
                  align="end"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    className="flex items-center px-3 py-2 text-sm text-gray-700 rounded cursor-pointer hover:bg-gray-100 outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTitle = prompt(
                        "Enter new chat title:",
                        chat.title || "Legal Consultation",
                      );
                      if (newTitle && newTitle !== chat.title) {
                        onRename(newTitle);
                      }
                    }}
                  >
                    <span className="mr-2">✏️</span>
                    Rename
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-gray-200 m-1" />

                  <DropdownMenu.Item
                    className="flex items-center px-3 py-2 text-sm text-red-600 rounded cursor-pointer hover:bg-red-50 outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm("Are you sure you want to delete this chat?")
                      ) {
                        onDelete();
                      }
                    }}
                  >
                    <span className="mr-2">🗑️</span>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>


        <NavLink
          to={`/chats/${chat.id}`}
          className="mt-2 sm:mt-3 flex items-center text-xs text-gray-400 hover:text-primary transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
          <span>0 messages</span>
        </NavLink>
      </div>
    </div>
  );
}
