import { useTranslation } from "react-i18next";
import {
  Clock,
  FileText,
  LayoutDashboard,
  StickyNote,
  Users,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@mah/ui/components/tabs";
import type { Matter } from "@mah/api/src/clients/matters.api";
import { MatterOverviewTab } from "./MatterOverviewTab";
import { MatterTimelineTab } from "./MatterTimelineTab";
import { MatterDocumentsTab } from "./documents/MatterDocumentsTab";
import { MatterNotesTab } from "./MatterNotesTab";
import { MatterLawyersCard } from "./lawyer/MatterLawyersCard";
import { MatterShareLawyerNudge } from "./lawyer/MatterShareLawyerNudge";
import { LawyerInvitePanel } from "./lawyer/LawyerInvitePanel";

interface MatterTabsProps {
  matter: Matter;
  role: "lawyer" | "user";
  currentUserId?: string;
}

export const MatterTabs = ({
  matter,
  role,
  currentUserId,
}: MatterTabsProps) => {
  const { t } = useTranslation("matters");

  const tabTriggers = [
    { value: "overview", label: "Overview", icon: LayoutDashboard },
    { value: "timeline", label: t("tabs.timeline"), icon: Clock },
    { value: "documents", label: t("tabs.documents"), icon: FileText },
    { value: "notes", label: t("tabs.notes"), icon: StickyNote },
    { value: "lawyers", label: t("tabs.lawyers"), icon: Users },
  ];

  return (
    <Tabs defaultValue="overview">
      <TabsList className="w-full border-b-2 border-gray-900 rounded-none bg-transparent justify-start gap-6 h-auto p-0">
        {tabTriggers.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} className="flex-none gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <MatterOverviewTab matter={matter} role={role} />
      </TabsContent>

      <TabsContent value="timeline" className="mt-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <MatterTimelineTab
            matterId={matter.id}
            role={role}
            currentUserId={currentUserId}
          />
        </div>
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <MatterDocumentsTab matterId={matter.id} />
        </div>
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <MatterNotesTab
            matterId={matter.id}
            currentUserId={currentUserId}
            role={role}
          />
        </div>
      </TabsContent>

      <TabsContent value="lawyers" className="mt-6">
        {role === "lawyer" ? (
          <LawyerInvitePanel matter={matter} />
        ) : (
          <>
            <MatterShareLawyerNudge matter={matter} />
            <MatterLawyersCard matterId={matter.id} role={role} />
          </>
        )}
      </TabsContent>
    </Tabs>
  );
};
