import { useQuery } from "@tanstack/react-query";
import {
  authApi,
  type UserResult,
  type LoginRequest,
  type RegisterRequest,
  type ResetPasswordResult,
} from "../clients/auth.api";
import type { ApiClientError } from "../api/api.errors";
import { useAppMutation } from "../react-query/react-query.utils";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
  login: () => [...authKeys.all, "login"] as const,
  register: () => [...authKeys.all, "register"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
  requestReset: () => [...authKeys.all, "requestReset"] as const,
  resetPassword: () => [...authKeys.all, "resetPassword"] as const,
  verifyEmail: () => [...authKeys.all, "verifyEmail"] as const,
} as const;

/*
 * ========================================
 * INVALIDATIONS
 * ========================================
 */
export const invalidations = {
  clearCache: () => [[]],
};

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const useMe = () =>
  useQuery<UserResult, ApiClientError>({
    queryKey: authKeys.me(),
    queryFn: () => authApi.getMe(),
  });

/*
 * ========================================
 * MUTATIONS
 * ========================================
 */
export const useAuthMutations = () => {
  const login = useAppMutation<UserResult, ApiClientError, LoginRequest>({
    mutationFn: (credentials) => authApi.login(credentials),
    messages: {
      success: (data) => {
        const user = data.data;
        return `Welcome back, ${user.name || "friend"}!`;
      },
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Login failed. Please check your credentials.",
    },
  });

  const register = useAppMutation<UserResult, ApiClientError, RegisterRequest>({
    mutationFn: (userAttrs) => authApi.register(userAttrs),
    messages: {
      success: (data) => `Account created for ${data.data.email}`,
      error: (err) =>
        err.errors?.[0]?.detail ?? "Registration failed. Please try again.",
    },
  });

  const logout = useAppMutation<void, ApiClientError, void>({
    mutationFn: () => authApi.logout(),
    messages: {
      success: "Logged out successfully!",
      error: (err) => err.errors?.[0]?.detail ?? "Logout failed.",
    },
    invalidates: invalidations.clearCache(),
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  const requestReset = useAppMutation<
    ResetPasswordResult,
    ApiClientError,
    { email: string }
  >({
    mutationFn: ({ email }) => authApi.requestReset(email),
    messages: {
      success: "If an account matches, a recovery link will be dispatched shortly.",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to request password reset. Please try again.",
    },
  });

  const resetPassword = useAppMutation<
    void,
    ApiClientError,
    { token: string; password: string }
  >({
    mutationFn: ({ token, password }) => authApi.resetPassword(token, password),
    messages: {
      success: "Password has been reset successfully!",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to reset password. The link may have expired.",
    },
  });

  const verifyEmail = useAppMutation<void, ApiClientError, { token: string }>({
    mutationFn: ({ token }) => authApi.verifyEmail(token),
    messages: {
      success: "Email verified successfully!",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to verify email. The link may have expired.",
    },
  });

  return {
    login,
    register,
    logout,
    requestReset,
    resetPassword,
    verifyEmail,
  };
};

export function useLogin() {
  const { login } = useAuthMutations();
  return login;
}

export function useRegister() {
  const { register } = useAuthMutations();
  return register;
}

export function useLogout() {
  const { logout } = useAuthMutations();
  return logout;
}

export function useRequestReset() {
  const { requestReset } = useAuthMutations();
  return requestReset;
}

export function useResetPassword() {
  const { resetPassword } = useAuthMutations();
  return resetPassword;
}

export function useVerifyEmail() {
  const { verifyEmail } = useAuthMutations();
  return verifyEmail;
}
