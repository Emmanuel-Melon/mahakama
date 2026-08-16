"use client";
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { useCountry } from "~/context/country-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

const countries = [
  {
    id: "ws-south-sudan",
    name: "South Sudan",
    code: "SS",
    emoji: "🇸🇸",
  },
  {
    id: "ws-uganda",
    name: "Uganda",
    code: "UG",
    emoji: "🇺🇬",
  },
  {
    id: "ws-kenya",
    name: "Kenya",
    code: "KE",
    emoji: "🇰🇪",
  },
  {
    id: "ws-rwanda",
    name: "Rwanda",
    code: "RW",
    emoji: "🇷🇼",
  },
  {
    id: "ws-tanzania",
    name: "Tanzania",
    code: "TZ",
    emoji: "🇹🇿",
  },
];

export function CountrySelector() {
  const { isMobile } = useSidebar();
  const { selectedCountry, setSelectedCountry } = useCountry();

  const activeCountry =
    countries.find((country) => country.name === selectedCountry) ||
    countries[0];

  if (!activeCountry) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-lg">
                {activeCountry.emoji}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeCountry.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Countries
            </DropdownMenuLabel>
            {countries.map((country) => (
              <DropdownMenuItem
                key={country.id}
                onClick={() => setSelectedCountry(country.name)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md text-base bg-background">
                  {country.emoji}
                </div>
                {country.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
