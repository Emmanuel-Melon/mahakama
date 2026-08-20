import { Outlet } from "react-router";
import { Footer } from "~/layouts/footer";
import { FAQSection } from "~/components/molecules/faq";

export default function WebsiteLayout(props: any) {
  return (
    <div>
      <Outlet />
      <FAQSection />
      <Footer />
    </div>
  );
}
