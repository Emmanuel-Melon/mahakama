import { useLocation } from "react-router";
import { useAuthMutations } from "@mah/api/src/hooks/use-auth";
import type { User } from "@mah/api/src/clients/users.api";
import { EmailSentNotice } from "../components/EmailSentNotice";
import { ResendSuccessBanner } from "../components/ResendSuccessBanner";
import { ResendVerificationButton } from "../components/ResendVerificationButton";

interface Props {
  user?: User | null;
}

export function VerifyEmailPendingScreen({ user }: Props) {
  const { state } = useLocation();
  const email = state?.email || user?.email;
  const { resendVerification } = useAuthMutations();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-12 bg-background">
      <div className="w-full max-w-xl space-y-8 animate-in fade-in duration-700 text-center">
        <EmailSentNotice email={email} />

        {resendVerification.isSuccess && (
          <ResendSuccessBanner
            message={resendVerification.data?.data.message}
          />
        )}

        <ResendVerificationButton
          onClick={() => email && resendVerification.mutate({ email })}
          disabled={resendVerification.isPending || !email}
          isPending={resendVerification.isPending}
        />
      </div>
    </div>
  );
}
