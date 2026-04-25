import { ModelPricing } from '@/types';

// Pricing data from opencode.ai/docs/zen/ (per 1M tokens)
export const DEFAULT_MODELS: ModelPricing[] = [
  // OpenCode Models (from user config)
  {
    id: 'antigravity-claude-opus-4-6-thinking',
    name: 'Claude Opus 4.6 Thinking',
    provider: 'Antigravity',
    inputPrice: 15.00,
    outputPrice: 75.00,
    contextWindow: 200000,
  },
  {
    id: 'antigravity-claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Antigravity',
    inputPrice: 3.00,
    outputPrice: 15.00,
    contextWindow: 200000,
  },
  {
    id: 'antigravity-gemini-3-pro',
    name: 'Gemini 3 Pro',
    provider: 'Antigravity',
    inputPrice: 1.25,
    outputPrice: 10.00,
    contextWindow: 1048576,
  },
  {
    id: 'antigravity-gemini-3-flash',
    name: 'Gemini 3 Flash',
    provider: 'Antigravity',
    inputPrice: 0.075,
    outputPrice: 0.30,
    contextWindow: 1048576,
  },
  {
    id: 'kimi-k2.5-turbo',
    name: 'Kimi K2.5 Turbo',
    provider: 'Fireworks AI',
    inputPrice: 0.50,
    outputPrice: 2.00,
    contextWindow: 256000,
  },
  {
    id: 'minimax-m2.7',
    name: 'MiniMax M2.7',
    provider: 'MiniMax',
    inputPrice: 0.20,
    outputPrice: 0.60,
    contextWindow: 1000000,
  },
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPrice: 2.50,
    outputPrice: 10.00,
    contextWindow: 128000,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputPrice: 0.150,
    outputPrice: 0.600,
    contextWindow: 128000,
  },
  {
    id: 'o3-mini',
    name: 'o3-mini',
    provider: 'OpenAI',
    inputPrice: 1.10,
    outputPrice: 4.40,
    contextWindow: 200000,
  },
  // Anthropic Models
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPrice: 3.00,
    outputPrice: 15.00,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    inputPrice: 15.00,
    outputPrice: 75.00,
    contextWindow: 200000,
  },
  // Google Models
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    inputPrice: 1.25,
    outputPrice: 10.00,
    contextWindow: 1000000,
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    inputPrice: 0.075,
    outputPrice: 0.30,
    contextWindow: 1000000,
  },
];

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  model: ModelPricing
): {
  inputCost: number;
  outputCost: number;
  cacheCost: number;
  totalCost: number;
} {
  // Calculate per 1M tokens
  const inputCost = (inputTokens / 1_000_000) * model.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * model.outputPrice;
  // Assume cache read is 50% of input price (common discount)
  const cacheCost = (cacheReadTokens / 1_000_000) * (model.inputPrice * 0.5);
  
  return {
    inputCost,
    outputCost,
    cacheCost,
    totalCost: inputCost + outputCost + cacheCost,
  };
}

export function compareCosts(
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  models: ModelPricing[] = DEFAULT_MODELS
) {
  return models.map(model => {
    const costs = calculateCost(inputTokens, outputTokens, cacheReadTokens, model);
    return {
      model,
      ...costs,
    };
  }).sort((a, b) => a.totalCost - b.totalCost);
}
