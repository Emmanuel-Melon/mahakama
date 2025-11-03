import { NavLink } from "react-router";
import { BorderedBox } from "~/components/ui/bordered-box";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { AuthSocialButtons } from "./social-auth-buttons";
import { Lock, Mail, Loader2 } from "lucide-react";

export const AuthForm = ({
  handleSubmit,
  isLoading,
  error,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
}) => {
  return (
    <BorderedBox
      label="Login"
      labelClassName="bg-yellow-100 text-yellow-800 font-bold"
      className="space-y-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border-2 border-red-900 rounded text-red-900 text-sm font-medium">
            {error}
          </div>
        )}

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
              disabled={isLoading}
              className="pl-12 w-full border-2 border-gray-900 font-medium"
              style={{
                boxShadow: "2px 2px 0 0 #000",
                borderRadius: "4px 8px 4px 8px",
              }}
              placeholder="you@example.com"
            />
          </div>
        </div>

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
              disabled={isLoading}
              className="pl-12 w-full border-2 border-gray-900 font-medium"
              style={{
                boxShadow: "2px 2px 0 0 #000",
                borderRadius: "4px 8px 4px 8px",
              }}
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black text-base py-3 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            boxShadow: "3px 3px 0 0 #000",
            borderRadius: "4px 12px 4px 12px",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <AuthSocialButtons />
    </BorderedBox>
  );
};
