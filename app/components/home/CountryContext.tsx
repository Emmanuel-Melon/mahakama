import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { Country } from "../header";
import { BorderedBox } from "../ui/bordered-box";

const countries: Country[] = [
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
];

interface CountryContextProps {
  country: Country;
  onCountryChange: (country: Country) => void;
}

export function CountryContext({ country, onCountryChange }: CountryContextProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <BorderedBox 
        className="mb-6 p-4 cursor-pointer group"
        borderColor="border-gray-900"
        borderRadius="rounded-xl"
        gradientFrom="from-slate-50"
        gradientTo="from-sky-50"
        onClick={() => setIsOpen(!isOpen)}
        label="Country"
      >
        
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-yellow-200/60 -rotate-1 -z-10 rounded-full group-hover:bg-yellow-300/60 transition-colors"></div>
                <div className="text-3xl">{country.flag}</div>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-bold text-gray-700 tracking-wide">Viewing legal context for</h3>
              <p className="text-lg font-black text-gray-900 font-mono">{country.name}</p>
            </div>
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-gray-900 transition-transform ${isOpen ? 'rotate-180' : ''} group-hover:translate-y-0.5`}
            strokeWidth={2.5}
          />
        </div>
      </BorderedBox>

      {isOpen && (
        <BorderedBox 
          className="absolute z-10 mt-1 w-full overflow-hidden p-0"
          borderColor="border-gray-900"
          borderRadius="rounded-xl"
          shadowSize="4px"
        >
          <div className="py-1">
            {countries.map((c) => (
              <button
                key={c.code}
                className={`w-full px-4 py-3 text-left flex items-center justify-between group/item hover:bg-yellow-50 transition-colors ${
                  country.code === c.code 
                    ? 'bg-yellow-100 font-bold' 
                    : 'bg-white hover:bg-yellow-50'
                }`}
                onClick={() => {
                  onCountryChange(c);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3 group-hover/item:scale-110 transition-transform">{c.flag}</span>
                  <span className="font-medium group-hover/item:font-bold">{c.name}</span>
                </div>
                {country.code === c.code && (
                  <Check 
                    className="h-5 w-5 text-yellow-600" 
                    strokeWidth={3}
                  />
                )}
              </button>
            ))}
          </div>
        </BorderedBox>
      )}
    </div>
  );
}
