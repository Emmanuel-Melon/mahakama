import { Outlet } from "react-router";
import { MarketingHeader } from "@mah/ui/components/organisms/MarketingHeader";
import { MarketingFooter } from "@mah/ui/components/organisms/MarketingFooter";

interface WebsiteLayoutProps {
  children?: React.ReactNode;
}

export const WebsiteLayout = ({ children }: WebsiteLayoutProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <MarketingHeader />
      <main className="flex-1">{children || <Outlet />}</main>
      <MarketingFooter />
    </div>
  );
};
