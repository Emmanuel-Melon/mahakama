import { useTranslation } from "react-i18next";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { Button } from "~/components/ui/button";

interface AccountVerifiedStateProps {
  message: string;
  onContinue: () => void;
}

export function AccountVerifiedState({
  message,
  onContinue,
}: AccountVerifiedStateProps) {
  const { t } = useTranslation("auth");
  return (
    <div className="text-center space-y-6">
      <CircleCheck className="mx-auto h-12 w-12 text-green-600" />
      <h1 className="text-3xl font-bold">{t("verifyEmail.verifiedTitle")}</h1>
      <p className="text-muted-foreground">{message}</p>
      <Button onClick={onContinue} className="w-full">
        {t("verifyEmail.continueOnboarding")}
      </Button>
    </div>
  );
}

interface AccountVerificationErrorStateProps {
  onGoToLogin: () => void;
}

export function AccountVerificationErrorState({
  onGoToLogin,
}: AccountVerificationErrorStateProps) {
  const { t } = useTranslation("auth");
  return (
    <div className="space-y-6">
      <TriangleAlert className="mx-auto h-12 w-12 text-amber-600" />
      <p className="text-muted-foreground">{t("verifyEmail.expiredLink")}</p>
      <Button onClick={onGoToLogin} variant="outline" className="w-full">
        {t("verifyEmail.goToLogin")}
      </Button>
    </div>
  );
}

interface AccountVerificationPromptStateProps {
  isPending: boolean;
  disabled: boolean;
  onVerify: () => void;
}

export function AccountVerificationPromptState({
  isPending,
  disabled,
  onVerify,
}: AccountVerificationPromptStateProps) {
  const { t } = useTranslation("auth");
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">{t("verifyEmail.verifyPrompt")}</p>
      <Button
        onClick={onVerify}
        disabled={disabled || isPending}
        className="w-full"
      >
        {isPending ? t("verifyEmail.verifying") : t("verifyEmail.verifyButton")}
      </Button>
    </div>
  );
}
