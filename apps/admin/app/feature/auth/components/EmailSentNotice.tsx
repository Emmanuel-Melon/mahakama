import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";

interface EmailSentNoticeProps {
  email?: string;
}

export function EmailSentNotice({ email }: EmailSentNoticeProps) {
  const { t } = useTranslation("auth");
  return (
    <div className="space-y-4">
      <Mail className="mx-auto h-10 w-10 text-muted-foreground" />
      <h1 className="text-3xl font-bold tracking-tight">
        {t("verifyEmail.checkYourEmail")}
      </h1>
      <p className="text-muted-foreground">
        {t("verifyEmail.sentVerificationLink")}{" "}
        <strong>{email || t("verifyEmail.yourEmailAddress")}</strong>.
      </p>
    </div>
  );
}
