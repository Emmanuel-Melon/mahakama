import { StepCard } from './StepCard';

type Step = {
  number: number;
  title: string;
  description: string;
};

type StepsSectionProps = {
  title: string;
  steps: Step[];
  footerText?: string;
};

export function StepsSection({ title, steps, footerText }: StepsSectionProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
        {title}
      </h2>
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
