---
layout: base.njk
title: Large Language Model (LLM) Module
description: Comprehensive API documentation for the Large Language Model (LLM) module.
permalink: /llm-reference/
---

# Overview

The LLM module provides a unified interface for interacting with various Large Language Model providers like Google's Gemini and Ollama. It offers a consistent API for generating text content, handling different response formats, and managing provider-specific configurations.

## Architecture

The LLM module follows a provider-based architecture with the following key components:

1. **LLMProviderManager**: Manages multiple LLM providers and routes requests to the appropriate provider.
2. **Provider Implementations**: Individual implementations for each supported LLM provider (Gemini, Ollama).
3. **Type Definitions**: Shared types and interfaces for consistent interaction with different providers.
4. **Configuration**: Centralized configuration for LLM providers and models.

## Supported Providers

### 1. Gemini (Google)

**Configuration Options:**
- `apiKey`: Google API key for authentication
- `model`: Model to use (default: "gemini-2.5-flash")
- `authType`: Authentication type ("api_key" or "vertexai")
- `projectId`: Required for Vertex AI authentication
- `location`: Required for Vertex AI authentication

**Available Models:**
- gemini-2.5-pro
- gemini-2.5-flash
- gemini-1.5-pro
- gemini-1.5-flash

### 2. Ollama

**Configuration Options:**
- `host`: URL of the Ollama server
- `model`: Model to use (default: "gemma3:1b")

**Available Models:**
- gemma3:1b (default)

## Core Interfaces

### ILLMProvider

```typescript
interface ILLMProvider<TProvider extends LLMProviderName> {
  provider: TProvider;
  model?: string;
  systemPrompt?: string;

  generateTextContent<T = string>(
    prompt: string,
    config?: GeminiOutputConfig,
  ): Promise<LLMResponse<T>>;

  setSystemPrompt(systemPrompt: string): void;
  getSystemPrompt(): string | undefined;
}
```

### LLMResponse

```typescript
interface LLMResponse<T = any> {
  content: T;
  provider: LLMProviderName;
  contentType: "text" | "structured";
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

## Usage Examples

### Initialization

```typescript
import { llmProviderManager } from "@/lib/llm";

// Basic usage with default provider (Ollama)
const response = await llmProviderManager.generateTextContent("Hello, world!");

// Using a specific provider
const geminiResponse = await llmProviderManager
  .getProvider("gemini")
  .generateTextContent("Hello from Gemini!");
```

### Text Generation

```typescript
// Basic text generation
const response = await llmProviderManager.generateTextContent(
  "Write a short poem about AI",
);

// With system prompt
const provider = llmProviderManager.getProvider("ollama");
provider.setSystemPrompt("You are a helpful assistant that speaks like Shakespeare.");
const shakespeareResponse = await provider.generateTextContent("Tell me about the weather");
```

### Structured Output

```typescript
import { z } from "zod";

// Define output schema
const recipeSchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  prepTime: z.number(),
  cookTime: z.number(),
});

// Generate structured content
const recipe = await llmProviderManager.generateTextContent(
  "Provide a simple pasta recipe",
  {
    outputType: "structured",
    responseJsonSchema: recipeSchema,
  }
);

console.log(recipe.content.title); // Type-safe access to structured data
```

## Error Handling

The LLM module defines specific error types for common LLM-related issues:

- `CONTEXT_WINDOW_EXCEEDED`: Input exceeds model's maximum token limit
- `RATE_LIMIT_REACHED`: API rate limit exceeded
- `SAFETY_VIOLATION`: Content violates safety filters
- `INVALID_MODEL`: Specified model doesn't exist
- `INSUFFICIENT_QUOTA`: API quota exceeded

```typescript
try {
  const response = await llmProviderManager.generateTextContent(prompt);
} catch (error) {
  if (error.code === "RATE_LIMIT_REACHED") {
    // Handle rate limiting
  }
  // Handle other error types
}
```

## Configuration

The LLM module can be configured via environment variables and the application config:

```typescript
// Example configuration
{
  llm: {
    defaultProvider: "ollama",
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-2.5-flash"
    },
    ollama: {
      url: "http://localhost:11434",
      model: "gemma3:1b"
    }
  }
}
```

## Best Practices

1. **Provider Selection**: Use the provider manager to easily switch between providers based on requirements.
2. **Structured Output**: Always use structured output with Zod schemas when you need consistent data formats.
3. **Error Handling**: Implement proper error handling for LLM-specific errors.
4. **Rate Limiting**: Implement retry logic with exponential backoff for rate-limited requests.
5. **Caching**: Consider implementing caching for frequent, deterministic queries.

## Extending with New Providers

To add a new LLM provider:

1. Create a new provider class that implements `ILLMProvider`
2. Add provider configuration in `llm.config.ts`
3. Update the `LLMProviderManager` to initialize the new provider

```typescript
class NewProvider implements ILLMProvider<"new_provider"> {
  // Implement required methods
}

// In LLMProviderManager
if (config.newProvider) {
  providers.set("new_provider", new NewProvider(config.newProvider));
}
```