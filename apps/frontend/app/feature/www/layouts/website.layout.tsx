import { Outlet } from "react-router";
import { Footer } from "~/layouts/footer";
import { FAQSection } from "@mah/ui";

export default function WebsiteLayout(props: any) {
  return (
    <div>
      <Outlet />
      <FAQSection />
      <Footer />
    </div>
  );
}
