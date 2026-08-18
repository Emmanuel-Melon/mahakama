import { EmbeddingProvider } from "../embeddings.types";

export const createOllamaProvider = (
  baseUrl: string,
  model = "nomic-embed-text",
  dimensions = 768,
): EmbeddingProvider => ({
  name: "ollama",
  model,
  dimensions,
  async embed(texts) {
    // Ollama's embed endpoint takes one string at a time on most versions —
    // batch client-side rather than assuming server-side batching support.
    const results = await Promise.all(
      texts.map(async (text) => {
        const res = await fetch(`${baseUrl}/api/embeddings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, prompt: text }),
        });
        if (!res.ok) {
          throw new Error(`Ollama embedding request failed: ${res.status}`);
        }
        const data = (await res.json()) as { embedding: number[] };
        return data.embedding;
      }),
    );
    return results;
  },
});
