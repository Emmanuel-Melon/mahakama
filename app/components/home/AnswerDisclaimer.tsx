import { CardWithLabel } from "~/components/ui/card-with-label";

export const AnswerDisclaimer = () => {
  return (
    <CardWithLabel 
      label="Legal Notice"
      className="border-yellow-400 bg-yellow-50 p-4 rounded-none border-l-4"
      labelClassName="text-yellow-600"
    >
      <p className="text-xs text-gray-600 leading-relaxed">
        <strong className="text-gray-900">Disclaimer:</strong> This information is for educational purposes only
        and does not constitute legal advice. For specific legal guidance, please consult with a qualified lawyer
        in your jurisdiction.
      </p>
    </CardWithLabel>
  );
};