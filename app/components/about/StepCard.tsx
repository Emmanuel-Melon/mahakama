type StepCardProps = {
  number: number;
  title: string;
  description: string;
};

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <li className="flex flex-col items-center text-center gap-3 p-6 bg-background/50 rounded-lg border hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
    </li>
  );
}
