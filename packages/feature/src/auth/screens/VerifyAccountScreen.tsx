import { useSearchParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuthMutations } from "@mah/api/src/hooks/use-auth";
import {
  AccountVerifiedState,
  AccountVerificationErrorState,
  AccountVerificationPromptState,
} from "../components/AccountVerificationState";

export function VerifyAccountScreen({
  loginPath = "/login",
}: {
  loginPath?: string;
}) {
  const { t } = useTranslation("auth");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuthMutations();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-12 bg-background">
      <div className="w-full max-w-md space-y-6 text-center">
        {verifyEmail.isSuccess ? (
          <AccountVerifiedState
            message={"verifyEmail.data?.message |"}
            onContinue={() => navigate("/onboarding")}
          />
        ) : (
          <>
            <h1 className="text-3xl">{t("verifyEmail.verifiedTitle")}</h1>
            {verifyEmail.isError ? (
              <AccountVerificationErrorState
                onGoToLogin={() => navigate(loginPath)}
              />
            ) : (
              <AccountVerificationPromptState
                isPending={verifyEmail.isPending}
                disabled={!token}
                onVerify={() => token && verifyEmail.mutate({ token })}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
