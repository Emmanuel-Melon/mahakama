import { useTranslation } from "react-i18next";
import { FileSearch, Library, MapPin, MessagesSquare } from "lucide-react";
import { TutorialHeader } from "~/components/organisms/tutorial/TutorialHeader";
import { TutorialLayout } from "~/components/organisms/tutorial/TutorialLayout";
import { useUser } from "~/context/user-provider";
import { ChatsPaths } from "~/feature/chats/ChatsConfig";
import { CorpusPaths } from "~/feature/corpus/CorpusConfig";
import { WebsitePaths } from "~/feature/www/WebsiteConfig";
import type { TutorialStepConfig } from "~/components/organisms/tutorial/TutorialStepCard";

export const AppTutorial = () => {
  const { t } = useTranslation("app");
  const { user } = useUser();

  const statusLabels = {
    completedText: t("tutorial.status.completed"),
    inProgressText: t("tutorial.status.inProgress"),
  };

  const steps: TutorialStepConfig[] = [
    {
      id: "assistant",
      badge: t("tutorial.steps.assistant.badge"),
      title: t("tutorial.steps.assistant.title"),
      description: t("tutorial.steps.assistant.description"),
      completed: false,
      actions: [
        {
          icon: MessagesSquare,
          label: t("tutorial.steps.assistant.ctaLabel"),
          href: ChatsPaths.new(),
        },
      ],
      ...statusLabels,
    },
    {
      id: "upload-documents",
      badge: t("tutorial.steps.uploadDocuments.badge"),
      title: t("tutorial.steps.uploadDocuments.title"),
      description: t("tutorial.steps.uploadDocuments.description"),
      completed: false,
      actions: [
        {
          icon: FileSearch,
          label: t("tutorial.steps.uploadDocuments.ctaLabel"),
          href: ChatsPaths.new(),
        },
      ],
      ...statusLabels,
    },
    {
      id: "explore-resources",
      badge: t("tutorial.steps.exploreResources.badge"),
      title: t("tutorial.steps.exploreResources.title"),
      description: t("tutorial.steps.exploreResources.description"),
      completed: false,
      actions: [
        {
          icon: Library,
          label: t("tutorial.steps.exploreResources.ctaDocsLabel"),
          href: CorpusPaths.index(),
        },
        {
          icon: MapPin,
          label: t("tutorial.steps.exploreResources.ctaServicesLabel"),
          href: WebsitePaths.legalHub(),
        },
      ],
      ...statusLabels,
    },
  ];

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
          description={t("tutorial.header.description")}
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
            title: t("tutorial.header.infoCard.title"),
            description: t("tutorial.header.infoCard.description"),
            actionLabel: t("tutorial.header.infoCard.actionLabel"),
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
