export interface OpenCodeStats {
  overview: {
    sessions: number;
    messages: number;
    days: number;
    avgRequests: {
      perSession: number;
      per5Hours: number;
      perDay: number;
      perWeek: number;
      perMonth: number;
    };
  };
  requests: {
    avgPerSession: number;
    avgPer5Hours: number;
    avgPerDay: number;
    avgPerWeek: number;
    avgPerMonth: number;
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
    avgInputPerSession: number;
    avgOutputPerSession: number;
    avgCacheReadPerSession: number;
    avgCacheWritePerSession: number;
    avgInputPerDay: number;
    avgOutputPerDay: number;
    avgCacheReadPerDay: number;
    avgCacheWritePerDay: number;
    avgInputPerRequest: number;
    avgOutputPerRequest: number;
    avgCacheReadPerRequest: number;
    avgCacheWritePerRequest: number;
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
  subscriptionCost?: number; // Flat subscription cost (e.g., $7/week)
  subscriptionPeriod?: 'week' | 'month';
}

export interface CostComparison {
  model: ModelPricing;
  estimatedInputCost: number;
  estimatedOutputCost: number;
  estimatedCacheCost: number;
  totalEstimatedCost: number;
}
