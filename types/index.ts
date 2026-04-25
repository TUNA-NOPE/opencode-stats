export interface OpenCodeStats {
  overview: {
    sessions: number;
    messages: number;
    days: number;
  };
  cost: {
    totalCost: number;
    avgCostPerDay: number;
    avgTokensPerSession: number;
    medianTokensPerSession: number;
  };
  tokens: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
  tools: ToolUsage[];
}

export interface ToolUsage {
  name: string;
  calls: number;
  percentage: number;
}

export interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  inputPrice: number;       // per 1M tokens
  outputPrice: number;      // per 1M tokens
  cachedReadPrice: number;  // per 1M tokens (prompt caching read)
  cachedWritePrice: number; // per 1M tokens (prompt caching write)
  contextWindow: number;
}

export interface CostComparison {
  model: ModelPricing;
  estimatedInputCost: number;
  estimatedOutputCost: number;
  estimatedCacheCost: number;
  totalEstimatedCost: number;
}
