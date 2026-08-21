import { formatDate } from "~/utils/time";
import { BorderedBox } from "~/components/ui/bordered-box";
import type { User } from "@mah/api/src/clients/users.api";

interface AccountStatusCardProps {
  user: User;
}

export const AccountStatusCard = ({ user }: AccountStatusCardProps) => {
  return (
    <BorderedBox
      className="p-6"
      variant="decorated"
      accentColor="bg-yellow-100"
      label="Account Status"
      labelClassName="bg-yellow-100 text-yellow-800 font-bold"
      borderRadius="rounded-tl-2xl rounded-br-2xl"
      gradientFrom="from-white"
      gradientTo="to-gray-50"
    >
      <div className="relative z-10 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Account Status</p>
          <p className="text-lg font-semibold text-gray-900">
            {user?.isOnboarded ? "Onboarded" : "Pending Onboarding"}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Account Type</p>
          <p className="text-lg font-semibold text-gray-900">
            {user?.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : "User"}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Member Since</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatDate(user?.createdAt || "")}
          </p>
        </div>
      </div>
    </BorderedBox>
  );
};
