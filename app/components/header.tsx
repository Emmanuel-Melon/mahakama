import { Scale, Users, Info, Menu, X, ChevronDown, Check, Paperclip } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type Country = {
  code: 'SS' | 'UG';
  name: string;
  flag: string;
};

const countries: Country[] = [
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
];

const links = [
  {
    id: 1,
    title: "Find a Lawyer",
    icon: Users,
    url: "/lawyers",
  },
  {
    id: 2,
    title: "Legal Database",
    icon: Paperclip,
    url: "/legal-database",
  },
  {
    id: 3,
    title: "About",
    icon: Info,
    url: "/about",
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const countryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCountryMenu = () => {
    setIsCountryOpen(!isCountryOpen);
  };

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryButtonRef.current && !countryButtonRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="flex h-16 items-center justify-between max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-foreground">Mahakama</span>
          </a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted/50 rounded-md"
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.title}</span>
                </a>
              );
            })}
          </nav>
          {/* Country Selector - Desktop */}
          <div className="relative">
            <button
              ref={countryButtonRef}
              onClick={toggleCountryMenu}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
              aria-haspopup="true"
              aria-expanded={isCountryOpen}
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="hidden sm:inline">{selectedCountry.name}</span>
              <ChevronDown size={16} className={`transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCountryOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80">
                <div className="py-1">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsCountryOpen(false);
                      }}
                      className={`relative flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ${
                        selectedCountry.code === country.code
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                      {selectedCountry.code === country.code && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Country Selector - Mobile */}
            <button
              onClick={toggleCountryMenu}
              className="md:hidden p-2 rounded-md hover:bg-muted/50 transition-colors"
              aria-label="Select country"
            >
              <span className="text-lg">{selectedCountry.flag}</span>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu} 
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 top-[73px] bg-background border-t border-border z-50">
            <div className="w-full p-4 border-b border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-4">Country</h3>
              <div className="space-y-1 mb-4">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country);
                      setIsCountryOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-left ${
                      selectedCountry.code === country.code
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                    {selectedCountry.code === country.code && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <nav className="flex flex-col items-center gap-2 p-4 w-full">
              <h3 className="w-full text-sm font-medium text-muted-foreground mb-2 px-4">Navigation</h3>
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  onClick={() => setIsOpen(false)}
                  className={`
                    w-full text-center text-lg transition-colors
                    flex gap-2 rounded-md px-4 py-3 items-center justify-center
                    ${
                      location.pathname === link.url
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <link.icon className="w-5 h-5" />
                  {link.title}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
