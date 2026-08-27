import { type LucideIcon, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { TimelineNode } from "./TimelineNode";
import { Button } from "../../Button";

export interface StepCardAction {
  icon: LucideIcon;
  label: string;
  completedLabel?: string;
  href: string;
}

export interface TutorialStepAction {
  icon: LucideIcon;
  label: string;
  completedLabel?: string;
  href: string;
}

export interface TutorialStepConfig {
  id: string;
  badge: string;
  title: string;
  description: string;
  completed: boolean;
  actions: TutorialStepAction[];
  completedText?: string;
  inProgressText?: string;
}

interface TutorialStepCardProps {
  badge: string;
  title: string;
  description: string;
  completed?: boolean;
  actions: StepCardAction[];
  isLast?: boolean;
  completedText?: string;
  inProgressText?: string;
}

export const TutorialStepCard = ({
  badge,
  title,
  description,
  completed,
  actions,
  isLast = false,
  completedText = "Completed",
  inProgressText = "In Progress",
}: TutorialStepCardProps) => (
  <div className="flex items-start">
    <TimelineNode completed={completed} isLast={isLast} />

    <div className="flex-1 p-6 rounded-2xl border border-border/60 bg-card/50 space-y-6 mb-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest text-primary">
            {badge}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
              completed
                ? "text-primary bg-primary/10"
                : "text-muted-foreground bg-muted"
            }`}
          >
            {completed && <CheckCircle2 className="w-3 h-3" />}
            {completed ? completedText : inProgressText}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {actions.map(({ icon: Icon, label, completedLabel, href }) => (
          <Button
            key={href}
            asChild
            variant={completed ? "default" : "outline"}
            className="flex items-center justify-center gap-2"
          >
            <Link to={href}>
              <Icon className="w-4 h-4" />
              <span>
                {completed && completedLabel ? completedLabel : label}
              </span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  </div>
);
