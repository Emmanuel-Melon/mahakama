import { Button } from "~/components/ui/button";
import { Pencil, User as UserIcon } from "lucide-react";

import type { User } from "~/feature/users/screens/ProfileScreen";

interface ProfileHeaderProps {
  user: User;
  onEditProfile: () => void;
}

export const ProfileHeader = ({ user, onEditProfile }: ProfileHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="md:hidden flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-foreground bg-background text-2xl font-bold">
          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center gap-3">
            <UserIcon className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">{user?.name || user?.email || 'User'}</h1>
          </div>
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full border border-muted-foreground" />
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"} Account
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={onEditProfile}>
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
      <div className="hidden md:flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-foreground bg-background text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="mb-1 flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">{user?.name || user?.email || 'User'}</h1>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full border border-muted-foreground" />
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"} Account
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={onEditProfile}>
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
