import { uuidv4 } from "zod";

export const documentData = [
  {
    id: uuidv4(),
    title: "Landlord and Tenant Act 2022",
    description:
      "An Act to provide for the relationship between landlords and tenants, the responsibilities of each party, and the resolution of disputes arising from tenancy agreements in Uganda.",
    type: "Act",
    sections: 120,
    lastUpdated: "2022",
    storageUrl:
      "https://otjbvofzuukzoixvbypm.supabase.co/storage/v1/object/public/dev/Landlord%20Tenant%20Act%20-%202022.pdf",
  },
  {
    id: uuidv4(),
    title: "The Constitution of Uganda",
    description:
      "The supreme law of the Republic of Uganda, establishing the country as a sovereign state, defining its structure, and guaranteeing fundamental rights and freedoms.",
    type: "Constitution",
    sections: 289,
    lastUpdated: "1995",
    storageUrl:
      "https://otjbvofzuukzoixvbypm.supabase.co/storage/v1/object/public/dev/The%20Constitution%20of%20Uganda.pdf",
  },
];
