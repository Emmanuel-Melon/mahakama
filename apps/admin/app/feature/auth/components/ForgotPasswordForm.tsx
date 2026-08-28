import { Button } from "@mah/ui";
import { useTranslation } from "react-i18next";
import { Mail, ArrowRight } from "lucide-react";
import { NavLink } from "react-router";
import { forgotPasswordSchema, type ForgotPasswordData } from "../auth.types";
import { AuthFormHeader } from "./AuthFormHeader";
import { FormField } from "@mah/ui/components/molecules/FormField";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordData) => void;
  isPending?: boolean;
}

export function ForgotPasswordForm({
  onSubmit,
  isPending,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation("auth");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = forgotPasswordSchema.parse({
      email: formData.get("email") as string,
    });
    onSubmit(data);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-12 bg-background">
      <div className="w-full max-w-xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <AuthFormHeader
          icon={Mail}
          subtitle={t("forgotPassword.subtitle")}
          title={t("forgotPassword.title")}
          description={t("forgotPassword.description")}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label={t("forgotPassword.emailLabel")}
            type="email"
            id="email"
            name="email"
            placeholder={t("forgotPassword.emailPlaceholder")}
            disabled={isPending}
            required
            icon={Mail}
          />

          <div className="pt-2">
            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              {isPending ? (
                t("forgotPassword.sending")
              ) : (
                <>
                  {t("forgotPassword.sendLink")}{" "}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Button variant="ghost" asChild>
            <NavLink to="/login" className="text-xs text-text-muted">
              {t("forgotPassword.backToLogin")}
            </NavLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
