import { Plus, Share2, MoreVertical, Edit, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { SearchBar } from "~/components/search-bar"
import { Link } from "react-router"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
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
} from "~/components/ui/alert-dialog"

type ChatHeaderVariant = "list" | "chat"

interface ChatHeaderProps {
  title?: string
  variant?: ChatHeaderVariant
  chatId?: string
  onDeleteChat?: () => void
  onRenameChat?: () => void
  onShareChat?: () => void
}

export function ChatHeader({
  title = "Recent Chats",
  variant = "list",
  chatId,
  onDeleteChat,
  onRenameChat,
  onShareChat,
}: ChatHeaderProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  if (variant === "list") {
    return (
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="py-3 px-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-normal text-foreground">{title}</h1>
            <Button 
              asChild
              variant="outline"
              size="sm"
              className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-gray-900"
            >
              <Link to="/" viewTransition>
                <Plus className="h-4 w-4" />
                New Chat
              </Link>
            </Button>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search chats..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="py-3 px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-normal text-foreground">{title}</h1>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search..."
            />
            <Button
              onClick={onShareChat}
              variant="outline"
              size="sm"
              className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-gray-900"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-gray-900"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                className="w-40 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-lg"
                align="end"
              >
                <DropdownMenuItem 
                  onClick={onRenameChat}
                  className="text-gray-900 hover:bg-yellow-50 cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 hover:bg-yellow-50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
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
  )
}
