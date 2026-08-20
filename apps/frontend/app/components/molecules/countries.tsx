import { Globe2 } from "lucide-react";
import { IconContainer } from "~/components/atoms/icon-container";

const countries = [
  { name: "South Sudan", flag: "🇸🇸" },
  { name: "Uganda", flag: "🇺🇬" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "Tanzania", flag: "🇹🇿" },
  { name: "Rwanda", flag: "🇷🇼" },
  { name: "Burundi", flag: "🇧🇮" },
];

const CountryItem = ({
  country,
}: {
  country: { name: string; flag: string };
}) => (
  <button
    className="p-4 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-all text-gray-700 hover:text-gray-900"
    style={{
      boxShadow: "2px 2px 0 0 #000",
      borderRadius: "4px 8px 4px 8px",
    }}
  >
    <div className="flex flex-col items-center gap-2">
      <span className="text-4xl">{country.flag}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{country.name}</span>
      </div>
    </div>
  </button>
);

export const SupportedCountries = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-4">
        <div className="flex justify-center">
          <IconContainer icon={Globe2} color="outline" size="lg" />
        </div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Operating Across East Africa
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our legal network spans the entire East African region, providing
            seamless support for businesses operating across multiple
            jurisdictions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {countries.map((country, index) => (
            <CountryItem key={index} country={country} />
          ))}
        </div>
      </div>
    </section>
  );
};
