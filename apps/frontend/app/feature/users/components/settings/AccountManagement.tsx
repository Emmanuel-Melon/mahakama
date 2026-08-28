import { Button } from "@mah/ui/components/Button";
import { LogOut, Shield, CreditCard, Settings } from "lucide-react";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import type { User } from "@mah/api/src/clients/users.api";

interface AccountManagementProps {
  user: User;
  onLogout?: () => void;
}

export const AccountManagement = ({
  user,
  onLogout,
}: AccountManagementProps) => {
  return (
    <div className="space-y-6">
      {/* Account Information */}
      <CardWithLabel
        label="Account Information"
        labelClassName="bg-yellow-100 text-yellow-800 font-bold"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Account Type</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "User"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Subscription</p>
              <p className="text-lg font-semibold text-gray-900">Free Tier</p>
              <p className="text-sm text-gray-600">
                Upgrade to Premium for additional features
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Account Status
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.isOnboarded ? "Active" : "Setup Required"}
              </p>
            </div>
          </div>
        </div>
      </CardWithLabel>

      {/* Account Actions */}
      <CardWithLabel
        label="Account Actions"
        labelClassName="bg-red-100 text-red-800 font-bold"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-2 border-gray-900 hover:bg-gray-50"
              style={{
                boxShadow: "2px 2px 0 0 #000",
              }}
            >
              <Settings className="w-4 h-4" />
              Account Settings
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-2 border-gray-900 hover:bg-gray-50"
              style={{
                boxShadow: "2px 2px 0 0 #000",
              }}
            >
              <CreditCard className="w-4 h-4" />
              Billing & Subscription
            </Button>

            <Button
              onClick={onLogout}
              className="w-full justify-start gap-3 bg-red-500 hover:bg-red-600 text-white border-2 border-red-700"
              style={{
                boxShadow: "2px 2px 0 0 #000",
              }}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>
      </CardWithLabel>
    </div>
  );
};
