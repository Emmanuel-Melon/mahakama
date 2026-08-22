import { useAuthMutations } from "@mah/api/src/hooks/use-auth";
import { useSearchParams } from "react-router";
import { PasswordResetForm } from "../components/PasswordResetForm";

export function PasswordResetScreen() {
  const { resetPassword } = useAuthMutations();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const handleSubmit = (password: string) => {
    resetPassword.mutate({
      token,
      password,
    });
  };

  return (
    <PasswordResetForm
      onSubmit={handleSubmit}
      isPending={resetPassword.isPending}
    />
  );
}
