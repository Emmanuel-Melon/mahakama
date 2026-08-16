import { User, Bookmark } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

interface ProfileTabsProps {
  activeTab: "personal" | "account";
  onTabChange: (tab: "personal" | "account") => void;
  children: React.ReactNode;
}

export const ProfileTabs = ({
  activeTab,
  onTabChange,
  children,
}: ProfileTabsProps) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as "personal" | "account")}
      className="w-full"
    >
      <TabsList className="bg-transparent border-b-2 border-gray-900 rounded-none h-auto p-0 gap-0">
        <TabsTrigger
          value="personal"
          className="pb-3 text-sm font-bold transition-colors px-4 py-2 -mb-px flex items-center gap-2 rounded-t-lg data-[state=active]:border-2 data-[state=active]:border-gray-900 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900 data-[state=active]:border-b-0 data-[state=active]:shadow-[-2px_-2px_0_0_#000] border-r-0"
          style={{
            borderRadius: "8px 8px 0 0",
          }}
        >
          <User className="w-4 h-4" />
          Personal Information
        </TabsTrigger>
        <TabsTrigger
          value="account"
          className="pb-3 text-sm font-bold transition-colors px-4 py-2 -mb-px flex items-center gap-2 rounded-t-lg data-[state=active]:border-2 data-[state=active]:border-gray-900 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900 data-[state=active]:border-b-0 data-[state=active]:shadow-[-2px_-2px_0_0_#000]"
          style={{
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Bookmark className="w-4 h-4" />
          Saved Items
        </TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="mt-0">
        {children}
      </TabsContent>
      <TabsContent value="account" className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
};
