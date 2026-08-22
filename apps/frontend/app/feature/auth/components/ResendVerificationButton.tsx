import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";

interface ResendVerificationButtonProps {
  onClick: () => void;
  disabled: boolean;
  isPending: boolean;
}

export function ResendVerificationButton({
  onClick,
  disabled,
  isPending,
}: ResendVerificationButtonProps) {
  const { t } = useTranslation("auth");
  return (
    <Button onClick={onClick} disabled={disabled} className="w-full">
      {isPending ? t("verifyEmail.sending") : t("verifyEmail.resendButton")}
    </Button>
  );
}
