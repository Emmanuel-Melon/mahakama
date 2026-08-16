import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AuthForm } from "~/feature/auth/components/auth-form";
import { AuthAlternative } from "~/feature/auth/components/auth-alternative";
import { useRegister } from "~/feature/auth/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { schemas } from "@mah/api/generated/api.schemas";
import type { components } from "@mah/api/generated/api.types";

export type RegisterRequest = components["schemas"]["RegisterRequest"];
const registerRequestSchema = schemas.postV1register_Body;

export const SignupScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerRequestSchema),
  });

  const onSubmit = (data: RegisterRequest) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
      onError: () => {
        toast.error(t("signup.error"));
      },
    });
  };
  return (
    <>
      <AuthForm
        mode="signup"
        handleSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting || registerMutation.isPending}
        error={registerMutation.error ? t("signup.invalidCredentials") : null}
        register={register}
        errors={errors}
      />
      <AuthAlternative
        to="/login"
        text={t("signup.loginLink")}
        message={t("signup.loginMessage")}
      />
    </>
  );
};
