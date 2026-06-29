import { Input } from "./input";
import { Search, ChevronRight } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "~/lib/utils";

interface HeroSectionActionProps {
  variant?: "cta" | "search";
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function HeroSectionAction({
  variant = "cta",
  onSearch,
  searchPlaceholder = "Search...",
}: HeroSectionActionProps) {
  if (variant === "search") {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="w-full pl-12 pr-6 py-4 text-base border-2 border-gray-900 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
            style={{
              boxShadow: "3px 3px 0 0 #000",
            }}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <NavLink
        to="/app"
        className={({ isActive }) =>
          cn(
            "relative px-6 py-3 text-sm font-bold text-gray-900 border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex items-center",
            isActive ? "ring-2 ring-offset-2 ring-yellow-400" : ""
          )
        }
        style={{
          borderRadius: "8px 16px 8px 16px",
          boxShadow: "3px 3px 0 0 #000",
        }}
      >
        Get Started
        <ChevronRight className="ml-2 h-4 w-4 inline-block" />
        <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
        <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>
      </NavLink>

      <NavLink
        to="#how-it-works"
        className={({ isActive }) =>
          cn(
            "group relative px-6 py-3 text-sm font-bold text-gray-900 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5 inline-flex items-center gap-2",
            isActive ? "ring-2 ring-offset-2 ring-gray-200" : "",
            {
              "ml-4": true, // Add left margin for better spacing
            }
          )
        }
        style={{
          borderRadius: "8px 16px 8px 16px",
          boxShadow: "3px 3px 0 0 #000",
        }}
      >
        Learn more
        <svg
          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ strokeWidth: "2.5" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </NavLink>
    </div>
  );
}
