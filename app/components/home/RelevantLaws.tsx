import { CardWithLabel } from '~/components/ui/card-with-label';
import { Scale } from 'lucide-react';

interface LawItem {
  title: string;
  description: string;
}

const laws: LawItem[] = [
  {
    title: 'Residential Tenancies Act, Section 12',
    description: 'Security deposit return requirements',
  },
  {
    title: 'Housing Code, Article 45',
    description: 'Landlord obligations and tenant rights',
  },
  {
    title: 'Consumer Protection Law, Chapter 8',
    description: 'Dispute resolution procedures',
  },
];

export const RelevantLaws = () => {
  return (
    <CardWithLabel
      label="Relevant Laws"
      className="border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-4"
      labelClassName="text-blue-600"
    >
      <ul className="space-y-2">
        {laws.map((law, index) => (
          <li key={index} className="text-sm">
            <span className="font-bold text-gray-900">{law.title}:</span>
            <span className="text-gray-700"> {law.description}</span>
          </li>
        ))}
      </ul>
    </CardWithLabel>
  );
};