import { NavLink } from "react-router";
import { Lock, Mail, Github, Facebook } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { BorderedBox } from "~/components/ui/bordered-box";
import { IconContainer } from "~/components/icon-container";
import { Scale } from "lucide-react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Mahakama" },
    {
      name: "description",
      content:
        "Sign in to your Mahakama account to access your legal resources and history.",
    },
  ];
}

export default function Login() {
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
              Sign in to continue to Mahakama
            </p>
          </div>

          {/* Login Form */}
          <BorderedBox
            label="Login"
            labelClassName="bg-yellow-100 text-yellow-800 font-bold"
            className="space-y-4"
          >
            <form className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-12 w-full border-2 border-gray-900 font-medium"
                    style={{
                      boxShadow: "2px 2px 0 0 #000",
                      borderRadius: "4px 8px 4px 8px",
                    }}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Password
                  </label>
                  <NavLink
                    to="/forgot-password"
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Forgot?
                  </NavLink>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-12 w-full border-2 border-gray-900 font-medium"
                    style={{
                      boxShadow: "2px 2px 0 0 #000",
                      borderRadius: "4px 8px 4px 8px",
                    }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black text-base py-3 transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  boxShadow: "3px 3px 0 0 #000",
                  borderRadius: "4px 12px 4px 12px",
                }}
              >
                Sign in
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-900" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-sm font-bold text-gray-600">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                type="button"
                className="border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold"
                style={{
                  boxShadow: "2px 2px 0 0 #000",
                  borderRadius: "4px 8px 4px 8px",
                }}
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                type="button"
                className="border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold"
                style={{
                  boxShadow: "2px 2px 0 0 #000",
                  borderRadius: "4px 8px 4px 8px",
                }}
              >
                <Mail className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                type="button"
                className="border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold"
                style={{
                  boxShadow: "2px 2px 0 0 #000",
                  borderRadius: "4px 8px 4px 8px",
                }}
              >
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </BorderedBox>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-600 font-medium">
            Have an account?{" "}
            <NavLink
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
