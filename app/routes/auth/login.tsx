import { useNavigate } from "react-router";
import type { Route } from "./+types/login";
import { useLogin } from "~/hooks/use-auth";
import { AuthForm } from "~/auth/auth-form";
import { AuthAlternative } from "~/auth/auth-alternative";
import { z } from "zod";
import { schemas } from "~/lib/api/types/schemas";
import type { components } from "~/lib/api/types/api1";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const loginRequestSchema = schemas.postAuthv1login_Body;
export type LoginRequest = components["schemas"]["LoginRequest"];

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login - Mahakama" },
    {
      name: "description",
      content:
        "Sign in to your Mahakama account to access your legal resources and history.",
    },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
  });

const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data, {
      onSuccess: (authResponse) => {
        console.log("Login successful:", authResponse);
        navigate("/");
      },
      onError: (error) => {
        console.error("Login failed:", error);
        toast.error("Login failed. Please try again.");
      }
    });
  };

  return (
    <>
      <AuthForm
        handleSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting || loginMutation.isPending}
        error={loginMutation.error ? "Invalid email or password. Please try again." : null}
        register={register}
        errors={errors}
      />
      <AuthAlternative
        to="/signup"
        text="Sign up"
        message="Don't have an account?"
      />
    </>
  );
}
