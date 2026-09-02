import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useUser } from "~/context/user-provider";
import { FolderOpen, Users, Bell, CreditCard, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home - Mahakama Org" },
    { name: "description", content: "Welcome to your organization dashboard." },
  ];
}

interface QuickLink {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
}

const QUICK_LINKS: QuickLink[] = [
  {
    title: "Matters",
    description: "Manage legal matters",
    url: "/matters",
    icon: FolderOpen,
  },
  {
    title: "Team",
    description: "Manage team members",
    url: "/team",
    icon: Users,
  },
  {
    title: "Notifications",
    description: "View your notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Billing",
    description: "Manage subscription & billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    description: "Organization settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function Home() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {user ? `Welcome back, ${user.name || user.email}` : "Welcome"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {user
            ? "This is your organization dashboard."
            : "Sign in to access your organization dashboard."}
        </p>
      </div>

      {user ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.url}
              to={link.url}
              className="group rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-muted p-2">
                  <link.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">
            <a href="/login" className="text-primary underline">
              Sign in
            </a>{" "}
            or{" "}
            <a href="/signup" className="text-primary underline">
              create an account
            </a>{" "}
            to get started.
          </p>
        </div>
      )}
    </div>
  );
}