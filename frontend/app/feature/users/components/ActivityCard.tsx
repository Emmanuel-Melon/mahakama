import { formatDate } from "~/utils/time";
import { BorderedBox } from "~/components/ui/bordered-box";

import type { User } from "~/feature/users/screens/ProfileScreen";

interface ActivityCardProps {
  user: User;
  profileCompletion: number;
}

export const ActivityCard = ({
  user,
  profileCompletion,
}: ActivityCardProps) => {
  return (
    <BorderedBox
      className="p-6"
      variant="decorated"
      accentColor="bg-yellow-100"
      label="Activity"
      labelClassName="bg-yellow-100 text-yellow-800 font-bold"
      borderRadius="rounded-tl-2xl rounded-br-2xl"
      gradientFrom="from-white"
      gradientTo="to-gray-50"
    >
      <div className="relative z-10 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Last Updated</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatDate(user?.updatedAt || "")}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-500">
            Profile Completion
          </p>
          <div className="h-3 w-full rounded-full bg-gray-200 border-2 border-gray-900">
            <div
              className="h-full rounded-full bg-yellow-400"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-700">
            {profileCompletion}% Complete
          </p>
        </div>
      </div>
    </BorderedBox>
  );
};
