import type { Route } from "./+types/about";
import { AboutScreen } from "~/feature/website/screens/AboutScreen";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "About Mahakama - Empowering East Africa with Legal Knowledge" },
    {
      name: "description",
      content:
        "Learn how Mahakama is democratizing legal access in South Sudan and Uganda through AI-powered legal assistance. Our mission is to make legal knowledge free and understandable for everyone.",
    },
    {
      name: "keywords",
      content:
        "about Mahakama, legal empowerment Africa, free legal information South Sudan, Uganda legal rights, legal education, law in East Africa, legal technology",
    },
    {
      name: "og:title",
      content: "About Mahakama - Legal Empowerment for East Africa",
    },
    {
      name: "og:description",
      content:
        "Discover how Mahakama is transforming legal access in South Sudan and Uganda with free, easy-to-understand legal information powered by AI technology.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "About Mahakama - Legal Knowledge for Everyone",
    },
    {
      name: "twitter:description",
      content:
        "Empowering citizens in South Sudan and Uganda with free, accessible legal information through AI technology.",
    },
  ];
}
export default AboutScreen;