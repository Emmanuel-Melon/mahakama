import { NavLink } from "react-router";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { Button } from "@mah/ui";
import { AuthSocialButtons } from "./AuthSocialButtons";
import { User, Lock, Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  loginRequestSchema,
  registerRequestSchema,
  type LoginRequest,
  type RegisterRequest,
} from "@mah/api/src/clients/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl } from "@mah/ui/components/molecules/FormControl";

export type AuthMode = "login" | "signup";
export type AuthFormData<M extends AuthMode> = M extends "signup"
  ? RegisterRequest
  : LoginRequest;

interface AuthFormProps<M extends AuthMode = AuthMode> {
  mode: M;
  onSubmit?: (data: AuthFormData<M>) => void;
  isLoading?: boolean;
}

export function AuthForm<M extends AuthMode>({
  mode,
  onSubmit,
  isLoading,
}: AuthFormProps<M>) {
  const isSignup = mode === "signup";

  const defaultValues =
    mode === "login"
      ? { email: "", password: "", role: "user" as const }
      : { name: "", email: "", password: "", role: "user" as const };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(
      isSignup ? registerRequestSchema : loginRequestSchema,
    ),
    defaultValues,
  });

  const onFormSubmit = async (data: AuthFormData<M>) => {
    await onSubmit?.(data);
  };

  return (
    <CardWithLabel
      label={isSignup ? "Sign Up" : "Login"}
      labelClassName="bg-yellow-100 text-yellow-800 font-bold"
      className="space-y-4 border-solid"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {isSignup && (
          <FormControl
            label="Full name"
            name="name"
            icon={User}
            placeholder="John Doe"
            autoComplete="name"
            disabled={isLoading}
            registration={register("name")}
          />
        )}

        <FormControl
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          registration={register("email")}
        />

        <FormControl
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete={isSignup ? "new-password" : "current-password"}
          disabled={isLoading}
          registration={register("password")}
          labelAction={
            !isSignup && (
              <NavLink
                to="/forgot-password"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Forgot Password?
              </NavLink>
            )
          }
        />

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
}
