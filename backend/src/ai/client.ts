import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { SYSTEM_PROMPT } from './prompts.js';

let anthropicClient: Anthropic | null = null;

if (config.claudeApiKey) {
  try {
    anthropicClient = new Anthropic({
      apiKey: config.claudeApiKey,
    });
    logger.info('[AI] Anthropic Claude client initialized successfully.');
  } catch (err) {
    logger.warn('[AI] Failed to initialize Anthropic client, using fallback AI mode:', err);
  }
} else {
  logger.info('[AI] No CLAUDE_API_KEY detected in environment. Running with resilient offline AI fallback.');
}

export async function queryAI(prompt: string, timeoutMs = 12000): Promise<string | null> {
  if (!anthropicClient) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await anthropicClient.messages.create(
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      { signal: controller.signal }
    );

    clearTimeout(timer);

    const firstBlock = response.content[0];
    if (firstBlock && firstBlock.type === 'text') {
      return firstBlock.text;
    }

    return null;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      logger.warn(`[AI] Claude API request timed out after ${timeoutMs}ms. Using deterministic fallback.`);
    } else {
      logger.warn('[AI] Error querying Claude API:', error.message || error);
    }
    return null;
  }
}
