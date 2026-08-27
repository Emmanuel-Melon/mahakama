import { useState } from "react";
import { Info } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../../Button";

export interface TutorialInfoData {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

interface TutorialInfoCardProps {
  info: TutorialInfoData;
}

export const TutorialInfoCard = ({ info }: TutorialInfoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="p-6 rounded-2xl border border-border/60 bg-card/50 max-w-sm space-y-4 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{info.title}</h3>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {info.description}
      </p>

      {info.actionLabel && info.actionHref && (
        <div
          className={`pt-2 transition-all duration-300 ${
            isHovered
              ? "opacity-100 max-h-12"
              : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link to={info.actionHref}>{info.actionLabel}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
