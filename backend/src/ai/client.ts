import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// Claude API Client – thin wrapper with retry, mock mode & error handling
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const DEFAULT_MAX_TOKENS = 4096;
const MODEL = "claude-sonnet-4-20250514";

let client: Anthropic | null = null;

export function getClient(): Anthropic | null {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
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
  isMock?: boolean;
}

/**
 * Call Claude with automatic retry (exponential back-off).
 * Returns raw text response or throws error if all retries fail.
 */
export async function callClaude(
  request: ClaudeRequest
): Promise<ClaudeResponse> {
  const anthropic = getClient();
  if (!anthropic) {
    throw new Error(
      "CLAUDE_API_KEY is not configured. Add it to .env or use deterministic fallback."
    );
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: MODEL,
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
          `[AI Client] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}. Retrying in ${delayMs}ms...`
        );
        await delay(delayMs);
      }
    }
  }

  throw new Error(
    `Claude API failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`
  );
}
