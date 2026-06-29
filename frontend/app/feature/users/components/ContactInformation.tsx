import {
  ContactInformation as UniversalContactInformation,
  type ContactItem,
} from "~/components/contact-information";
import { formatDate } from "~/utils/time";

import type { User } from "~/feature/users/screens/ProfileScreen";

interface ContactInformationProps {
  user: User;
}

export const ContactInformation = ({ user }: ContactInformationProps) => {
  const contactItems: ContactItem[] = [
    {
      type: "email",
      label: "Email Address",
      value: user?.email || "Not provided",
    },
  ];

  if (user?.phoneNumber) {
    contactItems.push({
      type: "phone",
      label: "Phone Number",
      value: user.phoneNumber,
    });
  }

  if (user?.city || user?.country) {
    contactItems.push({
      type: "location",
      label: "Location",
      value:
        [user.city, user.country].filter(Boolean).join(", ") || "Not provided",
    });
  }

  contactItems.push({
    type: "date",
    label: "Member Since",
    value: formatDate(user?.createdAt || ""),
  });

  return (
    <UniversalContactInformation
      title="Contact Information"
      description="Your current contact details and account information."
      contactItems={contactItems}
    />
  );
};
