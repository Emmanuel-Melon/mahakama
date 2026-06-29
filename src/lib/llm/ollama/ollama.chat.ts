import { ollamaClient } from ".";
import { LLMMessage } from "../llms.types";

export const chat = async (
  messages: LLMMessage[],
  model: string = "gemma3:1b",
) => {
  const response = await ollamaClient.getClient().chat({
    model,
    messages,
  });

  return response;
};

export const generateTitleFromMessage = async (
  message: string,
): Promise<string> => {
  const prompt = `
  Generate a concise, 3-7 word title that summarizes the main topic or question in the following message.
  The title should be in title case and should not include punctuation at the end.
  
  Message: "${message}"
  
  Title: `;

  try {
    const response = await chat([
      {
        role: "system",
        content:
          "You are a helpful assistant that generates concise, descriptive titles for messages.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    let title = response.message.content.trim();
    title = title.replace(/[.,;:!?]+$/, "");
    title = title
      .toLowerCase()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return title || "New Conversation";
  } catch (error) {
    console.error("Error generating title:", error);
    const words = message.split(/\s+/).slice(0, 5).join(" ");
    return words || "New Conversation";
  }
};
