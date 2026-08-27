import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { TutorialStepCard, type TutorialStepConfig } from "./TutorialStepCard";

export interface TutorialLayoutProps {
  children: ReactNode;
}

export const TutorialLayout = ({ children }: TutorialLayoutProps) => (
  <div className="space-y-16 pb-20">{children}</div>
);

export interface TutorialLayoutSectionProps {
  title: string;
  description: string;
}

const Section = ({ title, description }: TutorialLayoutSectionProps) => (
  <div className="space-y-4">
    <h2 className="text-3xl font-bold tracking-tight text-foreground">
      {title}
    </h2>
    <p className="text-muted-foreground text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

export interface TutorialLayoutStepsProps {
  steps: TutorialStepConfig[];
}

const Steps = ({ steps }: TutorialLayoutStepsProps) => (
  <div className="space-y-2">
    {steps.map((step, index) => (
      <TutorialStepCard
        key={step.id}
        badge={step.badge}
        title={step.title}
        description={step.description}
        completed={step.completed}
        actions={step.actions}
        isLast={index === steps.length - 1}
        completedText={step.completedText}
        inProgressText={step.inProgressText}
      />
    ))}
  </div>
);

export interface TutorialLayoutFooterProps {
  summaryTitle?: string;
  summaryDescription: string;
}

const Footer = ({
  summaryTitle = "Summary & Overview",
  summaryDescription,
}: TutorialLayoutFooterProps) => (
  <div className="pt-8 border-t border-border/60 rounded-2xl bg-card/30 p-6 flex flex-col gap-2">
    <h4 className="text-sm font-semibold text-foreground tracking-tight">
      {summaryTitle}
    </h4>
    <p className="text-xs text-muted-foreground leading-relaxed">
      {summaryDescription}
    </p>
  </div>
);

TutorialLayout.Section = Section;
TutorialLayout.Steps = Steps;
TutorialLayout.Footer = Footer;
