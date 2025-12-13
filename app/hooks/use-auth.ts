import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi, type LoginRequest, type RegisterRequest, type AuthResponse } from '~/lib/api/auth.api';

export const authKeys = {
    all: ['auth'] as const,
    login: () => [...authKeys.all, 'login'] as const,
    register: () => [...authKeys.all, 'register'] as const,
    logout: () => [...authKeys.all, 'logout'] as const,
};

export function useLogin() {
    return useMutation({
        mutationFn: async (credentials: LoginRequest) => {
            return await authApi.login(credentials);
        },
        onSuccess: (data: AuthResponse) => {
            toast.success('Login successful!');
            // Store token in cookie or localStorage
            if (data.token) {
                document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
            }
        },
        onError: (error) => {
            toast.error('Login failed. Please check your credentials.');
            console.error('Login error:', error);
        },
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: async (userData: RegisterRequest) => {
            return await authApi.register(userData);
        },
        onSuccess: (data: AuthResponse) => {
            toast.success('Registration successful!');
            // Store token in cookie or localStorage
            if (data.token) {
                document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
            }
        },
        onError: (error) => {
            toast.error('Registration failed. Please try again.');
            console.error('Register error:', error);
        },
    });
}

export function useLogout() {
    return useMutation({
        mutationFn: async () => {
            return await authApi.logout();
        },
        onSuccess: () => {
            toast.success('Logged out successfully!');
            // Clear token
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            // Redirect to login or home page
            window.location.href = '/login';
        },
        onError: (error) => {
            toast.error('Logout failed.');
            console.error('Logout error:', error);
        },
    });
}