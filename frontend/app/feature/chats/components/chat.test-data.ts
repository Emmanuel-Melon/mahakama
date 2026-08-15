import type { ChatMessage } from "~/lib/api/chat.api";

export const testMessages: ChatMessage[] = [
  {
    id: "msg_1",
    chatId: "chat_1",
    content: "Hello! I'm your legal assistant. How can I help you today?",
    senderType: "assistant",
    userId: null,
    timestamp: new Date(Date.now() - 60000).toISOString(),
    metadata: {},
  },
  {
    id: "msg_2",
    chatId: "chat_1",
    content:
      "Hi! I'm having an issue with my landlord. They're trying to evict me without proper notice. What are my rights?",
    senderType: "user",
    userId: "user_1",
    timestamp: new Date(Date.now() - 45000).toISOString(),
    metadata: {},
  },
  {
    id: "msg_3",
    chatId: "chat_1",
    content:
      "I understand your concern. In South Sudan, tenants are protected under the Tenancy Act 2021. Landlords must provide at least 30 days written notice before eviction, unless there's a breach of contract. Could you tell me more about your situation?",
    senderType: "assistant",
    userId: null,
    timestamp: new Date(Date.now() - 30000).toISOString(),
    metadata: {},
  },
  {
    id: "msg_4",
    chatId: "chat_1",
    content:
      "I've been renting for 8 months with a one-year lease. The landlord says they need the apartment for family, but they haven't given any written notice, just a verbal warning.",
    senderType: "user",
    userId: "user_1",
    timestamp: new Date(Date.now() - 15000).toISOString(),
    metadata: {},
  },
  {
    id: "msg_5",
    chatId: "chat_1",
    content:
      "Thank you for the details. Based on South Sudanese tenancy laws, your landlord must provide a written notice of at least 30 days, even if they need the property for personal use. Since you have a fixed-term lease, they cannot force you to leave before the lease ends unless you violate the terms. I recommend requesting everything in writing and keeping records of all communications.",
    senderType: "assistant",
    userId: null,
    timestamp: new Date().toISOString(),
    metadata: {},
  },
];

export const testRelevantLaws = [
  {
    title: "South Sudan Tenancy Act 2021, Section 12(3)",
    description:
      "Requires landlords to provide a minimum of 30 days written notice for eviction in cases of personal use or non-renewal of lease.",
  },
  {
    title: "Housing Rights Act 2019, Article 8",
    description:
      "Protects tenants from unlawful eviction and ensures due process in tenancy termination.",
  },
];

export const testRelatedDocuments = [
  {
    id: 1,
    title: "Sample Notice to Vacate Template",
    description: "A template for landlords to provide proper eviction notice",
    url: "#",
  },
  {
    id: 2,
    title: "Tenant Rights Handbook",
    description: "Comprehensive guide to tenant rights in South Sudan",
    url: "#",
  },
];
