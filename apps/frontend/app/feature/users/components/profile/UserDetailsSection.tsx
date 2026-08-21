import { type FC } from "react";
import { type User } from "@mah/api/src/clients/users.api";

interface UserDetailsSectionProps {
  user: User;
}

export const UserDetailsSection: FC<UserDetailsSectionProps> = ({ user }) => {
  return (
    <div className="mb-8 bg-white rounded-xl border-2 border-gray-900 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">About Me</h2>
      <div className="space-y-3">
        {user?.age && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Age:</span>
            <span className="text-sm text-gray-900">{user.age} years old</span>
          </div>
        )}
        {user?.gender && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Gender:</span>
            <span className="text-sm text-gray-900">
              {user.gender.charAt(0).toUpperCase() +
                user.gender.slice(1).replace("_", " ")}
            </span>
          </div>
        )}
        {user?.occupation && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Occupation:
            </span>
            <span className="text-sm text-gray-900">{user.occupation}</span>
          </div>
        )}
        {user?.bio && (
          <div>
            <span className="text-sm font-medium text-gray-600">Bio:</span>
            <p className="text-sm text-gray-900 mt-1">{user.bio}</p>
          </div>
        )}
        {!user?.age && !user?.gender && !user?.occupation && !user?.bio && (
          <p className="text-sm text-gray-500 italic">
            No additional information provided yet.
          </p>
        )}
      </div>
    </div>
  );
};
