import { Outlet } from "react-router";
import { Header } from "~/layouts/header";
import { Footer } from "~/layouts/footer";

interface WebsiteLayoutProps {
  children?: React.ReactNode;
}

export const WebsiteLayout = ({ children }: WebsiteLayoutProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <Header />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}