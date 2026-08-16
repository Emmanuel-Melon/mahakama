import { NavLink } from "react-router";
import { CardWithLabel } from "~/components/ui/card-with-label";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { AuthSocialButtons } from "./social-auth-buttons";
import { User, Lock, Mail, Loader2 } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { schemas } from "@mah/api/generated/api.schemas";
import type { components } from "@mah/api/generated/api.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
const loginRequestSchema = schemas.postV1login_Body;
export type LoginRequest = components["schemas"]["LoginRequest"];

type AuthFormValues = { email?: unknown; password?: unknown; name?: unknown };

export const AuthForm = <T extends AuthFormValues>({
  mode = "login",
  handleSubmit,
  isLoading,
  error,
  register,
  errors,
}: {
  mode?: "login" | "signup";
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}) => {
  const isSignup = mode === "signup";
  return (
    <CardWithLabel
      label={isSignup ? "Sign Up" : "Login"}
      labelClassName="bg-yellow-100 text-yellow-800 font-bold"
      className="space-y-4 border-solid"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border-2 border-red-900 rounded text-red-900 text-sm font-medium">
            {error}
          </div>
        )}
        {isSignup && (
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Full name
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="name"
                {...register("name")}
                type="text"
                autoComplete="name"
                disabled={isLoading}
                className="pl-12 w-full border-2 border-gray-900 font-medium"
                style={{
                  boxShadow: "2px 2px 0 0 #000",
                  borderRadius: "4px 8px 4px 8px",
                }}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
        )}
        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Email address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              {...register("email")}
              type="email"
              autoComplete="email"
              disabled={isLoading}
              className="pl-12 w-full border-2 border-gray-900 font-medium"
              style={{
                boxShadow: "2px 2px 0 0 #000",
                borderRadius: "4px 8px 4px 8px",
              }}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label
              htmlFor="password"
              className="block text-sm font-bold text-gray-700"
            >
              Password
            </Label>
            {!isSignup && (
              <NavLink
                to="/forgot-password"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Forgot Password?
              </NavLink>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              {...register("password")}
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              disabled={isLoading}
              className="pl-12 w-full border-2 border-gray-900 font-medium"
              style={{
                boxShadow: "2px 2px 0 0 #000",
                borderRadius: "4px 8px 4px 8px",
              }}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.password.message}
              </p>
            )}
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
              {isSignup ? "Creating account..." : "Signing in..."}
            </>
          ) : isSignup ? (
            "Sign Up"
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <AuthSocialButtons />
    </CardWithLabel>
  );
};
