import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

interface ChatHeaderProps {
  title?: string
}

export function ChatHeader({
  title = "Recent Chats",
}: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between py-3 px-4 border-b">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
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
  );
}
