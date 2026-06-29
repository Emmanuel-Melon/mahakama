# 🤖 LLM Integration Guide

This document provides detailed information about integrating and working with Large Language Models (LLMs) in the Mahakama server.

## Table of Contents
- [Overview](#overview)
- [Supported LLM Providers](#supported-llm-providers)
  - [Google Gemini](#google-gemini)
  - [Ollama](#ollama)
- [API Usage](#api-usage)
- [Prompt Engineering](#prompt-engineering)
- [Rate Limiting & Cost Management](#rate-limiting--cost-management)
- [Testing & Evaluation](#testing--evaluation)
- [Best Practices](#best-practices)

## Overview

Mahakama uses LLMs to provide natural language understanding and generation capabilities. The system is designed to work with multiple LLM providers through a unified interface.

## Supported LLM Providers

### Google Gemini

#### Setup
1. Get an API key from [Google AI Studio](https://makersuite.google.com/)
2. Add the API key to your environment:
   ```bash
   GEMINI_API_KEY=your-api-key-here
   ```

#### Configuration
```typescript
// Example configuration in config.ts
const geminIBaseConfig = {
  model: 'gemini-pro',
  temperature: 0.7,
  maxOutputTokens: 2048,
};
```

### Ollama

#### Setup
1. Install Ollama locally: https://ollama.ai/
2. Pull the desired model:
   ```bash
   ollama pull mistral
   ```
3. Start the Ollama server:
   ```bash
   ollama serve
   ```

#### Configuration
```typescript
const ollamaConfig = {
  baseUrl: 'http://localhost:11434',
  model: 'mistral',
  temperature: 0.8,
};
```

## API Usage

### Basic Usage

```typescript
import { llmService } from '../lib/llm';

async function getLegalAdvice(question: string) {
  const prompt = `You are a legal assistant. Answer the following question in plain language:
  
  ${question}`;
  
  const response = await llmService.generateText({
    prompt,
    maxTokens: 1000,
    temperature: 0.7,
  });
  
  return response.text;
}
```

### Streaming Responses

```typescript
const stream = await llmService.streamText({
  prompt: 'Explain the legal concept of...',
  onChunk: (chunk) => {
    // Handle streaming chunks
    console.log(chunk);
  },
});
```

## Prompt Engineering

### Best Practices
1. **Be Specific**: Clearly define the task and expected output format
2. **Provide Context**: Include relevant legal context and constraints
3. **Use Examples**: Include examples of desired outputs
4. **Control Length**: Set appropriate max token limits

### Example Template

```
You are a legal assistant specializing in [SPECIFIC_JURISDICTION] law.

TASK: [CLEARLY_DEFINE_TASK]

CONTEXT:
- [RELEVANT_LAW_1]
- [RELEVANT_LAW_2]

OUTPUT FORMAT:
- Use clear, plain language
- Cite specific laws when possible
- Keep responses under 500 words

QUESTION: [USER_QUESTION]
```

## Rate Limiting & Cost Management

- Implement rate limiting for API endpoints
- Cache common queries
- Monitor token usage and costs
- Set budget alerts for paid providers

## Testing & Evaluation

### Unit Tests
```typescript
describe('LLM Service', () => {
  it('should generate legal advice', async () => {
    const response = await llmService.generateText({
      prompt: 'What are my rights as a tenant?',
    });
    expect(response.text).toBeDefined();
  });
});
```

### Evaluation Metrics
- Response relevance
- Legal accuracy
- Response time
- Token usage

## Best Practices

1. **Error Handling**
   ```typescript
   try {
     const response = await llmService.generateText(/* ... */);
   } catch (error) {
     if (error.rateLimitExceeded) {
       // Handle rate limiting
     }
     // Other error handling
   }
   ```

2. **Caching**
   - Cache common queries
   - Use vector similarity for semantic caching

3. **Monitoring**
   - Track latency and error rates
   - Monitor token usage and costs
   - Log problematic queries for review
