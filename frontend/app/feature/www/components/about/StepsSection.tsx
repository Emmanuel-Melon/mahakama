import { StepCard } from "./StepCard";
import { IconContainer } from "~/components/icon-container";

type Step = {
  number: number;
  title: string;
  description: string;
};

type StepsSectionProps = {
  title: string;
  steps: Step[];
  footerText?: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
};

export function StepsSection({
  title,
  steps,
  footerText,
  icon: Icon,
  description,
}: StepsSectionProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {Icon && (
          <IconContainer
            icon={Icon}
            size="lg"
            color="handdrawn"
            className="mb-2"
          />
        )}
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {description}
          </p>
        )}
      </div>
      <ul className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <StepCard
            key={step.number}
            number={step.number}
            title={step.title}
            description={step.description}
          />
        ))}
      </ul>
      {footerText && (
        <p className="text-center text-muted-foreground text-sm mt-6">
          {footerText}
        </p>
      )}
    </div>
  );
}
