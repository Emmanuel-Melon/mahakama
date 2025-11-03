import { IconContainer } from "~/components/icon-container";
import { Scale } from "lucide-react";
import type { Route } from "./+types/$profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile - Mahakama" },
    {
      name: "description",
      content:
        "Profile page for Mahakama account to access your legal resources and history.",
    },
  ];
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <IconContainer icon={Scale} size="lg" color="handdrawn" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 font-serif">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Profile page for Mahakama account to access your legal resources
              and history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
