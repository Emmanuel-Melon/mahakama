import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";

const RecoveryForm = ({
  email,
  setEmail,
  onSubmit,
}: {
  email: string;
  setEmail: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  const { t } = useTranslation("auth");

  return (
    <CardWithLabel label={t("forgotPassword.label")} className="bg-white">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-bold italic">
            {t("forgotPassword.instruction")}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Mail size={14} /> {t("forgotPassword.emailLabel")}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("forgotPassword.emailPlaceholder")}
            className="w-full p-4 border-4 border-black focus:outline-none focus:bg-yellow-50 font-bold transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 text-black font-black py-4 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase italic"
        >
          {t("forgotPassword.submitButton")}
        </button>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-xs font-black uppercase underline decoration-2 hover:text-yellow-600 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} /> {t("forgotPassword.backToLogin")}
          </Link>
        </div>
      </form>
    </CardWithLabel>
  );
};

const SuccessState = ({
  email,
  onReset,
}: {
  email: string;
  onReset: () => void;
}) => {
  const { t } = useTranslation("auth");

  return (
    <CardWithLabel
      label={t("forgotPassword.successLabel")}
      className="bg-green-50 border-green-500"
    >
      <div className="py-6 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 border-4 border-green-500 rounded-full mb-2 text-green-600">
          <ShieldCheck size={32} />
        </div>
        <p className="font-bold italic">
          {t("forgotPassword.successMessage")}{" "}
          <span className="underline">{email}</span>.
        </p>
        <p className="text-sm text-zinc-600 font-medium">
          {t("forgotPassword.spamNotice")}
        </p>
        <button
          onClick={onReset}
          className="w-full mt-4 bg-black text-white font-black py-3 border-2 border-black hover:bg-zinc-800 transition-all uppercase text-xs"
        >
          {t("forgotPassword.tryDifferentEmail")}
        </button>
      </div>
    </CardWithLabel>
  );
};

export const ForgotPasswordScreen = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger your API call here
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {!isSubmitted ? (
          <RecoveryForm
            email={email}
            setEmail={setEmail}
            onSubmit={handleSubmit}
          />
        ) : (
          <SuccessState email={email} onReset={() => setIsSubmitted(false)} />
        )}
      </div>
    </div>
  );
};