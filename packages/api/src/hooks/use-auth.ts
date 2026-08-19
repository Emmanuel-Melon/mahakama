import {
  authApi,
  type UserResult,
  type LoginRequest,
  type RegisterRequest,
} from "../clients/auth.api";
import type { ApiClientError } from "../api/api.errors";
import { useAppMutation } from "../react-query/react-query.utils";

export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  register: () => [...authKeys.all, "register"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
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

  return {
    login,
    register,
    logout,
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
