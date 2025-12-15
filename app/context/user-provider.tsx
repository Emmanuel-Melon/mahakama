import { createContext, useContext } from 'react';
import type { User } from '~/lib/api/users.api';
import { useCurrentUser } from '~/feature/users/hooks/use-users';
import { useLogout } from '~/feature/auth/hooks/use-auth';
import { parseCookies } from '~/lib/api/utils';

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, user: initialUser }: { children: React.ReactNode, user: User | null }) {
  const cookies = typeof window !== 'undefined' ? parseCookies(document.cookie) : {};
  const token = cookies.token;

  const { data: user, isLoading, error } = useCurrentUser(token);
  const logoutMutation = useLogout();

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <UserContext.Provider
      value={{
        user: user || initialUser,
        isLoading,
        error,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}