import { ModelPricing } from '@/types';

// Pricing data from https://opencode.ai/docs/zen/ (per 1M tokens)
// Updated: 2025-04-25 with real OpenCode Zen pricing
export const DEFAULT_MODELS: ModelPricing[] = [
  // Claude Models
  {
    id: 'opencode/claude-opus-4-6',
    name: 'Claude Opus 4.6',
    provider: 'OpenCode Zen',
    inputPrice: 5.00,
    outputPrice: 25.00,
    cachedReadPrice: 0.50,
    cachedWritePrice: 6.25,
    contextWindow: 200000,
  },
  {
    id: 'opencode/claude-opus-4-1',
    name: 'Claude Opus 4.1',
    provider: 'OpenCode Zen',
    inputPrice: 15.00,
    outputPrice: 75.00,
    cachedReadPrice: 1.50,
    cachedWritePrice: 18.75,
    contextWindow: 200000,
  },
  {
    id: 'opencode/claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'OpenCode Zen',
    inputPrice: 3.00,
    outputPrice: 15.00,
    cachedReadPrice: 0.30,
    cachedWritePrice: 3.75,
    contextWindow: 200000,
  },
  {
    id: 'opencode/claude-sonnet-4-5',
    name: 'Claude Sonnet 4.5 (≤200K)',
    provider: 'OpenCode Zen',
    inputPrice: 3.00,
    outputPrice: 15.00,
    cachedReadPrice: 0.30,
    cachedWritePrice: 3.75,
    contextWindow: 200000,
  },
  {
    id: 'opencode/claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    provider: 'OpenCode Zen',
    inputPrice: 1.00,
    outputPrice: 5.00,
    cachedReadPrice: 0.10,
    cachedWritePrice: 1.25,
    contextWindow: 200000,
  },
  {
    id: 'opencode/claude-haiku-3-5',
    name: 'Claude Haiku 3.5',
    provider: 'OpenCode Zen',
    inputPrice: 0.80,
    outputPrice: 4.00,
    cachedReadPrice: 0.08,
    cachedWritePrice: 1.00,
    contextWindow: 200000,
  },
  // Gemini Models
  {
    id: 'opencode/gemini-3-1-pro',
    name: 'Gemini 3.1 Pro (≤200K)',
    provider: 'OpenCode Zen',
    inputPrice: 2.00,
    outputPrice: 12.00,
    cachedReadPrice: 0.20,
    cachedWritePrice: 0,
    contextWindow: 200000,
  },
  {
    id: 'opencode/gemini-3-flash',
    name: 'Gemini 3 Flash',
    provider: 'OpenCode Zen',
    inputPrice: 0.50,
    outputPrice: 3.00,
    cachedReadPrice: 0.05,
    cachedWritePrice: 0,
    contextWindow: 1000000,
  },
  // MiniMax Models
  {
    id: 'opencode/minimax-m2-7',
    name: 'MiniMax M2.7',
    provider: 'OpenCode Zen',
    inputPrice: 0.30,
    outputPrice: 1.20,
    cachedReadPrice: 0.06,
    cachedWritePrice: 0.375,
    contextWindow: 1000000,
  },
  {
    id: 'opencode/minimax-m2-5',
    name: 'MiniMax M2.5',
    provider: 'OpenCode Zen',
    inputPrice: 0.30,
    outputPrice: 1.20,
    cachedReadPrice: 0.06,
    cachedWritePrice: 0.375,
    contextWindow: 1000000,
  },
  {
    id: 'opencode/minimax-m2-5-free',
    name: 'MiniMax M2.5 Free',
    provider: 'OpenCode Zen',
    inputPrice: 0,
    outputPrice: 0,
    cachedReadPrice: 0,
    cachedWritePrice: 0,
    contextWindow: 1000000,
  },
  // Kimi Models
  {
    id: 'opencode/kimi-k2-5',
    name: 'Kimi K2.5',
    provider: 'OpenCode Zen',
    inputPrice: 0.60,
    outputPrice: 3.00,
    cachedReadPrice: 0.10,
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  {
    id: 'opencode/kimi-k2-6',
    name: 'Kimi K2.6',
    provider: 'OpenCode Zen',
    inputPrice: 0.95,
    outputPrice: 4.00,
    cachedReadPrice: 0.16,
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  // GPT Models (OpenCode Zen)
  {
    id: 'opencode/gpt-5-5',
    name: 'GPT 5.5 (≤272K)',
    provider: 'OpenCode Zen',
    inputPrice: 5.00,
    outputPrice: 30.00,
    cachedReadPrice: 0.50,
    cachedWritePrice: 0,
    contextWindow: 272000,
  },
  {
    id: 'opencode/gpt-5-4',
    name: 'GPT 5.4 (≤272K)',
    provider: 'OpenCode Zen',
    inputPrice: 2.50,
    outputPrice: 15.00,
    cachedReadPrice: 0.25,
    cachedWritePrice: 0,
    contextWindow: 272000,
  },
  {
    id: 'opencode/gpt-5-4-mini',
    name: 'GPT 5.4 Mini',
    provider: 'OpenCode Zen',
    inputPrice: 0.75,
    outputPrice: 4.50,
    cachedReadPrice: 0.075,
    cachedWritePrice: 0,
    contextWindow: 128000,
  },
  {
    id: 'opencode/gpt-5-4-nano',
    name: 'GPT 5.4 Nano',
    provider: 'OpenCode Zen',
    inputPrice: 0.20,
    outputPrice: 1.25,
    cachedReadPrice: 0.02,
    cachedWritePrice: 0,
    contextWindow: 128000,
  },
  {
    id: 'opencode/gpt-5-3-codex',
    name: 'GPT 5.3 Codex',
    provider: 'OpenCode Zen',
    inputPrice: 1.75,
    outputPrice: 14.00,
    cachedReadPrice: 0.175,
    cachedWritePrice: 0,
    contextWindow: 128000,
  },
  // Qwen Models
  {
    id: 'opencode/qwen-3-6-plus',
    name: 'Qwen 3.6 Plus',
    provider: 'OpenCode Zen',
    inputPrice: 0.50,
    outputPrice: 3.00,
    cachedReadPrice: 0.05,
    cachedWritePrice: 0.625,
    contextWindow: 128000,
  },
  {
    id: 'opencode/qwen-3-5-plus',
    name: 'Qwen 3.5 Plus',
    provider: 'OpenCode Zen',
    inputPrice: 0.20,
    outputPrice: 1.20,
    cachedReadPrice: 0.02,
    cachedWritePrice: 0.25,
    contextWindow: 128000,
  },
  // Free Models
  {
    id: 'opencode/big-pickle',
    name: 'Big Pickle',
    provider: 'OpenCode Zen',
    inputPrice: 0,
    outputPrice: 0,
    cachedReadPrice: 0,
    cachedWritePrice: 0,
    contextWindow: 128000,
  },
];

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  cacheWriteTokens: number,
  model: ModelPricing
): {
  inputCost: number;
  outputCost: number;
  cacheReadCost: number;
  cacheWriteCost: number;
  totalCost: number;
} {
  // Calculate per 1M tokens
  const inputCost = (inputTokens / 1_000_000) * model.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * model.outputPrice;
  // Use actual cached pricing from the model data
  const cacheReadCost = (cacheReadTokens / 1_000_000) * model.cachedReadPrice;
  const cacheWriteCost = (cacheWriteTokens / 1_000_000) * model.cachedWritePrice;
  
  return {
    inputCost,
    outputCost,
    cacheReadCost,
    cacheWriteCost,
    totalCost: inputCost + outputCost + cacheReadCost + cacheWriteCost,
  };
}

export function compareCosts(
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  cacheWriteTokens: number,
  models: ModelPricing[] = DEFAULT_MODELS
) {
  return models.map(model => {
    const costs = calculateCost(inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, model);
    return {
      model,
      ...costs,
    };
  }).sort((a, b) => a.totalCost - b.totalCost);
}
