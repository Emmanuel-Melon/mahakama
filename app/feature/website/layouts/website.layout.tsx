import { Outlet } from "react-router";
import { Footer } from "~/layouts/footer";
import { FAQSection } from "~/components/faq";

export default function WebsiteLayout(props: any) {
    return (
        <div className="min-h-screen">
            <Outlet />
            <FAQSection />
            <Footer />
        </div>
    );
}
