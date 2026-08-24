import { Button } from "~/components/ui/button";
import { TutorialInfoCard, type TutorialInfoData } from "./TutorialInfoCard";

export interface TutorialStepStatus {
  id: string;
  completed: boolean;
}

interface TutorialHeaderProps {
  title?: string;
  highlightedTitle?: string;
  description?: string;
  userName?: string | null;
  welcomeLabel?: string;
  progressText?: string;
  steps: TutorialStepStatus[];
  infoCard?: TutorialInfoData;
}

export const TutorialHeader = ({
  title = "Your Gifting",
  highlightedTitle = "Journey",
  description = "Follow the guided occasion-based path below, or skip straight to direct gifting at any time.",
  userName = "Guest",
  welcomeLabel = "Welcome,",
  progressText,
  steps,
  infoCard,
}: TutorialHeaderProps) => {
  const completedCount = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const isComplete = completedCount === totalSteps;

  return (
    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
      <div className="space-y-5 w-full max-w-2xl">
        <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-muted-foreground">
          {welcomeLabel} {userName}
        </div>

        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-2">
          {title} <br />
          <span className="text-primary">{highlightedTitle}</span>
        </h1>

        <p className="text-sm text-muted-foreground font-normal max-w-xl leading-relaxed">
          {description}
        </p>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={step.id || index}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    step.completed ? "w-8 bg-primary" : "w-3 bg-border/80"
                  }`}
                  title={`Step ${index + 1}: ${step.completed ? "Completed" : "In Progress"}`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {progressText ??
                (isComplete
                  ? "All Steps Completed"
                  : `Step ${completedCount} of ${totalSteps} Completed`)}
            </span>
          </div>
        </div>
      </div>

      {infoCard && <TutorialInfoCard info={infoCard} />}
    </header>
  );
};