import { parseCookies } from "./api.utils";

export const getClientToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = parseCookies(document.cookie);
  return cookies.token ?? null;
};

export const parseSSEBlock = <T = unknown>(
  block: string,
): { type: string; data: T } | null => {
  const lines = block.split("\n");
  let type = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.replace(/\r$/, "");
    if (trimmed.startsWith(":")) continue; // comment / keep-alive
    if (trimmed.startsWith("event:")) {
      type = trimmed.slice(6).trim();
    } else if (trimmed.startsWith("data:")) {
      dataLines.push(trimmed.slice(5).trim());
    }
  }

  if (dataLines.length === 0) return null;
  return { type, data: JSON.parse(dataLines.join("\n")) };
};

export async function consumeSSEStream<T>(
  response: Response,
  onEvent: (event: T) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (!response.body) {
    throw new Error("No response body received from the server");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal?.aborted) {
        await reader.cancel();
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const parsed = parseSSEBlock<any>(block);
        if (parsed) {
          onEvent(parsed as T);
        }
        boundary = buffer.indexOf("\n\n");
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function handleSSEFetchError(
  response: Response,
  defaultMsg: string,
): Promise<never> {
  let message = defaultMsg;
  try {
    const errorData = await response.json();
    message =
      errorData.errors?.[0]?.detail || errorData.errors?.[0]?.title || message;
  } catch {
    // Non-JSON error body fallback
  }
  throw new Error(message);
}
