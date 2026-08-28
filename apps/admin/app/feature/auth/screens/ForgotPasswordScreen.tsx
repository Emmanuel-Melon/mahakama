import { useAuthMutations } from "@mah/api/src/hooks/use-auth";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export function ForgotPasswordScreen() {
  const { resetPasswordRequest } = useAuthMutations();

  const handleSubmit = (data: { email: string }) => {
    resetPasswordRequest.mutate(data);
  };

  return (
    <ForgotPasswordForm
      onSubmit={handleSubmit}
      isPending={resetPasswordRequest.isPending}
    />
  );
}
