import {
  Plus,
  Share2,
  MoreVertical,
  Edit,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { Button } from "@mah/ui/components/Button";
import { Link } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mah/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mah/ui/components/alert-dialog";

export function ChatListHeader({ title = "Recent Chats" }: { title?: string }) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="py-3 px-4 flex items-center justify-between">
        <h1 className="text-xl font-normal text-foreground">{title}</h1>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          <Link to="/" viewTransition>
            <Plus className="h-4 w-4" />
            New Chat
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface ActiveChatHeaderProps {
  title: string;
  onDeleteChat?: () => void;
  onRenameChat?: () => void;
  onShareChat?: () => void;
  onOpenMatter?: () => void;
  isOpeningMatter?: boolean;
}

export function ActiveChatHeader({
  title,
  onDeleteChat,
  onRenameChat,
  onShareChat,
  onOpenMatter,
  isOpeningMatter,
}: ActiveChatHeaderProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { t } = useTranslation("chats");

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="py-3 px-4 flex items-center justify-between">
        <h1 className="text-xl font-normal text-foreground truncate mr-2">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenMatter}
            disabled={isOpeningMatter}
            variant="outline"
            size="sm"
            className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
          >
            <FolderOpen className="h-4 w-4" />
            {isOpeningMatter
              ? t("openMatter.header.openingMatter")
              : t("openMatter.header.openAsMatter")}
          </Button>

          <Button
            onClick={onShareChat}
            variant="outline"
            size="sm"
            className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-lg"
              align="end"
            >
              <DropdownMenuItem
                onClick={onOpenMatter}
                disabled={isOpeningMatter}
                className="cursor-pointer"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                {t("openMatter.header.menuOpenAsMatter")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onRenameChat}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDeleteChat?.();
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
