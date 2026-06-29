import { useNavigate } from "react-router";
import { MoreVertical, MessageSquare } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { NavLink } from "react-router";
import type { components } from "~/lib/api/generated/api.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

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
        className="bg-white p-3 sm:p-4 transition-all duration-200 border border-border hover:shadow-[0px_6px_24px_0px_hsl(var(--shadow-hover)),0px_0px_0px_1px_hsl(var(--shadow-border))] shadow-[3px_3px_0_0_hsl(var(--shadow-color))]"
        style={{
          borderRadius: "var(--border-radius-chat)",
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

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex items-center px-3 py-2 text-sm text-red-600 rounded cursor-pointer hover:bg-red-50 outline-none">
                        <span className="mr-2">🗑️</span>
                        Delete
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the chat and all its messages.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
