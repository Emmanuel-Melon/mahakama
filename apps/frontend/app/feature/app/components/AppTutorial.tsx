import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  Briefcase,
  FileSearch,
  Library,
  MapPin,
  MessagesSquare,
} from "lucide-react";
import { useUser } from "~/context/user-provider";
import { ChatsPaths } from "~/feature/chats/ChatsConfig";
import { CorpusPaths } from "~/feature/corpus/CorpusConfig";
import { ConsultationsPaths } from "~/feature/consultations/ConsultationsConfig";
import { WebsitePaths } from "~/feature/www/WebsiteConfig";
import {
  type TutorialStepConfig,
  TutorialLayout,
  TutorialHeader,
} from "@mah/ui";

type TutorialRole = "user" | "lawyer";

const buildUserSteps = (
  t: TFunction<"app", undefined>,
): TutorialStepConfig[] => [
  {
    id: "assistant",
    badge: t("tutorial.user.steps.assistant.badge"),
    title: t("tutorial.user.steps.assistant.title"),
    description: t("tutorial.user.steps.assistant.description"),
    completed: false,
    completedText: t("tutorial.status.completed"),
    inProgressText: t("tutorial.status.inProgress"),
    actions: [
      {
        icon: MessagesSquare,
        label: t("tutorial.user.steps.assistant.ctaLabel"),
        href: ChatsPaths.new(),
      },
    ],
  },
  {
    id: "upload-documents",
    badge: t("tutorial.user.steps.uploadDocuments.badge"),
    title: t("tutorial.user.steps.uploadDocuments.title"),
    description: t("tutorial.user.steps.uploadDocuments.description"),
    completed: false,
    completedText: t("tutorial.status.completed"),
    inProgressText: t("tutorial.status.inProgress"),
    actions: [
      {
        icon: FileSearch,
        label: t("tutorial.user.steps.uploadDocuments.ctaLabel"),
        href: ChatsPaths.new(),
      },
    ],
  },
  {
    id: "explore-resources",
    badge: t("tutorial.user.steps.exploreResources.badge"),
    title: t("tutorial.user.steps.exploreResources.title"),
    description: t("tutorial.user.steps.exploreResources.description"),
    completed: false,
    completedText: t("tutorial.status.completed"),
    inProgressText: t("tutorial.status.inProgress"),
    actions: [
      {
        icon: Library,
        label: t("tutorial.user.steps.exploreResources.ctaDocsLabel"),
        href: CorpusPaths.index(),
      },
      {
        icon: MapPin,
        label: t("tutorial.user.steps.exploreResources.ctaServicesLabel"),
        href: WebsitePaths.legalHub(),
      },
    ],
  },
];

const buildLawyerSteps = (
  t: TFunction<"app", undefined>,
): TutorialStepConfig[] => [
  {
    id: "client-chats",
    badge: t("tutorial.lawyer.steps.clientChats.badge"),
    title: t("tutorial.lawyer.steps.clientChats.title"),
    description: t("tutorial.lawyer.steps.clientChats.description"),
    completed: false,
    completedText: t("tutorial.status.completed"),
    inProgressText: t("tutorial.status.inProgress"),
    actions: [
      {
        icon: MessagesSquare,
        label: t("tutorial.lawyer.steps.clientChats.ctaLabel"),
        href: ChatsPaths.recents(),
      },
    ],
  },
  {
    id: "consultations",
    badge: t("tutorial.lawyer.steps.consultations.badge"),
    title: t("tutorial.lawyer.steps.consultations.title"),
    description: t("tutorial.lawyer.steps.consultations.description"),
    completed: false,
    completedText: t("tutorial.status.completed"),
    inProgressText: t("tutorial.status.inProgress"),
    actions: [
      {
        icon: Briefcase,
        label: t("tutorial.lawyer.steps.consultations.ctaLabel"),
        href: ConsultationsPaths.index(),
      },
    ],
  },
  {
    id: "research",
    badge: t("tutorial.lawyer.steps.research.badge"),
    title: t("tutorial.lawyer.steps.research.title"),
    description: t("tutorial.lawyer.steps.research.description"),
    completed: false,
    completedText: t("tutorial.status.completed"),
    inProgressText: t("tutorial.status.inProgress"),
    actions: [
      {
        icon: Library,
        label: t("tutorial.lawyer.steps.research.ctaLabel"),
        href: CorpusPaths.index(),
      },
    ],
  },
];

export const AppTutorial = () => {
  const { t } = useTranslation("app");
  const { user } = useUser();

  const role: TutorialRole = user?.role === "lawyer" ? "lawyer" : "user";

  const steps = role === "lawyer" ? buildLawyerSteps(t) : buildUserSteps(t);

  const completedCount = steps.filter((step) => step.completed).length;
  const isComplete = completedCount === steps.length;

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <TutorialLayout>
        <TutorialHeader
          steps={steps.map(({ id, completed }) => ({ id, completed }))}
          userName={user?.name ?? undefined}
          title={t("tutorial.header.title")}
          highlightedTitle={t("tutorial.header.highlightedTitle")}
          description={t(`tutorial.${role}.description`)}
          welcomeLabel={t("tutorial.header.welcome")}
          progressText={
            isComplete
              ? t("tutorial.header.progressComplete")
              : t("tutorial.header.progress", {
                  done: completedCount,
                  total: steps.length,
                })
          }
          infoCard={{
            title: t(`tutorial.${role}.infoCard.title`),
            description: t(`tutorial.${role}.infoCard.description`),
            actionLabel: t(`tutorial.${role}.infoCard.actionLabel`),
            actionHref: WebsitePaths.legalHub(),
          }}
        />
        <TutorialLayout.Section
          title={t("tutorial.section.title")}
          description={t("tutorial.section.description")}
        />
        <TutorialLayout.Steps steps={steps} />
        <TutorialLayout.Footer
          summaryTitle={t("tutorial.footer.summaryTitle")}
          summaryDescription={t("tutorial.footer.summaryDescription")}
        />
      </TutorialLayout>
    </div>
  );
};
