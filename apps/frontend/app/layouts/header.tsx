import {
  Scale,
  Users,
  Menu,
  X,
  Library,
  History,
  LogIn,
  Info,
  Mail,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { IconContainer } from "@mah/ui/components/IconContainer";
import { LanguageSwitcher } from "@mah/ui/components/molecules/LanguageSwitcher";
const links = [
  {
    id: 1,
    title: "Find a Lawyer",
    icon: Users,
    url: "/lawyers",
  },
  {
    id: 2,
    title: "Justice Hub",
    icon: Scale,
    url: "/legal-hub",
  },
  {
    id: 3,
    title: "Legal Database",
    icon: Library,
    url: "/documents",
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md ${
        isScrolled ? "shadow-[0_4px_0_0_rgba(0,0,0,0.1)]" : ""
      } transition-shadow duration-300`}
      style={{
        borderImageSource:
          "url(" +
          "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%233b82f6' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E" +
          ")",
        borderImageSlice: "1",
      }}
    >
      <div className="w-full">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex sm:h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 gap-2">
              <NavLink
                to="/"
                viewTransition
                className="flex items-center group"
              >
                <Scale className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="ml-2 sm:ml-3 text-lg sm:text-2xl font-black text-gray-900 font-serif">
                  Mahakama
                </span>
              </NavLink>
            </div>
            <div className="hidden md:flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <nav className="flex items-center gap-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.id}
                      to={link.url}
                      className={({ isActive }: { isActive: boolean }) =>
                        `inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold transition-colors 4px 8px 4px 8px 2px 2px 0 0 #000 ${
                          isActive
                            ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-gray-900"
                            : "text-gray-700 hover:bg-yellow-100 hover:border-2 hover:border-gray-900"
                        }`
                      }
                      style={({ isActive }) => ({
                        boxShadow: isActive ? "2px 2px 0 0 #000" : "none",
                        borderRadius: isActive
                          ? "4px 8px 4px 8px"
                          : "4px 8px 4px 8px",
                      })}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="hidden lg:inline">{link.title}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </nav>
              <LanguageSwitcher />
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-gray-900"
                      : "text-gray-700 hover:bg-yellow-50 hover:border-2 hover:border-gray-900"
                  }`
                }
                style={({ isActive }) => ({
                  boxShadow: isActive ? "2px 2px 0 0 #000" : "2px 2px 0 0 #000",
                  borderRadius: "4px 8px 4px 8px",
                })}
              >
                <LogIn className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Log in</span>
              </NavLink>
            </div>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            <div
              ref={menuRef}
              className="fixed left-0 right-0 top-16 sm:top-20 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] bg-white border-t-2 border-gray-900 overflow-y-auto z-40 md:hidden animate-in slide-in-from-top-2 duration-300"
            >
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
                          `flex items-center justify-between px-4 py-2.5 my-1 text-sm font-bold transition-colors ${
                            isActive
                              ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-gray-900"
                              : "text-gray-700 hover:bg-yellow-50 hover:border-2 hover:border-gray-900"
                          }`
                        }
                        style={({ isActive }) => ({
                          boxShadow: isActive ? "2px 2px 0 0 #000" : "none",
                          borderRadius: isActive ? "4px 8px 4px 8px" : "0",
                        })}
                        onClick={closeMenu}
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 flex-shrink-0" />
                              {link.title}
                            </div>
                            {isActive && (
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-900"></span>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}

                  <div className="border-t border-gray-200 my-2"></div>

                  <LanguageSwitcher />

                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-2.5 my-1 text-sm font-bold transition-colors ${
                        isActive
                          ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-gray-900"
                          : "text-gray-700 hover:bg-yellow-50 hover:border-2 hover:border-gray-900"
                      }`
                    }
                    style={({ isActive }) => ({
                      boxShadow: isActive ? "2px 2px 0 0 #000" : "none",
                      borderRadius: isActive ? "4px 8px 4px 8px" : "0",
                    })}
                    onClick={closeMenu}
                  >
                    <div className="flex items-center gap-3">
                      <LogIn className="h-5 w-5 flex-shrink-0" />
                      Log in
                    </div>
                  </NavLink>
                </div>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
