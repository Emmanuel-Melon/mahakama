import type { Route } from "./+types/contact";
import { ContactScreen } from "~/feature/www/screens/ContactScreen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us - Mahakama" },
    {
      name: "description",
      content:
        "Get in touch with Mahakama. We're here to help with any questions about our legal services and resources.",
    },
  ];
}

export default ContactScreen;
