import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { Country } from "../header";

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
      <div 
        className="relative mb-6 bg-white border-2 border-gray-900 p-4 cursor-pointer group"
        style={{
          borderRadius: '8px 16px 8px 16px',
          boxShadow: '3px 3px 0 0 #000',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)',
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Corner decorations */}
        <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
        <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>
        
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <div className="relative flex-shrink-0 bg-yellow-100 p-2 rounded-full border-2 border-gray-900">
              <span className="text-2xl">{country.flag}</span>
              <div className="absolute -inset-1 bg-yellow-200/60 -rotate-1 -z-10 rounded-full group-hover:bg-yellow-300/60 transition-colors"></div>
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
      </div>

      {isOpen && (
        <div 
          className="absolute z-10 mt-1 w-full bg-white border-2 border-gray-900 overflow-hidden"
          style={{
            borderRadius: '8px 16px 8px 16px',
            boxShadow: '4px 4px 0 0 #000',
          }}
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
        </div>
      )}
    </div>
  );
}
