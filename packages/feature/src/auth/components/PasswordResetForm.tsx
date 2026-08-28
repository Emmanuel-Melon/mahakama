import { Button } from "@mah/ui/components/Button";
import { useTranslation } from "react-i18next";
import { Lock, ArrowRight } from "lucide-react";
import { NavLink } from "react-router";
import { z } from "zod";
import { AuthFormHeader } from "./AuthFormHeader";
import { FormField } from "@mah/ui/components/molecules/FormField";

export const passwordResetFormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface PasswordResetFormProps {
  onSubmit: (password: string) => void;
  isPending?: boolean;
}

export function PasswordResetForm({
  onSubmit,
  isPending,
}: PasswordResetFormProps) {
  const { t } = useTranslation("auth");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = passwordResetFormSchema.parse({
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    });

    onSubmit(result.password);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-12 bg-background">
      <div className="w-full max-w-xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <AuthFormHeader
          icon={Lock}
          subtitle={t("resetPassword.subtitle")}
          title={t("resetPassword.title")}
          description={t("resetPassword.description")}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label={t("resetPassword.newPasswordLabel")}
            type="password"
            id="password"
            name="password"
            placeholder={t("resetPassword.passwordPlaceholder")}
            disabled={isPending}
            required
            icon={Lock}
          />

          <FormField
            label={t("resetPassword.confirmPasswordLabel")}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder={t("resetPassword.passwordPlaceholder")}
            disabled={isPending}
            required
            icon={Lock}
          />

          <div className="pt-2">
            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              {isPending ? (
                t("resetPassword.updating")
              ) : (
                <>
                  {t("resetPassword.updatePassword")}{" "}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Button variant="ghost" asChild>
            <NavLink to="/login" className="text-xs text-text-muted">
              {t("resetPassword.backToLogin")}
            </NavLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
