import { LoginScreen } from '~/feature/auth/screens/LoginScreen';
import type { Route } from "./+types/login"; 

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login - Mahakama" },
    {
      name: "description",
      content:
        "Sign in to your Mahakama account to access your legal resources and history.",
    },
  ];
}

export default LoginScreen;