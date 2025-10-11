import { CardWithLabel } from '~/components/ui/card-with-label';
import { Scale } from 'lucide-react';

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
      <ul className="space-y-2">
        {laws && laws.map((law, index) => (
          <li key={index} className="text-sm">
            <span className="font-bold text-gray-900">{law.title}:</span>
            <span className="text-gray-700"> {law.description}</span>
          </li>
        ))}
      </ul>
    </CardWithLabel>
  );
};