import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../clients/auth.api";
import type { components } from "../generated/api.types";

export type AuthResponse = components["schemas"]["AuthResponse"];
export type JsonApiErrorResponse =
  components["schemas"]["JsonApiErrorResponse"];
export type LoginRequest = components["schemas"]["LoginRequest"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];

export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  register: () => [...authKeys.all, "register"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
};

export function useLogin() {
  return useMutation<AuthResponse, JsonApiErrorResponse, LoginRequest>({
    mutationFn: async (credentials: LoginRequest) => {
      return await authApi.login(credentials);
    },
    onSuccess: (data: AuthResponse) => {
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error("Login failed. Please check your credentials.");
    },
  });
}

export function useRegister() {
  return useMutation<AuthResponse, JsonApiErrorResponse, RegisterRequest>({
    mutationFn: async (userData: RegisterRequest) => {
      return await authApi.register(userData);
    },
    onSuccess: (data: AuthResponse) => {
      toast.success("Registration successful!");
    },
    onError: (error) => {
      toast.error("Registration failed. Please try again.");
      console.error("Register error:", error);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      return await authApi.logout();
    },
    onSuccess: () => {
      toast.success("Logged out successfully!");
      window.location.href = "/login";
    },
    onError: (error) => {
      toast.error("Logout failed.");
    },
  });
}
