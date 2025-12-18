import type { Route } from "./+types/login"; 
import { LoginScreen } from '~/feature/auth/screens/LoginScreen';

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