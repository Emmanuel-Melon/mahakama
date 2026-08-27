import { StylizedList } from "~/components/ui/stylized-list";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import {
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  GraduationCap,
} from "lucide-react";

export const EducationSection = () => {
  const educationItems = [
    "LLM in International Human Rights Law - University of London (2015)",
    "LLB (Hons) - University of Nairobi (2011)",
    "Certificate in Criminal Justice - The Hague Academy (2013)",
  ];

  return (
    <CardWithLabel
      label="Education"
      labelClassName="text-xs font-mono text-gray-500"
    >
      <div className="py-2">
        <StylizedList
          items={educationItems.map((text) => ({ text }))}
          itemClassName="group"
          defaultIcon={GraduationCap}
          renderItem={(item) => (
            <span className="text-gray-800 group-hover:text-gray-900">
              {item.text}
            </span>
          )}
        />
      </div>
    </CardWithLabel>
  );
};

export const StyledContactList = ({
  email,
  phone,
  location,
}: {
  email?: string;
  phone?: string;
  location?: string;
}) => {
  return (
    <StylizedList
      items={[
        {
          text: email || "contact@example.com",
          icon: MailIcon,
          href: email ? `mailto:${email}` : undefined,
        },
        {
          text: phone || "+1 (234) 567-890",
          icon: PhoneIcon,
          href: phone ? `tel:${phone}` : undefined,
        },
        {
          text: location || "Nairobi, Kenya",
          icon: MapPinIcon,
        },
      ]}
      itemClassName="group"
      renderItem={(item) => {
        const content = (
          <span className="text-gray-800 group-hover:text-gray-900">
            {item.text}
          </span>
        );

        return item.href ? (
          <a
            href={item.href}
            className="text-blue-600 hover:underline hover:text-blue-700"
          >
            {content}
          </a>
        ) : (
          content
        );
      }}
    />
  );
};
