import { LLMMessage, LLMProvider } from "./llms.types";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export interface FormattedRequest {
  messages: any;
  options: Record<string, any>;
}

export function formatMessagesForProvider(
  provider: LLMProvider,
  messages: LLMMessage[],
  options: {
    systemPrompt?: string;
    responseSchema?: z.ZodSchema<any>;
    responseFormat?: "text" | "json";
    [key: string]: any;
  } = {},
): FormattedRequest {
  const { systemPrompt, responseSchema, responseFormat, ...otherOptions } =
    options;
  const baseOptions: Record<string, any> = { ...otherOptions };

  if (responseSchema) {
    const jsonSchema = zodToJsonSchema(responseSchema);
    if (provider === "gemini") {
      baseOptions.responseMimeType = "application/json";
      baseOptions.responseJsonSchema = jsonSchema;
    } else if (provider === "ollama") {
      baseOptions.responseSchema = jsonSchema;
      baseOptions.responseFormat = "json";
    }
  } else if (responseFormat) {
    baseOptions.responseFormat = responseFormat;
  }

  let formattedMessages: any;
  switch (provider) {
    case "gemini": {
      const messageTexts = messages.map((msg) => {
        const prefix = msg.role === "assistant" ? "Assistant" : "User";
        return `${prefix}: ${msg.content}`;
      });

      let fullContent = messageTexts.join("\n\n");
      if (systemPrompt) {
        fullContent = `System: ${systemPrompt}\n\n${fullContent}`;
      }

      return {
        messages: fullContent,
        options: baseOptions,
      };
    }

    case "ollama": {
      const formatted = [...messages];

      if (systemPrompt) {
        formatted.unshift({
          role: "system",
          content: systemPrompt,
        });
      }

      return {
        messages: formatted,
        options: baseOptions,
      };
    }

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export function buildRequestConfig(
  provider: LLMProvider,
  messages: any,
  options: Record<string, any> = {},
): any {
  switch (provider) {
    case "gemini": {
      return {
        contents: [
          {
            role: "user",
            parts: [{ text: messages }], // messages is a string for Gemini
          },
        ],
        ...options,
      };
    }

    case "ollama": {
      return {
        messages, // messages is an array for Ollama
        ...options,
      };
    }

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors?: z.ZodError[];
  parsedData?: any;
}

export class SchemaValidator {
  /**
   * Validate content against a Zod schema
   */
  static validateContent(
    content: string,
    schema?: z.ZodSchema<any>,
  ): SchemaValidationResult {
    if (!schema) {
      return { isValid: true, parsedData: content };
    }

    try {
      // Try to parse as JSON first
      let data;
      try {
        data = JSON.parse(content);
      } catch {
        // If not JSON, use raw content
        data = content;
      }

      const parsedData = schema.parse(data);
      return { isValid: true, parsedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, errors: [error] };
      }
      return { isValid: false, errors: [] };
    }
  }

  /**
   * Convert Zod schema to JSON schema for inclusion in prompts
   */
  static schemaToJSON(schema: z.ZodSchema<any>): object {
    return zodToJsonSchema(schema);
  }

  /**
   * Generate a system prompt for schema validation
   */
  static generateSchemaPrompt(schema: z.ZodSchema<any>): string {
    const jsonSchema = this.schemaToJSON(schema);

    return `You MUST format your response as JSON that matches the following schema:\n\n${JSON.stringify(jsonSchema, null, 2)}\n\nEnsure the output is valid JSON and conforms exactly to this structure.`;
  }

  static generateTypeScriptDefinition(schema: z.ZodSchema<any>): string {
    // This is a simplified version - you might want to enhance this
    // based on your specific schema types
    const jsonSchema = zodToJsonSchema(schema);
    return `Your response must be valid JSON matching this structure:\n\`\`\`typescript\n${JSON.stringify(jsonSchema, null, 2)}\n\`\`\``;
  }
}
