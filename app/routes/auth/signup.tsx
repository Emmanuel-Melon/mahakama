import type { Route } from "./+types/signup";
import { SignupScreen } from "~/feature/auth/screens/SignupScreen";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Signup - Mahakama" },
    {
      name: "description",
      content:
        "Sign up to your Mahakama account to access your legal resources and history.",
    },
  ];
}

export default SignupScreen;