import { CardWithLabel } from "~/components/ui/card-with-label";
import { Scale } from "lucide-react";
import { IconContainer } from "~/components/icon-container";

export interface LawItem {
  title: string;
  description: string;
}

interface RelevantLawsProps {
  laws: LawItem[];
}

export const RelevantLaws = ({ laws }: RelevantLawsProps) => {
  return (
    <CardWithLabel
      label="Relevant Laws"
      className="border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-4"
      labelClassName="text-blue-600"
    >
      <ul className="space-y-3">
        {laws &&
          laws.map((law, index) => (
            <li key={index} className="flex items-start gap-3">
              <IconContainer
                icon={Scale}
                size="sm"
                color="blue"
                className="flex-shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900">{law.title}</p>
                <p className="text-gray-700 text-sm mt-1">{law.description}</p>
              </div>
            </li>
          ))}
      </ul>
    </CardWithLabel>
  );
};
