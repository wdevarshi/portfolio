---
title: "Building a Production-Ready Streaming AI Chat with Claude API"
date: "2026-03-29"
excerpt: "A hands-on guide to integrating Claude's API with real-time streaming, tool use, and cost controls — from zero to production in Node.js."
tags: ["AI", "Claude", "Node.js", "Streaming", "API"]
readTime: "12 min read"
---

Most AI chat tutorials show you the happy path: send a message, get a response. That's fine for demos. Real production apps need streaming responses, tool use, cost visibility, error handling, and a sane architecture. This guide covers all of it.

## What We're Building

A streaming chat endpoint in Node.js that:

- Streams tokens as they generate (no waiting for the full response)
- Supports tool use (function calling)
- Tracks token usage per request
- Handles retries on rate limits
- Is ready to drop into an Express or NestJS app

## Prerequisites

- Node.js 18+
- An Anthropic API key (`ANTHROPIC_API_KEY`)
- Basic TypeScript knowledge

```bash
npm install @anthropic-ai/sdk
```

---

## 1. Basic Streaming Response

The difference between streaming and non-streaming is everything when it comes to perceived latency. With a 500-token response, non-streaming waits ~3-5 seconds. Streaming starts showing text in under 300ms.

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function streamResponse(userMessage: string) {
  const stream = await client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: userMessage }],
  });

  // Process tokens as they arrive
  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      process.stdout.write(chunk.delta.text);
    }
  }

  // Get final usage stats after stream completes
  const finalMessage = await stream.finalMessage();
  console.log('\n\nUsage:', finalMessage.usage);
}

streamResponse('Explain how HTTPS works in 3 paragraphs.');
```

The SDK handles SSE (Server-Sent Events) for you. The `stream.finalMessage()` call resolves after all chunks are received and gives you the full response plus token counts.

---

## 2. Exposing Streaming Over HTTP (Server-Sent Events)

The standard pattern for browser clients is SSE — the server pushes chunks as they arrive. Here's a minimal Express handler:

```typescript
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(express.json());

const client = new Anthropic();

app.post('/chat/stream', async (req, res) => {
  const { message, history = [] } = req.body;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      system: 'You are a helpful engineering assistant.',
      messages: [
        ...history,
        { role: 'user', content: message },
      ],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        // SSE format: "data: <payload>\n\n"
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    const final = await stream.finalMessage();

    // Send usage as a final event
    res.write(
      `data: ${JSON.stringify({
        done: true,
        usage: final.usage,
        stopReason: final.stop_reason,
      })}\n\n`
    );
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
  } finally {
    res.end();
  }
});
```

On the frontend, consume it with the native `EventSource` API or the `fetch` API with a `ReadableStream` reader.

---

## 3. Tool Use (Function Calling)

This is where Claude becomes genuinely useful in production. You define tools (functions), Claude decides when to call them, and you execute the function and feed the result back.

Let's build a tool that fetches live stock prices:

```typescript
const tools: Anthropic.Tool[] = [
  {
    name: 'get_stock_price',
    description: 'Get the current price of a stock by ticker symbol.',
    input_schema: {
      type: 'object' as const,
      properties: {
        ticker: {
          type: 'string',
          description: 'The stock ticker symbol, e.g. AAPL, TSLA',
        },
      },
      required: ['ticker'],
    },
  },
];

// Simulated stock fetch — replace with real API call
async function getStockPrice(ticker: string): Promise<number> {
  const prices: Record<string, number> = {
    AAPL: 178.5,
    TSLA: 242.1,
    NVDA: 875.3,
  };
  return prices[ticker.toUpperCase()] ?? 0;
}

async function chatWithTools(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userMessage },
  ];

  // Agentic loop — keep going until Claude stops calling tools
  while (true) {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      tools,
      messages,
    });

    // Add Claude's response to history
    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'end_turn') {
      // No more tool calls — extract and return the final text
      const textBlock = response.content.find((b) => b.type === 'text');
      return textBlock?.type === 'text' ? textBlock.text : '';
    }

    if (response.stop_reason === 'tool_use') {
      // Execute each tool Claude requested
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;

        let result: string;

        if (block.name === 'get_stock_price') {
          const input = block.input as { ticker: string };
          const price = await getStockPrice(input.ticker);
          result = `$${price.toFixed(2)}`;
        } else {
          result = 'Tool not found';
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        });
      }

      // Feed results back to Claude
      messages.push({ role: 'user', content: toolResults });
    }
  }
}

// Test it
chatWithTools('What are the current prices of AAPL and NVDA?')
  .then(console.log);
```

The key insight: **this is a loop**. Claude can call multiple tools in sequence. Each iteration adds to `messages` so Claude has full context.

---

## 4. Tracking Costs

The Anthropic API charges per token. Knowing your costs per request is non-negotiable in production.

Current pricing (as of early 2026):
- Claude Opus: $15 / 1M input tokens, $75 / 1M output tokens
- Claude Sonnet: $3 / 1M input tokens, $15 / 1M output tokens

```typescript
interface UsageReport {
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
  model: string;
}

function calculateCost(
  usage: Anthropic.Usage,
  model: string
): UsageReport {
  const pricing: Record<string, { input: number; output: number }> = {
    'claude-opus-4-6':    { input: 15,  output: 75  },
    'claude-sonnet-4-6':  { input: 3,   output: 15  },
    'claude-haiku-3-5':   { input: 0.8, output: 4   },
  };

  // Normalize model name for lookup
  const key = Object.keys(pricing).find((k) => model.includes(k.split('-').slice(0, 3).join('-')));
  const rates = key ? pricing[key] : { input: 15, output: 75 };

  const costUSD =
    (usage.input_tokens / 1_000_000) * rates.input +
    (usage.output_tokens / 1_000_000) * rates.output;

  return {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    costUSD: parseFloat(costUSD.toFixed(6)),
    model,
  };
}

// Usage
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 512,
  messages: [{ role: 'user', content: 'Summarize TCP/IP in 100 words.' }],
});

const report = calculateCost(response.usage, response.model);
console.log(report);
// { inputTokens: 18, outputTokens: 97, costUSD: 0.000054, model: 'claude-sonnet-4-6' }
```

Log this per request to a database and you'll have full visibility into your AI spend. At scale, this is the difference between a sustainable product and a surprise invoice.

---

## 5. Retry Logic on Rate Limits

The SDK doesn't auto-retry by default. You need to handle `429` errors yourself.

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit =
        err instanceof Anthropic.RateLimitError ||
        (err instanceof Anthropic.APIError && err.status === 429);

      if (!isRateLimit || attempt === maxAttempts) throw err;

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`Rate limited. Retrying in ${delay}ms... (${attempt}/${maxAttempts})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Wrap any API call
const response = await withRetry(() =>
  client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{ role: 'user', content: 'Hello' }],
  })
);
```

---

## 6. System Prompt Engineering for Consistency

The system prompt is your most powerful lever. Keep it tight and specific:

```typescript
const SYSTEM_PROMPT = `You are a senior backend engineer assistant.

Rules:
- Give concrete, runnable code. No pseudocode.
- Use TypeScript unless the user specifies otherwise.
- Prefer async/await over callbacks.
- When showing terminal commands, use $ prefix.
- Never add preamble like "Certainly!" or "Of course!". Get to the point.
- If a question is ambiguous, ask one clarifying question before answering.
`;
```

Specificity beats length. The more concrete your rules, the more consistent the outputs.

---

## Putting It All Together

Here's a production-ready chat client class:

```typescript
export class AIChat {
  private client: Anthropic;
  private history: Anthropic.MessageParam[] = [];
  private systemPrompt: string;
  private model: string;

  constructor(systemPrompt: string, model = 'claude-sonnet-4-6') {
    this.client = new Anthropic();
    this.systemPrompt = systemPrompt;
    this.model = model;
  }

  async send(message: string): Promise<{ text: string; cost: UsageReport }> {
    this.history.push({ role: 'user', content: message });

    const response = await withRetry(() =>
      this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        system: this.systemPrompt,
        messages: this.history,
      })
    );

    const textBlock = response.content.find((b) => b.type === 'text');
    const text = textBlock?.type === 'text' ? textBlock.text : '';

    this.history.push({ role: 'assistant', content: response.content });

    return {
      text,
      cost: calculateCost(response.usage, response.model),
    };
  }

  clearHistory() {
    this.history = [];
  }
}

// Usage
const chat = new AIChat('You are a helpful engineering assistant.');
const { text, cost } = await chat.send('What is the CAP theorem?');
console.log(text);
console.log(`Cost: $${cost.costUSD}`);
```

---

## Key Takeaways

- **Stream by default** — it makes your UI feel 10x more responsive
- **The tool use loop is explicit** — you manage the conversation history yourself
- **Track costs from day one** — surprises at billing time are avoidable
- **System prompts are architecture** — invest time in them like you would any config
- **Retries with backoff** — rate limits happen, especially during development

The full working code for this post is available on [GitHub](https://github.com/wdevarshi).
