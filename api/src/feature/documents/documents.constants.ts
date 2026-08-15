import { uuidv4 } from "zod";

export const documentData = [
  {
    id: uuidv4(),
    title: "Landlord and Tenant Act 2022",
    description:
      "An Act to provide for the relationship between landlords and tenants, the responsibilities of each party, and the resolution of disputes arising from tenancy agreements in Uganda.",
    type: "Act",
    sections: 120,
    lastUpdated: "2022-01-01",
    storageUrl: "/uploads/samples/landlord-tenant-act-2022.pdf",
  },
  {
    id: uuidv4(),
    title: "The Constitution of Uganda",
    description:
      "The supreme law of the Republic of Uganda, establishing the country as a sovereign state, defining its structure, and guaranteeing fundamental rights and freedoms.",
    type: "Constitution",
    sections: 289,
    lastUpdated: "1995-01-01",
    storageUrl: "/uploads/samples/constitution-of-uganda.pdf",
  },
];
