import type { Route } from "./+types/login"; 
import { ForgotPasswordScreen } from '~/feature/auth/screens/ForgotPassword';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Forgot Password - Mahakama" },
    {
      name: "description",
      content:
        "Forgot your password? No problem! Enter your email address and we'll send you a link to reset your password.",
    },
  ];
}

export default ForgotPasswordScreen;