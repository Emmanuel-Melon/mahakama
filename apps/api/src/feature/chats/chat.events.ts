export const ChatStreamEventTypes = {
  Started: "started",
  RagContext: "rag_context",
  Token: "token",
  Completed: "completed",
  Error: "error",
} as const;

export type ChatStreamEventType =
  (typeof ChatStreamEventTypes)[keyof typeof ChatStreamEventTypes];

export type ChatStreamEvent =
  | {
      type: typeof ChatStreamEventTypes.Started;
      data: {
        chatId: string;
        messageId: string;
        timestamp: string;
      };
    }
  | {
      type: typeof ChatStreamEventTypes.RagContext;
      data: {
        sourcesCount: number;
        chunksCount: number;
      };
    }
  | {
      type: typeof ChatStreamEventTypes.Token;
      data: {
        content: string;
      };
    }
  | {
      type: typeof ChatStreamEventTypes.Completed;
      data: {
        messageId: string;
        content: string;
        citations?: string[];
        sources?: unknown[];
        hasStaleSources?: boolean;
        fabricatedCitations?: string[];
      };
    }
  | {
      type: typeof ChatStreamEventTypes.Error;
      data: {
        message: string;
        code?: string;
        details?: unknown;
      };
    };
