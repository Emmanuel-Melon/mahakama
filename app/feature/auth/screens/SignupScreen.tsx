import { useNavigate } from "react-router";
import { AuthForm } from "~/feature/auth/components/auth-form";
import { AuthAlternative } from "~/feature/auth/components/auth-alternative";
import { useRegister } from "~/feature/auth/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { schemas } from "~/lib/api/generated/api.schemas";
import type { components } from "~/lib/api/generated/api.types";

export type RegisterRequest = components["schemas"]["RegisterRequest"];
const registerRequestSchema = schemas.postAuthv1register_Body;

export const SignupScreen = () => {
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterRequest>({
        resolver: zodResolver(registerRequestSchema),
    });

    const onSubmit = (data: RegisterRequest) => {
        registerMutation.mutate(data, {
            onSuccess: (authResponse) => {
                navigate("/");
            },
            onError: (error) => {
                toast.error("Registration failed. Please try again.");
            }
        });
    };
    return (
        <>
            <AuthForm
                handleSubmit={handleSubmit(onSubmit)}
                isLoading={isSubmitting || registerMutation.isPending}
                error={registerMutation.error ? "Invalid email or password. Please try again." : null}
                register={register}
                errors={errors}
            />
            <AuthAlternative to="/login" text="Login" message="Have an account?" />
        </>
    );
}
