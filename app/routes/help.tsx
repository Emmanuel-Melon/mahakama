import type { Route } from "./+types/about";
import { CardWithLabel } from "~/components/ui/card-with-label";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Help & Support - Mahakama" },
    {
      name: "description",
      content: "Get help and support for using Mahakama's legal assistance platform.",
    },
  ];
}

export default function HelpScreen() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <CardWithLabel label="help" className="mt-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-lg">
            We're working hard to bring you the best legal assistance experience. Our help center is coming soon!
          </p>
          <p>
            In the meantime, if you need assistance, please don't hesitate to contact our support team.
          </p>
        </div>
      </CardWithLabel>
    </div>
  );
}