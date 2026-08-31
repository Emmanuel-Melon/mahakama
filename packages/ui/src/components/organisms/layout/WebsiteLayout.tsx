import { Outlet } from "react-router";
import { MarketingHeader } from "../www/MarketingHeader";
import { MarketingFooter } from "../www/MarketingFooter";

interface WebsiteLayoutProps {
  user?: { name?: string | null } | null;
  children?: React.ReactNode;
}

export const WebsiteLayout = ({ user, children }: WebsiteLayoutProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <MarketingHeader user={user} />
      <main className="flex-1">{children || <Outlet />}</main>
      <MarketingFooter />
    </div>
  );
};
