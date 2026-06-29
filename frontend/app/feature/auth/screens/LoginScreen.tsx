import { useNavigate } from "react-router";
import { useLogin } from "~/feature/auth/hooks/use-auth";
import { AuthForm } from "~/feature/auth/components/auth-form";
import { AuthAlternative } from "~/feature/auth/components/auth-alternative";
import { schemas } from "~/lib/api/generated/api.schemas";
import type { components } from "~/lib/api/generated/api.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const loginRequestSchema = schemas.postAuthv1login_Body;
export type LoginRequest = components["schemas"]["LoginRequest"];

export const LoginScreen = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginRequest>({
        resolver: zodResolver(loginRequestSchema),
    });

    const onSubmit = (data: LoginRequest) => {
        loginMutation.mutate(data, {
            onSuccess: (authResponse) => {
                navigate("/");
            },
            onError: (error) => {
                toast.error("Login failed. Please try again.");
            }
        });
    };

    return (
        <>
            <AuthForm
                handleSubmit={handleSubmit(onSubmit)}
                isLoading={isSubmitting || loginMutation.isPending}
                error={loginMutation.error ? "Invalid email or password. Please try again." : null}
                register={register}
                errors={errors}
            />
            <AuthAlternative
                to="/signup"
                text="Sign up"
                message="Don't have an account?"
            />
        </>
    );
}
