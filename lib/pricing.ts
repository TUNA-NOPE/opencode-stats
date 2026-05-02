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
  // Kimi Models (OpenCode Zen)
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
  // Kimi Models (Direct API)
  {
    id: 'kimi/k2-6',
    name: 'kimi-k2.6 (flagship)',
    provider: 'Kimi',
    inputPrice: 0.95,
    outputPrice: 4.00,
    cachedReadPrice: 0.16,  // Cache hit: $0.16 (83% cheaper!)
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  {
    id: 'kimi/k2-5',
    name: 'kimi-k2.5',
    provider: 'Kimi',
    inputPrice: 0.60,
    outputPrice: 3.00,
    cachedReadPrice: 0.10,  // Cache hit: $0.10 (83% cheaper!)
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  {
    id: 'kimi/k2-turbo',
    name: 'kimi-k2-turbo',
    provider: 'Kimi',
    inputPrice: 1.15,
    outputPrice: 8.00,
    cachedReadPrice: 0.15,  // Cache hit: $0.15 (87% cheaper!)
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  {
    id: 'kimi/k2-thinking',
    name: 'kimi-k2-thinking',
    provider: 'Kimi',
    inputPrice: 0.60,
    outputPrice: 2.50,
    cachedReadPrice: 0.15,  // Cache hit: $0.15 (75% cheaper!)
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  {
    id: 'kimi/moonshot-v1-8k',
    name: 'moonshot-v1-8k',
    provider: 'Kimi',
    inputPrice: 0.20,
    outputPrice: 2.00,
    cachedReadPrice: 0.20,  // No cache discount mentioned
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  {
    id: 'kimi/moonshot-v1-32k',
    name: 'moonshot-v1-32k',
    provider: 'Kimi',
    inputPrice: 1.00,
    outputPrice: 3.00,
    cachedReadPrice: 1.00,
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  {
    id: 'kimi/moonshot-v1-128k',
    name: 'moonshot-v1-128k',
    provider: 'Kimi',
    inputPrice: 2.00,
    outputPrice: 5.00,
    cachedReadPrice: 2.00,
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  // FirePass (Fireworks AI) - Kimi Models
  // NOTE: This model has UNLIMITED subscription pricing: $7/week (~$30/month)
  // Token prices are effectively $0 for subscribers
  {
    id: 'firepass/kimi-k2-5-turbo',
    name: 'Kimi K2.5 Turbo',
    provider: 'FirePass Unlimited',
    inputPrice: 0,
    outputPrice: 0,
    cachedReadPrice: 0,
    cachedWritePrice: 0,
    contextWindow: 256000,
    subscriptionCost: 7.00, // Weekly flat rate
    subscriptionPeriod: 'week',
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
  // Qwen Models - OpenRouter pricing (most competitive)
  // Note: Pricing varies by provider - OpenRouter, Together AI, Alibaba Cloud
  {
    id: 'opencode/qwen-3-6-plus',
    name: 'Qwen 3.6 Plus',
    provider: 'OpenCode Zen',
    inputPrice: 0.325,
    outputPrice: 1.95,
    cachedReadPrice: 0.05,
    cachedWritePrice: 0.625,
    contextWindow: 128000,
  },
  {
    id: 'opencode/qwen-3-5-flash',
    name: 'Qwen 3.5 Flash',
    provider: 'OpenCode Zen',
    inputPrice: 0.065,
    outputPrice: 0.26,
    cachedReadPrice: 0.01,
    cachedWritePrice: 0.125,
    contextWindow: 128000,
  },
  {
    id: 'opencode/qwen-3-5-9b',
    name: 'Qwen 3.5 9B',
    provider: 'OpenCode Zen',
    inputPrice: 0.10,
    outputPrice: 0.15,
    cachedReadPrice: 0.02,
    cachedWritePrice: 0.25,
    contextWindow: 128000,
  },
  {
    id: 'opencode/qwen-3-5-plus',
    name: 'Qwen 3.5 Plus',
    provider: 'OpenCode Zen',
    inputPrice: 0.40,
    outputPrice: 2.40,
    cachedReadPrice: 0.04,
    cachedWritePrice: 0.50,
    contextWindow: 128000,
  },
  {
    id: 'opencode/qwen-3-235b-a22b',
    name: 'Qwen3-235B-A22B-Instruct',
    provider: 'OpenCode Zen',
    inputPrice: 0.071,
    outputPrice: 0.10,
    cachedReadPrice: 0.014,
    cachedWritePrice: 0.18,
    contextWindow: 128000,
  },
  {
    id: 'opencode/qwen-3-coder-30b-a3b',
    name: 'Qwen3-Coder-30B-A3B',
    provider: 'OpenCode Zen',
    inputPrice: 0.07,
    outputPrice: 0.27,
    cachedReadPrice: 0.014,
    cachedWritePrice: 0.18,
    contextWindow: 160000,
  },
  {
    id: 'opencode/qwen-3-coder-480b-a35b',
    name: 'Qwen3-Coder-480B-A35B',
    provider: 'OpenCode Zen',
    inputPrice: 0.22,
    outputPrice: 1.80,
    cachedReadPrice: 0.044,
    cachedWritePrice: 0.55,
    contextWindow: 262000,
  },
  {
    id: 'opencode/qwen-3-coder-next',
    name: 'Qwen3-Coder-Next',
    provider: 'OpenCode Zen',
    inputPrice: 0.12,
    outputPrice: 0.80,
    cachedReadPrice: 0.024,
    cachedWritePrice: 0.30,
    contextWindow: 262000,
  },
  // Replicate AI - Model Hosting Platform (NOT direct provider)
  // IMPORTANT: Replicate adds infrastructure overhead - prices match or exceed direct providers
  {
    id: 'replicate/claude-sonnet-4-5',
    name: 'Claude 4.5 Sonnet (Replicate)',
    provider: 'Replicate',
    inputPrice: 3.00,
    outputPrice: 15.00,
    cachedReadPrice: 0.30,  // Estimated based on 10% of input
    cachedWritePrice: 3.75,
    contextWindow: 200000,
  },
  {
    id: 'replicate/deepseek-r1',
    name: 'DeepSeek R1 (Replicate)',
    provider: 'Replicate',
    inputPrice: 3.75,
    outputPrice: 10.00,
    cachedReadPrice: 0.375,  // Estimated based on 10% of input
    cachedWritePrice: 4.69,
    contextWindow: 128000,
  },
  {
    id: 'replicate/llama-3-70b',
    name: 'Llama 3 70B (Replicate A100)',
    provider: 'Replicate',
    inputPrice: 1.40,  // Per-second GPU: $0.0014/sec on A100 ≈ $5.04/hr
    outputPrice: 5.04,
    cachedReadPrice: 0.14,
    cachedWritePrice: 1.75,
    contextWindow: 8192,
  },

  // Cloudflare Workers AI Models
  // Pricing: $0.011 per 1,000 Neurons (unique billing metric)
  // Free tier: 10,000 Neurons/day
  // Best Value Models (cheapest options)
  {
    id: 'cloudflare/granite-4-0-h-micro',
    name: 'Granite 4.0 H Micro (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.017,
    outputPrice: 0.112,
    cachedReadPrice: 0.017,  // No caching discount mentioned
    cachedWritePrice: 0,
    contextWindow: 128000,
  },
  {
    id: 'cloudflare/llama-3-2-1b-instruct',
    name: 'Llama 3.2 1B Instruct (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.027,
    outputPrice: 0.201,
    cachedReadPrice: 0.027,
    cachedWritePrice: 0,
    contextWindow: 60000,
  },
  {
    id: 'cloudflare/llama-3-1-8b-fp8-fast',
    name: 'Llama 3.1 8B FP8 Fast (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.045,
    outputPrice: 0.384,
    cachedReadPrice: 0.045,
    cachedWritePrice: 0,
    contextWindow: 131072,
  },
  {
    id: 'cloudflare/glm-4-7-flash',
    name: 'GLM 4.7 Flash (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.060,
    outputPrice: 0.400,
    cachedReadPrice: 0.060,
    cachedWritePrice: 0,
    contextWindow: 131072,
  },
  // Performance Models
  {
    id: 'cloudflare/kimi-k2-5',
    name: 'Kimi K2.5 (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.600,
    outputPrice: 3.000,
    cachedReadPrice: 0.600,
    cachedWritePrice: 0,
    contextWindow: 256000,
  },
  {
    id: 'cloudflare/kimi-k2-6',
    name: 'Kimi K2.6 (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.950,
    outputPrice: 4.000,
    cachedReadPrice: 0.950,
    cachedWritePrice: 0,
    contextWindow: 262000,
  },
  {
    id: 'cloudflare/llama-3-3-70b-fp8-fast',
    name: 'Llama 3.3 70B FP8 Fast (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.293,
    outputPrice: 2.253,
    cachedReadPrice: 0.293,
    cachedWritePrice: 0,
    contextWindow: 24000,
  },
  {
    id: 'cloudflare/mistral-small-3-1-24b',
    name: 'Mistral Small 3.1 24B (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.351,
    outputPrice: 0.555,
    cachedReadPrice: 0.351,
    cachedWritePrice: 0,
    contextWindow: 128000,
  },
  // Coding Specialists
  {
    id: 'cloudflare/qwen2-5-coder-32b',
    name: 'Qwen2.5 Coder 32B (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.660,
    outputPrice: 1.000,
    cachedReadPrice: 0.660,
    cachedWritePrice: 0,
    contextWindow: 128000,
  },
  {
    id: 'cloudflare/deepseek-r1-distill-32b',
    name: 'DeepSeek R1 Distill 32B (Cloudflare)',
    provider: 'Cloudflare',
    inputPrice: 0.497,
    outputPrice: 4.881,
    cachedReadPrice: 0.497,
    cachedWritePrice: 0,
    contextWindow: 80000,
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
