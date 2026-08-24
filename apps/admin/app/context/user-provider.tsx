import { createContext, useContext } from "react";
import type { User } from "@mah/api/src/clients/users.api";
import { useAuthMutations } from "@mah/api/src/hooks/use-auth";

type UserContextType = {
  user: User | null;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const { logout: logoutMutation } = useAuthMutations();

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <UserContext.Provider
      value={{
        user,
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
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
