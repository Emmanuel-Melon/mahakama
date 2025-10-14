import {
  Scale,
  Users,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Check,
  Library,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router";
import type { NavLinkProps } from "react-router";
import { IconContainer } from "~/components/icon-container";
import {
  getSelectedCountry,
  saveSelectedCountry,
} from "../utils/countryContext";

export type Country = {
  code: "SS" | "UG";
  name: string;
  flag: string;
};

const countries: Country[] = [
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
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
    icon: Library,
    url: "/legal-database",
  },
  {
    id: 3,
    title: "About",
    icon: BookOpen,
    url: "/about",
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(getSelectedCountry());
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

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    saveSelectedCountry(country);
    setIsCountryOpen(false);
  };

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryButtonRef.current &&
        !countryButtonRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-gray-900 ${isScrolled ? "shadow-[0_4px_0_0_rgba(0,0,0,0.1)]" : ""} transition-shadow duration-300`}
      style={{
        borderImageSource:
          "url(" +
          "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%233b82f6' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E" +
          ")",
        borderImageSlice: "1",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center group">
              <IconContainer
                icon={Scale}
                size="lg"
                color="outline"
                className="group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="ml-3 text-2xl font-black text-gray-900 font-serif">
                Mahakama
              </span>
            </NavLink>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.id}
                    to={link.url}
                    className={({
                      isActive,
                      isPending,
                    }: {
                      isActive: boolean;
                      isPending: boolean;
                    }) =>
                      `group relative px-4 py-2 text-sm font-bold transition-colors ${
                        isActive
                          ? "text-gray-900"
                          : "text-gray-700 hover:text-gray-900"
                      }`
                    }
                  >
                    {({
                      isActive,
                      isPending,
                    }: {
                      isActive: boolean;
                      isPending: boolean;
                    }) => (
                      <>
                        <span className="relative z-10 flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {link.title}
                          {isPending && <span className="ml-1">...</span>}
                        </span>
                        <span
                          className={`absolute bottom-1 left-0 right-0 h-1 -rotate-1 origin-left transition-all duration-300 ${
                            isActive
                              ? "bg-yellow-400 scale-x-100"
                              : "bg-yellow-300/60 scale-x-0 group-hover:scale-x-100"
                          }`}
                        ></span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Vertical Separator */}
            <div className="hidden md:block h-6 w-0.5 bg-gray-300 mx-2"></div>

            {/* Country Selector - Desktop */}
            <div className="relative hidden md:block">
              <button
                ref={countryButtonRef}
                onClick={toggleCountryMenu}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-200"
                aria-haspopup="true"
                aria-expanded={isCountryOpen}
              >
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="hidden sm:inline">{selectedCountry.name}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isCountryOpen ? "rotate-180" : ""} text-gray-500`}
                />
              </button>

              {isCountryOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border-2 border-gray-900 bg-white p-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] animate-in fade-in-80">
                  <div className="py-1">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountrySelect(country)}
                        className={`relative flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium outline-none transition-colors ${
                          selectedCountry.code === country.code
                            ? "bg-yellow-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{country.flag}</span>
                          <span className="font-semibold">{country.name}</span>
                        </div>
                        {selectedCountry.code === country.code && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {/* Country Selector - Mobile */}
              <button
                onClick={toggleCountryMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                aria-label="Select country"
              >
                <span className="text-xl">{selectedCountry.flag}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 md:hidden transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 top-20 bg-white z-40 border-t-2 border-gray-900 overflow-y-auto transition-all duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Country Selector */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Select Country
          </h3>
          <div className="space-y-2">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  handleCountrySelect(country);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                  selectedCountry.code === country.code
                    ? "bg-yellow-100 text-gray-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-base">{country.name}</span>
                </div>
                {selectedCountry.code === country.code && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4">
            Menu
          </h3>
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.id}
                  to={link.url}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                  onClick={toggleMenu}
                >
                  <Icon className="h-5 w-5" />
                  {link.title}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
}
