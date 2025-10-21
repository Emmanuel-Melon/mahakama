import {
  Scale,
  Users,
  BookOpen,
  Menu,
  X,
  Library,
  History,
  LogIn,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { IconContainer } from "~/components/icon-container";

const links = [
  {
    id: 0,
    title: "Recents",
    icon: History,
    url: "/recents",
  },
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
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
      className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-gray-900 ${isScrolled ? "shadow-[0_4px_0_0_rgba(0,0,0,0.1)]" : ""} transition-shadow duration-300`}
      style={{
        borderImageSource:
          "url(" +
          "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%233b82f6' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E" +
          ")",
        borderImageSlice: "1",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <NavLink to="/" className="flex items-center group">
              <IconContainer
                icon={Scale}
                size="lg"
                color="outline"
                className="group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="ml-2 sm:ml-3 text-lg sm:text-2xl font-black text-gray-900 font-serif">
                Mahakama
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-1">
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
                    `group relative px-3 lg:px-4 py-2 text-sm font-bold transition-colors ${
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
                        <span className="hidden lg:inline">{link.title}</span>
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

            <div className="h-6 w-px bg-gray-200"></div>

            <NavLink
              to="/login"
              className="group relative px-3 py-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span className="relative z-10 flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden lg:inline">Log in</span>
              </span>
              <span className="absolute bottom-1 left-0 right-0 h-1 -rotate-1 origin-left scale-x-0 group-hover:scale-x-100 bg-yellow-300/60 transition-all duration-300"></span>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
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
                        `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      onClick={closeMenu}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {link.title}
                    </NavLink>
                  );
                })}

                <div className="border-t border-gray-200 my-2"></div>

                <NavLink
                  to="/login"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  <LogIn className="h-5 w-5 flex-shrink-0" />
                  Log in
                </NavLink>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}