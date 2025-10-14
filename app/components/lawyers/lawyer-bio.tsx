import { cn } from "~/lib/utils";
import { CardWithLabel } from "~/components/ui/card-with-label";

interface LawyerBioProps {
  bio: string;
  className?: string;
}

export function LawyerBio({ bio, className = "" }: LawyerBioProps) {
  return (
    <CardWithLabel
      label="Bio"
      className={cn("prose max-w-none", className)}
      labelClassName="text-xs font-mono text-gray-500"
    >
      <p className="text-gray-700 leading-relaxed">{bio}</p>
    </CardWithLabel>
  );
}

// Example usage:
// <LawyerBio bio="Amina Okello is a distinguished criminal defense attorney with over a decade of experience..." />
