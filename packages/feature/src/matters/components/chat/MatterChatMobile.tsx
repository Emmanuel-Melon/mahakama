import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquareText, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@mah/ui/components/drawer";
import { MatterChatConversation } from "./MatterChatConversation";

export function MatterChatMobile({ chatId }: { chatId: string }) {
  const { t } = useTranslation("matters");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-lg border-2 border-black bg-yellow-300 px-3 py-2 text-xs font-bold text-gray-900 shadow-[3px_3px_0_0_#000] hover:bg-yellow-400 lg:hidden"
      >
        <MessageSquareText className="h-4 w-4" />
        {t("chat.title")}
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DrawerTitle>{t("chat.title")}</DrawerTitle>
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label={t("chat.close")}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="overflow-y-auto pb-8">
            <MatterChatConversation chatId={chatId} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
