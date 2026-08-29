import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuthMutations } from "@mah/api/src/hooks/use-auth";
import { AuthForm } from "../components/AuthForm";
import { AuthAlternative } from "../components/AuthAlternative";
import { getOnboardingPath } from "@mah/client/nav";
import { type LoginRequest } from "@mah/api/src/clients/auth.api";

export const LoginScreen = ({
  successPath = "/app",
  redirectOnboarded = true,
}: {
  successPath?: string;
  redirectOnboarded?: boolean;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { login } = useAuthMutations();

  const onSubmit = (data: LoginRequest) => {
    login.mutate(data, {
      onSuccess: (result) => {
        const onboarded = !!result?.data?.isOnboarded;
        navigate(
          onboarded || !redirectOnboarded
            ? successPath
            : getOnboardingPath(result?.data?.role),
          {
            state: { email: data.email },
            replace: true,
          },
        );
      },
    });
  };

  return (
    <>
      <AuthForm mode="login" onSubmit={onSubmit} isLoading={login.isPending} />
      <AuthAlternative
        to="/signup"
        text={t("login.signUpLink")}
        message={t("login.signUpMessage")}
      />
    </>
  );
};
