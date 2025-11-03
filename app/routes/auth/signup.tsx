import { useNavigate } from "react-router";
import type { Route } from "./+types/signup";
import { useState } from "react";
import { authApi } from "~/lib/api/auth.api";
import { AuthForm } from "~/auth/auth-form";
import { AuthAlternative } from "~/auth/auth-alternative";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Signup - Mahakama" },
    {
      name: "description",
      content:
        "Sign up to your Mahakama account to access your legal resources and history.",
    },
  ];
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.register({ email, password });
      console.log("response", response);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <AuthForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
      <AuthAlternative to="/login" text="Login" message="Have an account?" />
    </>
  );
}
