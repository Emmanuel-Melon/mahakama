import { Scale, Users, Info, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  {
    id: 1,
    title: "Find a Lawyer",
    icon: Users,
    url: "/lawyers",
  },
  {
    id: 2,
    title: "About",
    icon: Info,
    url: "/about",
  },
];

export function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 lg:px-24
        ${isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"}
        border-b border-border`}
    >
      <div className="max-w-7xl mx-auto w-full py-4 flex items-center justify-between">
        <a href="/" className="text-lg font-bold flex items-center gap-2 text-foreground">
          <Scale className="h-6 w-6 text-primary" />
          <span>Mahakama</span>
        </a>

        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
             bg-primary/10 text-primary
                `}
              >
                <link.icon size={20} />
                {link.title}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 top-[73px] bg-background border-t border-border z-50">
            <nav className="flex flex-col items-center gap-2 p-4">
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
