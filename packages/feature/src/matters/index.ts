export {
  MatterFeatureProvider,
  useMatterFeature,
} from "./MatterFeatureContext";
export type {
  MatterFeatureContextValue,
  MatterPaths,
} from "./MatterFeatureContext";
export { useDebouncedValue } from "./utils";

export { MattersScreen } from "./screens/MattersScreen";
export { MatterDetailScreen } from "./screens/MatterDetailScreen";
export { MatterDocumentScreen } from "./screens/MatterDocumentScreen";

export { MattersList } from "./components/MattersList";
export { UserMatterCard } from "./components/UserMatterCard";
export { MatterHeader } from "./components/MatterHeader";
export { MatterStatusSelect } from "./components/MatterStatusSelect";
export { MatterTabs } from "./components/MatterTabs";
export { MatterOverviewTab } from "./components/MatterOverviewTab";
export { MatterSummaryCard } from "./components/MatterSummaryCard";
export { MatterTimelineTab } from "./components/MatterTimelineTab";
export { MatterNotesTab } from "./components/MatterNotesTab";
export { MatterRightPanel } from "./components/MatterRightPanel";
export { MatterPreparingSheet } from "./components/MatterPreparingSheet";
export { OpenMatterDialog } from "./components/OpenMatterDialog";
export type { OpenMatterFormValues } from "./components/OpenMatterDialog";
export { getMetadataRecord, isMatterPrepared } from "./components/matter-utils";

export { DocumentAnalysisSection } from "./components/analysis/DocumentAnalysisSection";
export { MatterChatConversation } from "./components/chat/MatterChatConversation";
export { MatterChatDesktop } from "./components/chat/MatterChatDesktop";
export { MatterChatMobile } from "./components/chat/MatterChatMobile";
export { MatterChatPanel } from "./components/chat/MatterChatPanel";
export { EraDivider } from "./components/chat/EraDivider";
export {
  SUBSTANTIVE_MIN_LENGTH,
  isSubstantiveAssistantMessage,
} from "./components/chat/chat.utils";
export { MatterThreadsConversation } from "./components/threads/MatterThreadsConversation";
export { DocumentRow } from "./components/documents/DocumentRow";
export { MatterDocumentsTab } from "./components/documents/MatterDocumentsTab";
export { formatDate, formatSize } from "./components/documents/documents.utils";
export { InviteLawyerDialog } from "./components/lawyer/InviteLawyerDialog";
export { LawyerInvitePanel } from "./components/lawyer/LawyerInvitePanel";
export { LawyerMatterCard } from "./components/lawyer/LawyerMatterCard";
export { MatterLawyersCard } from "./components/lawyer/MatterLawyersCard";
export { MatterShareLawyerNudge } from "./components/lawyer/MatterShareLawyerNudge";
