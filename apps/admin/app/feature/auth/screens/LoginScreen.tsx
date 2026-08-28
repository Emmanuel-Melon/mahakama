import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuthMutations } from "@mah/api/src/hooks/use-auth";
import { AuthForm } from "~/feature/auth/components/AuthForm";
import { AuthAlternative } from "~/feature/auth/components/AuthAlternative";
import { type LoginRequest } from "@mah/api/src/clients/auth.api";

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { login } = useAuthMutations();

  const onSubmit = (data: LoginRequest) => {
    login.mutate(data, {
      onSuccess: () => {
        navigate("/app", {
          state: { email: data.email },
          replace: true,
        });
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
