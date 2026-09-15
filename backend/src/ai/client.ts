import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ---------------------------------------------------------------------------
// AI Client – supports Claude (production) and Gemini (development/testing)
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const DEFAULT_MAX_TOKENS = 4096;

const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const GEMINI_MODEL = "gemini-1.5-flash";

let claudeClient: Anthropic | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

function getClaudeClient(): Anthropic | null {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("xxxxx")) {
    return null;
  }
  if (!claudeClient) {
    claudeClient = new Anthropic({ apiKey });
  }
  return claudeClient;
}

function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ClaudeRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export interface ClaudeResponse {
  text: string;
  usage?: { inputTokens: number; outputTokens: number };
  provider: "claude" | "gemini" | "mock";
}

/**
 * Determine which AI provider to use based on environment
 * - Production: Claude (with Gemini fallback)
 * - Development: Gemini (with Claude fallback)
 */
function getPreferredProvider(): "claude" | "gemini" | null {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    if (getClaudeClient()) return "claude";
    if (getGeminiClient()) return "gemini";
  } else {
    if (getGeminiClient()) return "gemini";
    if (getClaudeClient()) return "claude";
  }

  return null;
}

/**
 * Call Claude API with retry logic
 */
async function callClaudeAPI(request: ClaudeRequest): Promise<ClaudeResponse> {
  const anthropic = getClaudeClient();
  if (!anthropic) {
    throw new Error("Claude API key not configured");
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: request.maxTokens ?? DEFAULT_MAX_TOKENS,
        system: request.systemPrompt,
        messages: [{ role: "user", content: request.userPrompt }],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("Claude response contained no text content block.");
      }

      return {
        text: textBlock.text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
        provider: "claude",
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (
        err instanceof Anthropic.AuthenticationError ||
        err instanceof Anthropic.PermissionDeniedError
      ) {
        throw lastError;
      }

      if (attempt < MAX_RETRIES) {
        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.warn(
          `[Claude] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}. Retrying in ${delayMs}ms...`
        );
        await delay(delayMs);
      }
    }
  }

  throw new Error(
    `Claude API failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Call Gemini API with retry logic
 */
async function callGeminiAPI(request: ClaudeRequest): Promise<ClaudeResponse> {
  const genAI = getGeminiClient();
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: request.systemPrompt,
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: request.userPrompt }] }],
        generationConfig: {
          maxOutputTokens: request.maxTokens ?? DEFAULT_MAX_TOKENS,
          temperature: 0.7,
        },
      });

      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Gemini response contained no text.");
      }

      return {
        text,
        usage: {
          inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        },
        provider: "gemini",
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < MAX_RETRIES) {
        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.warn(
          `[Gemini] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}. Retrying in ${delayMs}ms...`
        );
        await delay(delayMs);
      }
    }
  }

  throw new Error(
    `Gemini API failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Main AI call function - automatically selects provider based on environment
 * - Development: Gemini first, Claude fallback
 * - Production: Claude first, Gemini fallback
 */
export async function callClaude(request: ClaudeRequest): Promise<ClaudeResponse> {
  const provider = getPreferredProvider();

  if (!provider) {
    throw new Error(
      "No AI API key configured. Set CLAUDE_API_KEY (production) or GEMINI_API_KEY (development) in .env"
    );
  }

  const isProduction = process.env.NODE_ENV === "production";
  console.log(`[AI Client] Using ${provider.toUpperCase()} (env: ${isProduction ? "production" : "development"})`);

  try {
    if (provider === "gemini") {
      return await callGeminiAPI(request);
    } else {
      return await callClaudeAPI(request);
    }
  } catch (primaryErr) {
    // Try fallback provider
    const fallbackProvider = provider === "gemini" ? "claude" : "gemini";
    const hasFallback = fallbackProvider === "gemini" ? getGeminiClient() : getClaudeClient();

    if (hasFallback) {
      console.warn(`[AI Client] ${provider} failed, trying ${fallbackProvider} as fallback...`);
      try {
        if (fallbackProvider === "gemini") {
          return await callGeminiAPI(request);
        } else {
          return await callClaudeAPI(request);
        }
      } catch (fallbackErr) {
        throw new Error(
          `Both AI providers failed. Primary (${provider}): ${primaryErr}. Fallback (${fallbackProvider}): ${fallbackErr}`
        );
      }
    }

    throw primaryErr;
  }
}

/**
 * Check which AI provider is available
 */
export function getAvailableProvider(): { provider: string; isProduction: boolean } | null {
  const provider = getPreferredProvider();
  if (!provider) return null;
  return {
    provider,
    isProduction: process.env.NODE_ENV === "production",
  };
}
