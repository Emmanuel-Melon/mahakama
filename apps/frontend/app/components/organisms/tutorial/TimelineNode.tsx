import { CheckCircle2 } from "lucide-react";

interface TimelineNodeProps {
  completed?: boolean;
  active?: boolean;
  isLast?: boolean;
}

export const TimelineNode = ({
  completed,
  active,
  isLast,
}: TimelineNodeProps) => (
  <div className="flex flex-col items-center mr-6">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
        completed
          ? "bg-primary/10 border-primary text-primary"
          : active
            ? "bg-primary border-primary text-white"
            : "bg-card border-border/80 text-muted-foreground"
      }`}
    >
      {completed ? (
        <CheckCircle2 className="w-5 h-5 text-primary" />
      ) : active ? (
        <div className="w-3 h-3 rounded-full bg-white" />
      ) : (
        <div className="w-3 h-3 rounded-full bg-border" />
      )}
    </div>
    {!isLast && <div className="w-0.5 flex-1 bg-border/60 my-2 min-h-[40px]" />}
  </div>
);
