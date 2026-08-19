import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useLogin } from "@mah/api/hooks/use-auth";
import { AuthForm } from "~/feature/auth/components/auth-form";
import { AuthAlternative } from "~/feature/auth/components/auth-alternative";
import { schemas } from "@mah/api/generated/api.schemas";
import type { components } from "@mah/api/generated/api.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  type LoginRequest,
  loginRequestSchema,
} from "@mah/api/clients/auth.api";

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
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
      onSuccess: () => {
        navigate("/");
      },
      onError: () => {
        toast.error(t("login.error"));
      },
    });
  };

  return (
    <>
      <AuthForm
        mode="login"
        handleSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting || loginMutation.isPending}
        error={loginMutation.error ? t("login.invalidCredentials") : null}
        register={register}
        errors={errors}
      />
      <AuthAlternative
        to="/signup"
        text={t("login.signUpLink")}
        message={t("login.signUpMessage")}
      />
    </>
  );
};
