import { useNavigate } from "react-router";
import { AuthForm } from "~/feature/auth/components/AuthForm";
import { AuthAlternative } from "~/feature/auth/components/AuthAlternative";
import { useAuthMutations } from "@mah/api/src/hooks/use-auth";
import { toast } from "sonner";

import { type RegisterRequest } from "@mah/api/src/clients/auth.api";

export const SignupScreen = () => {
  const navigate = useNavigate();
  const { register: registerMutation } = useAuthMutations();

  const onSubmit = (data: RegisterRequest) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/verify-email-pending", {
          state: { email: data.email },
          replace: true,
        });
      },
      onError: () => {
        toast.error("Registration failed. Please try again.");
      },
    });
  };

  return (
    <>
      <AuthForm
        mode="signup"
        onSubmit={onSubmit}
        isLoading={registerMutation.isPending}
      />
      <AuthAlternative
        to="/login"
        text="Sign in instead"
        message="Already have an account?"
      />
    </>
  );
};
