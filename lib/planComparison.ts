import { ModelPricing } from '@/types';

// Provider Plan Types
export interface ProviderPlan {
  id: string;
  name: string;
  provider: 'OpenAI Codex' | 'Claude' | 'OpenCode Zen' | 'OpenCode Go' | 'FirePass' | 'Crof AI' | 'Kimi' | 'MiniMax' | 'Qwen' | 'Replicate' | 'Cloudflare' | 'Google AI Studio' | 'GitHub Copilot' | 'Factory AI' | 'Cursor';
  monthlyCost: number;
  yearlyCost?: number;
  description: string;
  features: string[];
  usageLimits?: {
    requestsPerMonth?: number;
    dailyRequests?: number;
    tokensPerMonth?: number;
    messagesPerMonth?: number;
    unlimited?: boolean;
  };
  includedModels: string[];
  overagePricing?: {
    inputPerMTok?: number;
    outputPerMTok?: number;
  };
  payPerUse?: boolean;
  subscriptionType: 'free' | 'monthly' | 'yearly' | 'usage-based';
}

// Comprehensive pricing data from all providers
export const PROVIDER_PLANS: ProviderPlan[] = [
  // OpenAI Codex Plans - Individual
  {
    id: 'codex-free',
    name: 'Codex Free',
    provider: 'OpenAI Codex',
    monthlyCost: 0,
    description: 'Explore Codex capabilities on quick coding tasks',
    features: ['Basic Codex access', 'Limited usage', 'Web, CLI, IDE access'],
    usageLimits: { requestsPerMonth: 50 },
    includedModels: ['GPT-5.4-mini', 'GPT-5.3-Codex'],
    subscriptionType: 'free',
  },
  {
    id: 'codex-go',
    name: 'Codex Go',
    provider: 'OpenAI Codex',
    monthlyCost: 8,
    description: 'Use Codex for lightweight coding tasks',
    features: ['Codex on web, CLI, IDE, iOS', 'Cloud integrations', 'Latest models', 'GPT-5.4-mini higher limits'],
    usageLimits: { messagesPerMonth: 200 },
    includedModels: ['GPT-5.5', 'GPT-5.4', 'GPT-5.4-mini', 'GPT-5.3-Codex'],
    subscriptionType: 'monthly',
  },
  {
    id: 'codex-plus',
    name: 'Codex Plus',
    provider: 'OpenAI Codex',
    monthlyCost: 20,
    description: 'Power a few focused coding sessions each week',
    features: ['Everything in Go', 'More usage limits', 'GPT-5.5 access', 'Flex credit extension'],
    usageLimits: { messagesPerMonth: 500 },
    includedModels: ['GPT-5.5', 'GPT-5.4', 'GPT-5.4-mini', 'GPT-5.3-Codex'],
    subscriptionType: 'monthly',
  },
  {
    id: 'codex-pro-5x',
    name: 'Codex Pro 5x',
    provider: 'OpenAI Codex',
    monthlyCost: 100,
    description: '5x higher rate limits than Plus',
    features: ['5x Plus usage', 'GPT-5.3-Codex-Spark access', 'Double usage through May 2026'],
    usageLimits: { messagesPerMonth: 2500 },
    includedModels: ['GPT-5.5', 'GPT-5.4', 'GPT-5.4-mini', 'GPT-5.3-Codex', 'GPT-5.3-Codex-Spark'],
    subscriptionType: 'monthly',
  },
  {
    id: 'codex-pro-20x',
    name: 'Codex Pro 20x',
    provider: 'OpenAI Codex',
    monthlyCost: 200,
    description: '20x higher rate limits than Plus',
    features: ['20x Plus usage', 'All Pro features', 'Highest limits', 'Boost through May 2026'],
    usageLimits: { messagesPerMonth: 10000 },
    includedModels: ['GPT-5.5', 'GPT-5.4', 'GPT-5.4-mini', 'GPT-5.3-Codex', 'GPT-5.3-Codex-Spark'],
    subscriptionType: 'monthly',
  },
  {
    id: 'codex-api',
    name: 'Codex API Key',
    provider: 'OpenAI Codex',
    monthlyCost: 0,
    description: 'Pay only for tokens used - great for CI/automation',
    features: ['CLI, SDK, IDE access', 'No cloud features', 'Usage-based pricing', 'API rates apply'],
    usageLimits: { unlimited: true },
    includedModels: ['GPT-5.5', 'GPT-5.4', 'GPT-5.4-mini', 'GPT-5.3-Codex'],
    overagePricing: {
      inputPerMTok: 5.00,  // GPT-5.5
      outputPerMTok: 25.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  // OpenAI Codex - Business Plans
  {
    id: 'codex-business',
    name: 'Codex Business',
    provider: 'OpenAI Codex',
    monthlyCost: 25,  // Per seat minimum, scales with usage
    description: 'Pay as you go per seat with usage-based billing',
    features: ['Everything in Plus', 'Larger virtual machines', 'SAML SSO & MFA', 'Admin controls', 'Secure workspace', 'No training on data'],
    usageLimits: { messagesPerMonth: 500 },  // Same as Plus per seat
    includedModels: ['GPT-5.5', 'GPT-5.4', 'GPT-5.4-mini', 'GPT-5.3-Codex'],
    overagePricing: {
      inputPerMTok: 5.00,  // Per credit rates apply
      outputPerMTok: 25.00,
    },
    subscriptionType: 'usage-based',
  },
  {
    id: 'codex-enterprise',
    name: 'Codex Enterprise',
    provider: 'OpenAI Codex',
    monthlyCost: 50,  // Contact sales, per seat estimate
    description: 'Enterprise-grade functionality with priority processing',
    features: ['Everything in Business', 'Priority processing', 'SCIM & EKM', 'Audit logs', 'Data residency', 'RBAC', 'Custom retention'],
    usageLimits: { unlimited: true },
    includedModels: ['GPT-5.5', 'GPT-5.4', 'GPT-5.4-mini', 'GPT-5.3-Codex', 'GPT-5.3-Codex-Spark'],
    subscriptionType: 'usage-based',
  },

  // Claude Plans - Individual
  {
    id: 'claude-free',
    name: 'Claude Free',
    provider: 'Claude',
    monthlyCost: 0,
    description: 'Try Claude at no cost',
    features: ['Chat on web, mobile, desktop', 'Generate code', 'Analyze images', 'Web search', 'Memory'],
    usageLimits: { messagesPerMonth: 50 },
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6'],
    subscriptionType: 'free',
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro',
    provider: 'Claude',
    monthlyCost: 20,
    yearlyCost: 17,
    description: 'For everyday productivity',
    features: ['More usage', 'Claude Code', 'Claude Cowork', 'Unlimited projects', 'Research', 'Desktop apps'],
    usageLimits: { messagesPerMonth: 300 },
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6', 'Opus 4.6'],
    subscriptionType: 'monthly',
  },
  {
    id: 'claude-max-5x',
    name: 'Claude Max 5x',
    provider: 'Claude',
    monthlyCost: 100,
    description: '5x more usage than Pro',
    features: ['5x Pro usage', 'Higher output limits', 'Early access', 'Priority access'],
    usageLimits: { messagesPerMonth: 1500 },
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6', 'Opus 4.6', 'Opus 4.7'],
    subscriptionType: 'monthly',
  },
  {
    id: 'claude-max-20x',
    name: 'Claude Max 20x',
    provider: 'Claude',
    monthlyCost: 200,
    description: '20x more usage than Pro',
    features: ['20x Pro usage', 'All Max features', 'Highest priority'],
    usageLimits: { messagesPerMonth: 6000 },
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6', 'Opus 4.6', 'Opus 4.7'],
    subscriptionType: 'monthly',
  },
  // Claude - Team Plans
  {
    id: 'claude-team-standard',
    name: 'Claude Team Standard',
    provider: 'Claude',
    monthlyCost: 20,
    yearlyCost: 20,
    description: 'For teams of 5-150. More usage than Pro per seat.',
    features: ['All Pro features per seat', 'Team collaboration', 'Connect Slack, Microsoft 365', 'Enterprise search', 'SSO & Admin controls', 'No model training on data'],
    usageLimits: { messagesPerMonth: 400 },  // More than Pro (300)
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6', 'Opus 4.6', 'Opus 4.7'],
    subscriptionType: 'monthly',
  },
  {
    id: 'claude-team-premium',
    name: 'Claude Team Premium',
    provider: 'Claude',
    monthlyCost: 100,
    yearlyCost: 100,
    description: '5x more usage than Standard seats',
    features: ['5x Standard seat usage', 'Claude Code & Cowork', 'All Team features', 'Priority support'],
    usageLimits: { messagesPerMonth: 2000 },  // 5x standard
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6', 'Opus 4.6', 'Opus 4.7'],
    subscriptionType: 'monthly',
  },
  // Claude - Enterprise
  {
    id: 'claude-enterprise-selfserve',
    name: 'Claude Enterprise (Self-Serve)',
    provider: 'Claude',
    monthlyCost: 30,  // Per seat + usage
    description: 'Enterprise security features with self-serve signup',
    features: ['Team features', 'SCIM provisioning', 'Audit logs', 'Domain verification', 'Usage analytics', 'Spend controls'],
    usageLimits: { messagesPerMonth: 500 },
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6', 'Opus 4.6', 'Opus 4.7'],
    overagePricing: {
      inputPerMTok: 3.00,
      outputPerMTok: 15.00,
    },
    subscriptionType: 'usage-based',
  },
  {
    id: 'claude-enterprise-sales',
    name: 'Claude Enterprise (Sales-Assisted)',
    provider: 'Claude',
    monthlyCost: 50,  // Estimated per seat
    description: 'Tailored approach with enterprise security',
    features: ['Everything in self-serve', 'Role-based access', 'Compliance API', 'Data retention controls', 'IP allowlisting', 'HIPAA-ready available'],
    usageLimits: { unlimited: true },
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6', 'Opus 4.6', 'Opus 4.7'],
    subscriptionType: 'usage-based',
  },
  // Claude - API
  {
    id: 'claude-api',
    name: 'Claude API',
    provider: 'Claude',
    monthlyCost: 0,
    description: 'Pay per token usage',
    features: ['Full API access', 'Usage-based', 'All models', 'No subscription', 'Build your own apps'],
    usageLimits: { unlimited: true },
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6', 'Opus 4.6', 'Opus 4.7'],
    overagePricing: {
      inputPerMTok: 3.00,  // Sonnet
      outputPerMTok: 15.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  // Claude - Education
  {
    id: 'claude-education',
    name: 'Claude for Education',
    provider: 'Claude',
    monthlyCost: 15,  // Estimated discounted rate
    description: 'Comprehensive university-wide access for students and faculty',
    features: ['University-wide access', 'Student & faculty accounts', 'Academic research mode', 'Dedicated API credits', 'Educational training resources', 'Discounted rates'],
    usageLimits: { messagesPerMonth: 500 },
    includedModels: ['Haiku 4.5', 'Sonnet 4.5', 'Sonnet 4.6', 'Opus 4.6'],
    subscriptionType: 'monthly',
  },

  // OpenCode Plans
  {
    id: 'opencode-go',
    name: 'OpenCode Go',
    provider: 'OpenCode Go',
    monthlyCost: 10,
    description: '$5 first month, then $10/month. Low cost coding models',
    features: ['Generous limits', 'Open source models', 'Reliable access', 'Any agent support'],
    usageLimits: {
      requestsPerMonth: 5000,  // Approx based on Big Pickle 880 requests/5h
    },
    includedModels: ['Big Pickle', 'GLM-5.1', 'Kimi K2.5', 'Kimi K2.6', 'MiMo-V2.5-Pro', 'Qwen3.6 Plus', 'MiniMax M2.7', 'DeepSeek V4'],
    subscriptionType: 'monthly',
  },
  {
    id: 'opencode-zen',
    name: 'OpenCode Zen',
    provider: 'OpenCode Zen',
    monthlyCost: 0,
    description: 'Pay per use - access to premium models',
    features: ['All models', 'Premium access', 'No subscription', 'Pay for what you use'],
    usageLimits: { unlimited: true },
    includedModels: ['Claude Opus', 'Claude Sonnet', 'GPT-5.5', 'Gemini', 'Kimi', 'Qwen', 'MiniMax', 'DeepSeek'],
    overagePricing: {
      inputPerMTok: 3.00,  // Average across models
      outputPerMTok: 15.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },

  // FirePass
  {
    id: 'firepass-unlimited',
    name: 'FirePass Unlimited',
    provider: 'FirePass',
    monthlyCost: 30.33,  // $7/week = exactly $30.33/month (7*52/12)
    description: 'Unlimited Kimi K2.5 Turbo access - $7/week billed weekly',
    features: ['Unlimited tokens', 'Kimi K2.5 Turbo', 'Zero token pricing after subscription', 'Weekly $7 billing', 'No usage limits', 'Flat rate regardless of volume'],
    usageLimits: { unlimited: true },
    includedModels: ['Kimi K2.5 Turbo'],
    overagePricing: {
      inputPerMTok: 0,  // Included in subscription
      outputPerMTok: 0, // Included in subscription
    },
    subscriptionType: 'monthly',
  },

  // Crof AI - Subscription Plans (6 tiers)
  {
    id: 'crof-free',
    name: 'Crof AI Free',
    provider: 'Crof AI',
    monthlyCost: 0,
    description: 'Pay only for usage with no recurring monthly charge',
    features: ['Pay only for usage', 'No recurring monthly charge', 'Access to all models via usage-based pricing', '20+ models available'],
    usageLimits: { unlimited: true },
    includedModels: ['all-models-usage-based'],
    overagePricing: {
      inputPerMTok: 0.12,  // DeepSeek V4 Flash (cheapest)
      outputPerMTok: 0.21,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'crof-hobby',
    name: 'Crof AI Hobby',
    provider: 'Crof AI',
    monthlyCost: 5,
    description: 'Entry-level plan for hobbyists and small projects',
    features: ['500 daily requests', 'Access to all models', 'Standard support', '15,000 requests/month', 'All 20+ models included'],
    usageLimits: { requestsPerMonth: 15000, dailyRequests: 500 },
    includedModels: ['DeepSeek V4', 'GLM 5.1', 'Kimi K2.6', 'Kimi K2.5', 'Qwen3.6', 'MiniMax M2.5', 'Gemma 4', 'Greg', 'GLM 4.7 Flash (Free)', 'Qwen3.5 9B (Free)'],
    subscriptionType: 'monthly',
  },
  {
    id: 'crof-pro',
    name: 'Crof AI Pro',
    provider: 'Crof AI',
    monthlyCost: 10,
    description: 'Most popular plan with priority support',
    features: ['All Hobby benefits', '1,000 daily requests', 'Priority Support', '30,000 requests/month', 'All models + beta access', 'Vision models included'],
    usageLimits: { requestsPerMonth: 30000, dailyRequests: 1000 },
    includedModels: ['All Hobby models', 'Kimi K2.5 Lightning (Beta)', 'GLM 5.1 Precision (Beta)', 'Vision-capable models'],
    subscriptionType: 'monthly',
  },
  {
    id: 'crof-intermediate',
    name: 'Crof AI Intermediate',
    provider: 'Crof AI',
    monthlyCost: 20,
    description: 'Intermediate plan for growing projects',
    features: ['All Pro benefits', '2,500 daily requests', '75,000 requests/month', 'Higher rate limits', 'All models included'],
    usageLimits: { requestsPerMonth: 75000, dailyRequests: 2500 },
    includedModels: ['All Pro models'],
    subscriptionType: 'monthly',
  },
  {
    id: 'crof-scale',
    name: 'Crof AI Scale',
    provider: 'Crof AI',
    monthlyCost: 50,
    description: 'Scale plan for high-volume usage',
    features: ['All Intermediate benefits', '7,500 daily requests', '225,000 requests/month', 'Higher concurrency', 'Priority processing'],
    usageLimits: { requestsPerMonth: 225000, dailyRequests: 7500 },
    includedModels: ['All Intermediate models'],
    subscriptionType: 'monthly',
  },
  {
    id: 'crof-max',
    name: 'Crof AI Max',
    provider: 'Crof AI',
    monthlyCost: 100,
    description: 'Maximum tier for enterprise-level usage',
    features: ['All Scale benefits', '15,000 daily requests', '450,000 requests/month', 'Maximum concurrency', 'Dedicated resources', 'Enterprise support'],
    usageLimits: { requestsPerMonth: 450000, dailyRequests: 15000 },
    includedModels: ['All Scale models'],
    subscriptionType: 'monthly',
  },
  // Crof AI - Model Pricing Reference (for pay-as-you-go)
  {
    id: 'crof-model-pricing',
    name: 'Crof AI Model Pricing (Reference)',
    provider: 'Crof AI',
    monthlyCost: 0,
    description: 'Per-model pricing for usage-based billing',
    features: ['Pay per token', 'No subscription required', '18+ models available', 'Free models: GLM 4.7 Flash, Qwen3.5 9B'],
    usageLimits: { unlimited: true },
    includedModels: [
      'DeepSeek V4 Pro ($0.40/$0.85 per MTok)',
      'DeepSeek V4 Flash ($0.12/$0.21 per MTok)',
      'GLM 5.1 ($0.45/$2.10 per MTok)',
      'Kimi K2.6 ($0.50/$1.99 per MTok)',
      'Kimi K2.5 ($0.35/$1.70 per MTok)',
      'GLM 4.7 Flash (FREE)',
      'Qwen3.5 9B (FREE)',
    ],
    overagePricing: {
      inputPerMTok: 0.35,  // Average across popular models
      outputPerMTok: 1.50,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },

  // Kimi AI - Pay-as-you-go Tiers (Rate limits based on cumulative lifetime spending)
  {
    id: 'kimi-tier-0',
    name: 'Kimi Tier 0 (Starter)',
    provider: 'Kimi',
    monthlyCost: 0,
    description: 'Entry tier with $1 minimum deposit. Automatic context caching (70-85% cheaper on cache hits).',
    features: ['$1 minimum deposit to start', 'Automatic context caching', 'Tool calls & JSON mode', 'Web search & vision', '256K context window', 'All Kimi models available'],
    usageLimits: {
      requestsPerMonth: undefined, // Unlimited but rate limited
      dailyRequests: undefined,
      tokensPerMonth: 1500000, // TPD: 1.5M
    },
    includedModels: ['kimi-k2.6', 'kimi-k2.5', 'kimi-k2-turbo', 'kimi-k2-thinking', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    overagePricing: {
      inputPerMTok: 0.95,  // kimi-k2.6 cache miss (most expensive input)
      outputPerMTok: 8.00, // kimi-k2-turbo output (most expensive)
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'kimi-tier-1',
    name: 'Kimi Tier 1 ($10 Spent)',
    provider: 'Kimi',
    monthlyCost: 0,
    description: 'Unlocked at $10 cumulative spend. 50 concurrent requests, 200 RPM, 2M TPM.',
    features: ['Unlocked at $10 cumulative spend', '50 concurrent requests', '200 RPM / 2M TPM', 'Unlimited TPD', 'Automatic context caching', 'All features included'],
    usageLimits: {
      requestsPerMonth: undefined,
      dailyRequests: undefined,
      tokensPerMonth: undefined, // Unlimited TPD
    },
    includedModels: ['kimi-k2.6', 'kimi-k2.5', 'kimi-k2-turbo', 'kimi-k2-thinking', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    overagePricing: {
      inputPerMTok: 0.95,
      outputPerMTok: 8.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'kimi-tier-2',
    name: 'Kimi Tier 2 ($20 Spent)',
    provider: 'Kimi',
    monthlyCost: 0,
    description: 'Unlocked at $20 cumulative spend. 100 concurrent requests, 500 RPM, 3M TPM.',
    features: ['Unlocked at $20 cumulative spend', '100 concurrent requests', '500 RPM / 3M TPM', 'Unlimited TPD', 'Automatic context caching', 'All features included'],
    usageLimits: {
      requestsPerMonth: undefined,
      dailyRequests: undefined,
      tokensPerMonth: undefined,
    },
    includedModels: ['kimi-k2.6', 'kimi-k2.5', 'kimi-k2-turbo', 'kimi-k2-thinking', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    overagePricing: {
      inputPerMTok: 0.95,
      outputPerMTok: 8.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'kimi-tier-3',
    name: 'Kimi Tier 3 ($100 Spent)',
    provider: 'Kimi',
    monthlyCost: 0,
    description: 'Unlocked at $100 cumulative spend. 200 concurrent requests, 5K RPM, 3M TPM.',
    features: ['Unlocked at $100 cumulative spend', '200 concurrent requests', '5,000 RPM / 3M TPM', 'Unlimited TPD', 'Automatic context caching', 'All features included'],
    usageLimits: {
      requestsPerMonth: undefined,
      dailyRequests: undefined,
      tokensPerMonth: undefined,
    },
    includedModels: ['kimi-k2.6', 'kimi-k2.5', 'kimi-k2-turbo', 'kimi-k2-thinking', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    overagePricing: {
      inputPerMTok: 0.95,
      outputPerMTok: 8.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'kimi-tier-4',
    name: 'Kimi Tier 4 ($1,000 Spent)',
    provider: 'Kimi',
    monthlyCost: 0,
    description: 'Unlocked at $1,000 cumulative spend. 400 concurrent requests, 5K RPM, 4M TPM.',
    features: ['Unlocked at $1,000 cumulative spend', '400 concurrent requests', '5,000 RPM / 4M TPM', 'Unlimited TPD', 'Automatic context caching', 'All features included'],
    usageLimits: {
      requestsPerMonth: undefined,
      dailyRequests: undefined,
      tokensPerMonth: undefined,
    },
    includedModels: ['kimi-k2.6', 'kimi-k2.5', 'kimi-k2-turbo', 'kimi-k2-thinking', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    overagePricing: {
      inputPerMTok: 0.95,
      outputPerMTok: 8.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'kimi-tier-5',
    name: 'Kimi Tier 5 ($3,000 Spent)',
    provider: 'Kimi',
    monthlyCost: 0,
    description: 'Maximum tier at $3,000 cumulative spend. 1,000 concurrent requests, 10K RPM, 5M TPM.',
    features: ['Unlocked at $3,000 cumulative spend', '1,000 concurrent requests', '10,000 RPM / 5M TPM', 'Unlimited TPD', 'Automatic context caching', 'All features included', 'Highest rate limits'],
    usageLimits: {
      requestsPerMonth: undefined,
      dailyRequests: undefined,
      tokensPerMonth: undefined,
    },
    includedModels: ['kimi-k2.6', 'kimi-k2.5', 'kimi-k2-turbo', 'kimi-k2-thinking', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    overagePricing: {
      inputPerMTok: 0.95,
      outputPerMTok: 8.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },

  // MiniMax - Standard Plans
  {
    id: 'minimax-starter-monthly',
    name: 'MiniMax Starter (Monthly)',
    provider: 'MiniMax',
    monthlyCost: 10,
    yearlyCost: 100,
    description: 'Entry-level plan for light coding tasks. M2.7 Standard tier.',
    features: ['M2.7 LLM access', '219K requests/month', 'Music generation (100/day)', 'Web & API access'],
    usageLimits: { requestsPerMonth: 219000 },
    includedModels: ['MiniMax M2.7'],
    subscriptionType: 'monthly',
  },
  {
    id: 'minimax-starter-yearly',
    name: 'MiniMax Starter (Yearly)',
    provider: 'MiniMax',
    monthlyCost: 8.33, // $100/12
    yearlyCost: 100,
    description: 'Entry-level plan billed annually. M2.7 Standard tier. Save 17%.',
    features: ['M2.7 LLM access', '219K requests/month', 'Music generation (100/day)', 'Web & API access', '17% savings vs monthly'],
    usageLimits: { requestsPerMonth: 219000 },
    includedModels: ['MiniMax M2.7'],
    subscriptionType: 'yearly',
  },
  {
    id: 'minimax-plus-monthly',
    name: 'MiniMax Plus (Monthly)',
    provider: 'MiniMax',
    monthlyCost: 20,
    yearlyCost: 200,
    description: 'Enhanced plan with image generation. M2.7 Standard tier.',
    features: ['M2.7 LLM access', '657K requests/month', 'Speech 2.8 (4K chars/day)', 'Image-01 (50/day)', 'Music generation (100/day)'],
    usageLimits: { requestsPerMonth: 657000 },
    includedModels: ['MiniMax M2.7', 'Speech 2.8', 'Image-01'],
    subscriptionType: 'monthly',
  },
  {
    id: 'minimax-plus-yearly',
    name: 'MiniMax Plus (Yearly)',
    provider: 'MiniMax',
    monthlyCost: 16.67, // $200/12
    yearlyCost: 200,
    description: 'Enhanced plan billed annually. M2.7 Standard tier. Save 17%.',
    features: ['M2.7 LLM access', '657K requests/month', 'Speech 2.8 (4K chars/day)', 'Image-01 (50/day)', 'Music generation (100/day)', '17% savings vs monthly'],
    usageLimits: { requestsPerMonth: 657000 },
    includedModels: ['MiniMax M2.7', 'Speech 2.8', 'Image-01'],
    subscriptionType: 'yearly',
  },
  {
    id: 'minimax-max-monthly',
    name: 'MiniMax Max (Monthly)',
    provider: 'MiniMax',
    monthlyCost: 50,
    yearlyCost: 500,
    description: 'Maximum tier with video generation. M2.7 Standard tier.',
    features: ['M2.7 LLM access', '2.19M requests/month', 'Speech 2.8 (11K chars/day)', 'Image-01 (120/day)', 'Video generation (2/day)', 'Music generation (100/day)'],
    usageLimits: { requestsPerMonth: 2190000 },
    includedModels: ['MiniMax M2.7', 'Speech 2.8', 'Image-01', 'Video'],
    subscriptionType: 'monthly',
  },
  {
    id: 'minimax-max-yearly',
    name: 'MiniMax Max (Yearly)',
    provider: 'MiniMax',
    monthlyCost: 41.67, // $500/12
    yearlyCost: 500,
    description: 'Maximum tier billed annually. M2.7 Standard tier. Save 17%.',
    features: ['M2.7 LLM access', '2.19M requests/month', 'Speech 2.8 (11K chars/day)', 'Image-01 (120/day)', 'Video generation (2/day)', 'Music generation (100/day)', '17% savings vs monthly'],
    usageLimits: { requestsPerMonth: 2190000 },
    includedModels: ['MiniMax M2.7', 'Speech 2.8', 'Image-01', 'Video'],
    subscriptionType: 'yearly',
  },

  // MiniMax - Highspeed Plans (faster inference)
  {
    id: 'minimax-plus-highspeed-monthly',
    name: 'MiniMax Plus-Highspeed (Monthly)',
    provider: 'MiniMax',
    monthlyCost: 40,
    yearlyCost: 400,
    description: 'Highspeed inference with image generation. 2x faster than Standard.',
    features: ['M2.7-highspeed LLM (2x faster)', '657K requests/month', 'Speech 2.8 (9K chars/day)', 'Image-01 (100/day)', 'Music generation (100/day)'],
    usageLimits: { requestsPerMonth: 657000 },
    includedModels: ['MiniMax M2.7-highspeed', 'Speech 2.8', 'Image-01'],
    subscriptionType: 'monthly',
  },
  {
    id: 'minimax-plus-highspeed-yearly',
    name: 'MiniMax Plus-Highspeed (Yearly)',
    provider: 'MiniMax',
    monthlyCost: 33.33, // $400/12
    yearlyCost: 400,
    description: 'Highspeed inference billed annually. Save 17%.',
    features: ['M2.7-highspeed LLM (2x faster)', '657K requests/month', 'Speech 2.8 (9K chars/day)', 'Image-01 (100/day)', 'Music generation (100/day)', '17% savings vs monthly'],
    usageLimits: { requestsPerMonth: 657000 },
    includedModels: ['MiniMax M2.7-highspeed', 'Speech 2.8', 'Image-01'],
    subscriptionType: 'yearly',
  },
  {
    id: 'minimax-max-highspeed-monthly',
    name: 'MiniMax Max-Highspeed (Monthly)',
    provider: 'MiniMax',
    monthlyCost: 80,
    yearlyCost: 800,
    description: 'Highspeed inference with video. 2x faster than Standard.',
    features: ['M2.7-highspeed LLM (2x faster)', '2.19M requests/month', 'Speech 2.8 (19K chars/day)', 'Image-01 (200/day)', 'Video generation (3/day)', 'Music generation (100/day)'],
    usageLimits: { requestsPerMonth: 2190000 },
    includedModels: ['MiniMax M2.7-highspeed', 'Speech 2.8', 'Image-01', 'Video'],
    subscriptionType: 'monthly',
  },
  {
    id: 'minimax-max-highspeed-yearly',
    name: 'MiniMax Max-Highspeed (Yearly)',
    provider: 'MiniMax',
    monthlyCost: 66.67, // $800/12
    yearlyCost: 800,
    description: 'Highspeed inference with video billed annually. Save 17%.',
    features: ['M2.7-highspeed LLM (2x faster)', '2.19M requests/month', 'Speech 2.8 (19K chars/day)', 'Image-01 (200/day)', 'Video generation (3/day)', 'Music generation (100/day)', '17% savings vs monthly'],
    usageLimits: { requestsPerMonth: 2190000 },
    includedModels: ['MiniMax M2.7-highspeed', 'Speech 2.8', 'Image-01', 'Video'],
    subscriptionType: 'yearly',
  },
  {
    id: 'minimax-ultra-highspeed-monthly',
    name: 'MiniMax Ultra-Highspeed (Monthly)',
    provider: 'MiniMax',
    monthlyCost: 150,
    yearlyCost: 1500,
    description: 'Ultra-highspeed for maximum performance. Highest limits.',
    features: ['M2.7-highspeed LLM (2x faster)', '4.38M requests/month', 'Speech 2.8 (50K chars/day)', 'Image-01 (800/day)', 'Video generation (5/day)', 'Music generation (100/day)'],
    usageLimits: { requestsPerMonth: 4380000 },
    includedModels: ['MiniMax M2.7-highspeed', 'Speech 2.8', 'Image-01', 'Video'],
    subscriptionType: 'monthly',
  },
  {
    id: 'minimax-ultra-highspeed-yearly',
    name: 'MiniMax Ultra-Highspeed (Yearly)',
    provider: 'MiniMax',
    monthlyCost: 125, // $1500/12
    yearlyCost: 1500,
    description: 'Ultra-highspeed billed annually. Maximum performance. Save 17%.',
    features: ['M2.7-highspeed LLM (2x faster)', '4.38M requests/month', 'Speech 2.8 (50K chars/day)', 'Image-01 (800/day)', 'Video generation (5/day)', 'Music generation (100/day)', '17% savings vs monthly'],
    usageLimits: { requestsPerMonth: 4380000 },
    includedModels: ['MiniMax M2.7-highspeed', 'Speech 2.8', 'Image-01', 'Video'],
    subscriptionType: 'yearly',
  },

  // Qwen AI - Pay-per-use Only (NO subscription plans)
  // Access via OpenRouter, Together AI, Alibaba Cloud
  {
    id: 'qwen-payg-light',
    name: 'Qwen Pay-per-use (Light)',
    provider: 'Qwen',
    monthlyCost: 0,
    description: 'Light usage via OpenRouter/Together AI. ~100K-500K tokens/month. FREE tiers available!',
    features: ['Access via OpenRouter, Together AI, Alibaba Cloud', 'NO subscription - pure pay-per-use', 'Alibaba Cloud: 1M free tokens for new users', 'OpenRouter: Limited free requests', '5-10 RPM typical limits', '8 premium coding models available'],
    usageLimits: { unlimited: true },
    includedModels: [
      'Qwen 3.5 Flash ($0.065/$0.26 per MTok)',
      'Qwen 3.5 9B ($0.10/$0.15 per MTok)',
      'Qwen3-Coder-30B-A3B ($0.07/$0.27 per MTok)',
      'Qwen3-235B-A22B ($0.071/$0.10 per MTok)',
      'Qwen 3.5 Plus ($0.40/$2.40 per MTok)',
      'Qwen 3.6 Plus ($0.325/$1.95 per MTok)',
      'Qwen3-Coder-Next ($0.12/$0.80 per MTok)',
      'Qwen3-Coder-480B-A35B ($0.22/$1.80 per MTok)',
    ],
    overagePricing: {
      inputPerMTok: 0.20,  // Average across models for light usage
      outputPerMTok: 1.20,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'qwen-payg-standard',
    name: 'Qwen Pay-per-use (Standard)',
    provider: 'Qwen',
    monthlyCost: 0,
    description: 'Standard development usage via OpenRouter. ~1-5M tokens/month. FREE tiers available!',
    features: ['Access via OpenRouter (most competitive pricing)', 'Together AI, Alibaba Cloud alternatives', 'NO subscription - pay only for tokens used', 'Alibaba Cloud: 1M free tokens for new users', 'Higher rate limits available', 'Full access to all Qwen models', 'Best value for regular coding'],
    usageLimits: { unlimited: true },
    includedModels: [
      'Qwen 3.5 Flash - Best Value ($0.065/$0.26 per MTok)',
      'Qwen 3.5 9B - Small & Fast ($0.10/$0.15 per MTok)',
      'Qwen3-Coder-30B-A3B - Best Coder Value ($0.07/$0.27 per MTok)',
      'Qwen3-235B-A22B - Large Model Value ($0.071/$0.10 per MTok)',
      'Qwen 3.6 Plus - Flagship ($0.325/$1.95 per MTok)',
      'Qwen 3.5 Plus - All-rounder ($0.40/$2.40 per MTok)',
      'Qwen3-Coder-Next - Next-gen ($0.12/$0.80 per MTok)',
      'Qwen3-Coder-480B-A35B - Largest ($0.22/$1.80 per MTok)',
    ],
    overagePricing: {
      inputPerMTok: 0.15,  // Weighted average for typical usage mix
      outputPerMTok: 1.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'qwen-payg-heavy',
    name: 'Qwen Pay-per-use (Heavy)',
    provider: 'Qwen',
    monthlyCost: 0,
    description: 'Intensive coding usage via OpenRouter. 10M+ tokens/month. FREE tiers available!',
    features: ['OpenRouter: Most competitive rates', 'Together AI, Alibaba Cloud for redundancy', 'NO subscription - scale to any volume', 'Alibaba Cloud: 1M free tokens for new users', 'Enterprise rate limits available', 'All 8+ Qwen models included', 'Most cost-effective for heavy coding'],
    usageLimits: { unlimited: true },
    includedModels: [
      'Qwen3-Coder-30B-A3B - BEST VALUE for coding ($0.07/$0.27 per MTok)',
      'Qwen3-235B-A22B - Large model, great value ($0.071/$0.10 per MTok)',
      'Qwen 3.5 Flash - Cheapest option ($0.065/$0.26 per MTok)',
      'Qwen 3.5 9B - Small tasks ($0.10/$0.15 per MTok)',
      'Qwen3-Coder-Next - Next-gen coder ($0.12/$0.80 per MTok)',
      'Qwen3-Coder-480B-A35B - 262K context ($0.22/$1.80 per MTok)',
      'Qwen 3.6 Plus - Flagship ($0.325/$1.95 per MTok)',
      'Qwen 3.5 Plus - Excellent all-rounder ($0.40/$2.40 per MTok)',
    ],
    overagePricing: {
      inputPerMTok: 0.10,  // Heavy users optimize for cheapest models
      outputPerMTok: 0.80,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'qwen-model-pricing',
    name: 'Qwen Model Pricing (Reference)',
    provider: 'Qwen',
    monthlyCost: 0,
    description: 'Per-model OpenRouter pricing for Qwen models (most competitive provider)',
    features: ['Pay only for tokens used', 'NO subscription required', 'OpenRouter: Most competitive pricing', 'Together AI: Alternative provider', 'Alibaba Cloud: 1M free tokens for new users', 'Pricing varies by provider'],
    usageLimits: { unlimited: true },
    includedModels: [
      'Qwen 3.5 Flash: $0.065/$0.26 per MTok (Input/Output)',
      'Qwen3-235B-A22B: $0.071/$0.10 per MTok - Best value large',
      'Qwen3-Coder-30B-A3B: $0.07/$0.27 per MTok - Best value coder',
      'Qwen 3.5 9B: $0.10/$0.15 per MTok',
      'Qwen3-Coder-Next: $0.12/$0.80 per MTok - Next-gen',
      'Qwen 3.6 Plus: $0.325/$1.95 per MTok - Flagship',
      'Qwen 3.5 Plus: $0.40/$2.40 per MTok - All-rounder',
      'Qwen3-Coder-480B-A35B: $0.22/$1.80 per MTok - 262K context',
    ],
    overagePricing: {
      inputPerMTok: 0.17,  // Average across all models
      outputPerMTok: 1.05,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },

  // Cloudflare Workers AI Plans
  {
    id: 'cloudflare-workers-free',
    name: 'Cloudflare Workers Free',
    provider: 'Cloudflare',
    monthlyCost: 0,
    description: '10,000 Neurons/day free tier for AI inference. Resets at 00:00 UTC.',
    features: [
      '10,000 Neurons/day free',
      '300 requests/minute limit',
      'Access to 100+ open-source models',
      'Resets daily at 00:00 UTC',
      'No credit card required',
      'Best value for small projects',
    ],
    usageLimits: {
      dailyRequests: 10000, // 10,000 Neurons/day
    },
    includedModels: [
      'granite-4.0-h-micro',
      'llama-3.2-1b-instruct',
      'llama-3.1-8b-fp8-fast',
      'llama-3.3-70b-fp8-fast',
      'glm-4.7-flash',
      'mistral-small-3.1-24b',
      'qwen2.5-coder-32b',
      'deepseek-r1-distill-32b',
    ],
    subscriptionType: 'free',
  },
  {
    id: 'cloudflare-workers-paid',
    name: 'Cloudflare Workers Paid',
    provider: 'Cloudflare',
    monthlyCost: 5,
    description: '$5/month Workers Paid plan + $0.011 per 1,000 Neurons beyond free tier',
    features: [
      'Includes 10,000 Neurons/day free',
      'Unlimited Neurons beyond free tier',
      '300 requests/minute limit',
      'Access to 100+ open-source models',
      '$0.011 per 1,000 Neurons',
      'Priority access',
      'Best for growing projects',
    ],
    usageLimits: {
      dailyRequests: 10000, // Free tier included
      unlimited: true, // Can exceed with pay-per-use
    },
    includedModels: [
      'granite-4.0-h-micro',
      'llama-3.2-1b-instruct',
      'llama-3.1-8b-fp8-fast',
      'llama-3.3-70b-fp8-fast',
      'glm-4.7-flash',
      'kimi-k2.5',
      'kimi-k2.6',
      'mistral-small-3.1-24b',
      'qwen2.5-coder-32b',
      'deepseek-r1-distill-32b',
    ],
    overagePricing: {
      inputPerMTok: 0.011, // Per 1,000 Neurons (simplified as per-MTok for comparison)
      outputPerMTok: 0.011,
    },
    payPerUse: true,
    subscriptionType: 'monthly',
  },
  {
    id: 'cloudflare-payg-reference',
    name: 'Cloudflare Pay-per-use (Reference)',
    provider: 'Cloudflare',
    monthlyCost: 0,
    description: 'Pure usage-based pricing at $0.011 per 1,000 Neurons',
    features: [
      'NO subscription fee',
      '$0.011 per 1,000 Neurons',
      '300 requests/minute',
      'All models available',
      'Model-specific pricing (shown per 1M tokens for comparison)',
    ],
    usageLimits: {
      unlimited: true,
    },
    includedModels: [
      'granite-4.0-h-micro: $0.017/$0.112 per MTok (Input/Output)',
      'llama-3.2-1b-instruct: $0.027/$0.201 per MTok',
      'llama-3.1-8b-fp8-fast: $0.045/$0.384 per MTok',
      'llama-3.3-70b-fp8-fast: $0.293/$2.253 per MTok',
      'glm-4.7-flash: $0.060/$0.400 per MTok',
      'kimi-k2.5: $0.600/$3.000 per MTok',
      'kimi-k2.6: $0.950/$4.000 per MTok',
      'mistral-small-3.1-24b: $0.351/$0.555 per MTok',
      'qwen2.5-coder-32b: $0.660/$1.000 per MTok',
      'deepseek-r1-distill-32b: $0.497/$4.881 per MTok',
    ],
    overagePricing: {
      inputPerMTok: 0.011,
      outputPerMTok: 0.011,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },

  // Google AI Studio - Consumer Subscription Plans
  {
    id: 'google-ai-studio-free',
    name: 'Google AI Studio Free',
    provider: 'Google AI Studio',
    monthlyCost: 0,
    description: '50 AI credits daily for casual use',
    features: [
      '50 AI credits daily (resets each day)',
      '128K context window',
      'Limited model access',
      'Gemini 2.5 Flash access',
      'No credit card required',
    ],
    usageLimits: { dailyRequests: 50 },
    includedModels: ['Gemini 2.5 Flash', 'Gemini 2.5 Flash-Lite'],
    subscriptionType: 'free',
  },
  {
    id: 'google-ai-studio-plus',
    name: 'Google AI Studio Plus',
    provider: 'Google AI Studio',
    monthlyCost: 7.99,
    description: '200GB storage + 200 AI credits for casual users',
    features: [
      '200 AI credits per month',
      '200 GB storage included',
      '128K context window',
      'AI Mode for enhanced interactions',
      'Image generation access',
      'Music generation access',
      'Gemini 2.5 Pro access',
      'Gemini 2.5 Flash access',
    ],
    usageLimits: { requestsPerMonth: 200 },
    includedModels: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'Gemini 2.5 Flash-Lite'],
    subscriptionType: 'monthly',
  },
  {
    id: 'google-ai-studio-pro',
    name: 'Google AI Studio Pro',
    provider: 'Google AI Studio',
    monthlyCost: 19.99,
    description: '5TB storage + 1,000 credits + Jules coding agent for developers',
    features: [
      '1,000 AI credits per month',
      '5 TB storage included',
      '1M context window (10x larger)',
      'Jules coding agent integration',
      '$10 Google Cloud credits included',
      'AI Mode for enhanced interactions',
      'Image generation access',
      'Music generation access',
      'Credit top-ups available',
      'Gemini 2.5 Pro (stable)',
      'Gemini 2.5 Flash (fast)',
      'Gemini 2.5 Flash-Lite (cheapest)',
    ],
    usageLimits: { requestsPerMonth: 1000 },
    includedModels: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'Gemini 2.5 Flash-Lite'],
    subscriptionType: 'monthly',
  },
  {
    id: 'google-ai-studio-ultra',
    name: 'Google AI Studio Ultra',
    provider: 'Google AI Studio',
    monthlyCost: 49.99,
    description: '30TB storage + 25,000 credits + Deep Think for power users',
    features: [
      '25,000 AI credits per month',
      '30 TB storage included',
      '1M context window',
      'Deep Think advanced reasoning',
      '$100 Google Cloud credits included',
      'YouTube Premium included',
      'Jules coding agent integration',
      'AI Mode for enhanced interactions',
      'Image generation access',
      'Music generation access',
      'Veo video generation (10-100 credits per video)',
      'Credit top-ups available',
      'Priority access to new models',
      'Gemini 2.5 Pro (stable)',
      'Gemini 2.5 Flash (fast)',
      'Gemini 2.5 Flash-Lite (cheapest)',
      'Gemini 3.x series (preview)',
    ],
    usageLimits: { requestsPerMonth: 25000 },
    includedModels: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'Gemini 2.5 Flash-Lite', 'Gemini 3.x series'],
    subscriptionType: 'monthly',
  },

  // Replicate AI - Model Hosting Platform (NOT a direct LLM provider)
  {
    id: 'replicate-payg',
    name: 'Replicate Pay-as-you-go',
    provider: 'Replicate',
    monthlyCost: 0,
    description: 'Model hosting platform with prepaid credits. NO free tier for LLMs.',
    features: [
      'Model hosting platform - NOT a direct LLM provider',
      'NO subscription plans - pure pay-as-you-go',
      'NO free tier for LLMs (only image/video models)',
      'Premium pricing vs direct providers (infrastructure overhead)',
      'Prepaid credits with 1-year validity',
      '600 RPM rate limit for predictions',
      'Access to 20,000+ open-source models',
      'Bring your own models (BYOM) support',
    ],
    usageLimits: { unlimited: true },
    includedModels: [
      'Claude 4.5 Sonnet ($3.00/$15.00 per MTok) - Via Replicate',
      'DeepSeek R1 ($3.75/$10.00 per MTok) - Reasoning model',
      'Llama 3 70B - Per-second GPU pricing (A100: $0.0014/sec)',
    ],
    overagePricing: {
      inputPerMTok: 3.00,  // Claude 4.5 Sonnet rate
      outputPerMTok: 15.00,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },
  {
    id: 'replicate-hardware',
    name: 'Replicate Hardware Pricing (Reference)',
    provider: 'Replicate',
    monthlyCost: 0,
    description: 'GPU pricing for self-hosted models on Replicate infrastructure',
    features: [
      'Self-host your own models',
      'GPU pricing: T4 ($0.81/hr), L40S ($3.51/hr), A100 ($5.04/hr), H100 ($5.49/hr)',
      'Per-second billing with $0.0014/sec on A100',
      'No free tier for GPU compute',
      'Ideal for custom models not available elsewhere',
      '⚠️ WARNING: Prices match or exceed direct providers due to infrastructure costs',
    ],
    usageLimits: { unlimited: true },
    includedModels: [
      'Custom models on T4, L40S, A100, H100 GPUs',
      'Llama 3 70B on A100: ~$0.0014/sec',
      'Fine-tuned models with dedicated GPU',
    ],
    overagePricing: {
      inputPerMTok: 3.75,  // Average across hosted models
      outputPerMTok: 12.50,
    },
    payPerUse: true,
    subscriptionType: 'usage-based',
  },

  // GitHub Copilot Plans - Individual
  {
    id: 'copilot-free',
    name: 'Copilot Free',
    provider: 'GitHub Copilot',
    monthlyCost: 0,
    description: 'Free tier with essential AI coding assistance',
    features: [
      'Agent mode',
      'Chat assistance',
      'Copilot CLI',
      '2,000 code completions/month',
      'IDE integration (VS Code, JetBrains, etc.)',
    ],
    usageLimits: {
      requestsPerMonth: 50, // Premium requests
    },
    includedModels: [
      'Claude Haiku 4.5',
      'Claude Sonnet 4',
      'Claude Sonnet 4.5',
      'Claude Sonnet 4.6',
      'Claude Opus 4.5',
      'Claude Opus 4.6',
      'Gemini 2.5 Pro',
      'Gemini 3 Flash',
      'GPT-5 mini',
      'GPT-5.2',
      'GPT-5.2-Codex',
      'GPT-5.3-Codex',
      'GPT-5.4',
      'GPT-5.4 mini',
      'GPT-5.5',
      'xAI Grok Code Fast 1',
    ],
    overagePricing: {
      inputPerMTok: 0.04, // $0.04 per additional premium request
      outputPerMTok: 0.04,
    },
    subscriptionType: 'free',
  },
  {
    id: 'copilot-pro',
    name: 'Copilot Pro',
    provider: 'GitHub Copilot',
    monthlyCost: 10,
    description: 'Unlimited completions with premium models',
    features: [
      'Cloud agent',
      'Code review',
      'Unlimited code completions',
      'Claude and Codex models',
      'Unlimited GPT-5 mini',
      'IDE integration (VS Code, JetBrains, etc.)',
      '300 premium requests/month',
    ],
    usageLimits: {
      requestsPerMonth: 300, // Premium requests
      unlimited: true, // Unlimited completions
    },
    includedModels: [
      'Claude Haiku 4.5',
      'Claude Sonnet 4',
      'Claude Sonnet 4.5',
      'Claude Sonnet 4.6',
      'Claude Opus 4.5',
      'Claude Opus 4.6',
      'Gemini 2.5 Pro',
      'Gemini 3 Flash',
      'GPT-5 mini',
      'GPT-5.2',
      'GPT-5.2-Codex',
      'GPT-5.3-Codex',
      'GPT-5.4',
      'GPT-5.4 mini',
      'GPT-5.5',
      'xAI Grok Code Fast 1',
    ],
    overagePricing: {
      inputPerMTok: 0.04, // $0.04 per additional premium request
      outputPerMTok: 0.04,
    },
    subscriptionType: 'monthly',
  },
  {
    id: 'copilot-pro-plus',
    name: 'Copilot Pro+',
    provider: 'GitHub Copilot',
    monthlyCost: 39,
    description: '5x premium requests with all models including Opus 4.7',
    features: [
      'All Pro features',
      '1,500 premium requests/month (5x Pro)',
      'Claude Opus 4.7 access',
      'GitHub Spark',
      'Unlimited code completions',
      'IDE integration (VS Code, JetBrains, etc.)',
    ],
    usageLimits: {
      requestsPerMonth: 1500, // Premium requests
      unlimited: true, // Unlimited completions
    },
    includedModels: [
      'Claude Opus 4.7', // Pro+ exclusive
      'Claude Haiku 4.5',
      'Claude Sonnet 4',
      'Claude Sonnet 4.5',
      'Claude Sonnet 4.6',
      'Claude Opus 4.5',
      'Claude Opus 4.6',
      'Gemini 2.5 Pro',
      'Gemini 3 Flash',
      'GPT-5 mini',
      'GPT-5.2',
      'GPT-5.2-Codex',
      'GPT-5.3-Codex',
      'GPT-5.4',
      'GPT-5.4 mini',
      'GPT-5.5',
      'xAI Grok Code Fast 1',
    ],
    overagePricing: {
      inputPerMTok: 0.04, // $0.04 per additional premium request
      outputPerMTok: 0.04,
    },
    subscriptionType: 'monthly',
  },
  // GitHub Copilot - Business/Enterprise Plans
  {
    id: 'copilot-business',
    name: 'Copilot Business',
    provider: 'GitHub Copilot',
    monthlyCost: 19,
    description: 'Enterprise features for teams with license and policy management',
    features: [
      'Everything in Pro',
      'License management',
      'Policy management',
      'Team collaboration features',
      'Admin controls',
      'IDE integration (VS Code, JetBrains, etc.)',
    ],
    usageLimits: {
      requestsPerMonth: 300, // Premium requests per user
      unlimited: true, // Unlimited completions
    },
    includedModels: [
      'Claude Haiku 4.5',
      'Claude Sonnet 4',
      'Claude Sonnet 4.5',
      'Claude Sonnet 4.6',
      'Claude Opus 4.5',
      'Claude Opus 4.6',
      'Gemini 2.5 Pro',
      'Gemini 3 Flash',
      'GPT-5 mini',
      'GPT-5.2',
      'GPT-5.2-Codex',
      'GPT-5.3-Codex',
      'GPT-5.4',
      'GPT-5.4 mini',
      'GPT-5.5',
      'xAI Grok Code Fast 1',
    ],
    overagePricing: {
      inputPerMTok: 0.04,
      outputPerMTok: 0.04,
    },
    subscriptionType: 'monthly',
  },
  {
    id: 'copilot-enterprise',
    name: 'Copilot Enterprise',
    provider: 'GitHub Copilot',
    monthlyCost: 0, // Custom pricing - contact sales
    description: 'Full enterprise suite with GitHub.com chat and codebase indexing',
    features: [
      'Everything in Business',
      'GitHub.com chat integration',
      'Codebase indexing',
      'Custom models',
      'Enterprise security and compliance',
      'Advanced admin controls',
      'IDE integration (VS Code, JetBrains, etc.)',
      'Custom pricing - contact sales',
    ],
    usageLimits: {
      requestsPerMonth: 1500, // Premium requests per user (estimated)
      unlimited: true, // Unlimited completions
    },
    includedModels: [
      'Custom models',
      'Claude Opus 4.7',
      'Claude Haiku 4.5',
      'Claude Sonnet 4',
      'Claude Sonnet 4.5',
      'Claude Sonnet 4.6',
      'Claude Opus 4.5',
      'Claude Opus 4.6',
      'Gemini 2.5 Pro',
      'Gemini 3 Flash',
      'GPT-5 mini',
      'GPT-5.2',
      'GPT-5.2-Codex',
      'GPT-5.3-Codex',
      'GPT-5.4',
      'GPT-5.4 mini',
      'GPT-5.5',
      'xAI Grok Code Fast 1',
    ],
    overagePricing: {
      inputPerMTok: 0.04,
      outputPerMTok: 0.04,
    },
    subscriptionType: 'usage-based',
  },

  // Factory AI Plans - Agent-native coding with rolling rate limits
  {
    id: 'factory-pro',
    name: 'Factory Pro',
    provider: 'Factory AI',
    monthlyCost: 20,
    description: 'Agent-native coding with rolling rate limits for individual developers',
    features: [
      'Rolling rate limits (5-hour, 7-day, 30-day windows)',
      'Droid Core: Free fallback to open-weight models when limits hit',
      'Agent-native architecture',
      'Desktop, CLI, and SDK access',
      'Cloud & local agents',
      'Extra Usage: Prepaid credits ($10 minimum), never expire',
      'Standard Usage consumed before Extra Usage',
      'Missions: Autonomous agent tasks (draw from same limits)',
    ],
    usageLimits: {
      unlimited: false, // Rolling rate limits apply
    },
    includedModels: ['Factory Droid (proprietary)', 'Droid Core (open-weight fallback)'],
    subscriptionType: 'monthly',
  },
  {
    id: 'factory-pro-plus',
    name: 'Factory Pro Plus',
    provider: 'Factory AI',
    monthlyCost: 100,
    description: '~5x Pro usage with Droid Computers (cloud computers)',
    features: [
      '~5x Pro usage limits',
      'All Pro features',
      'Droid Computers: Cloud computers for compute-heavy tasks',
      'Rolling rate limits (5-hour, 7-day, 30-day windows)',
      'Droid Core: Free fallback to open-weight models',
      'Agent-native architecture',
      'Desktop, CLI, and SDK access',
      'Cloud & local agents',
      'Extra Usage: Prepaid credits ($10 minimum), never expire',
      'Missions: Autonomous agent tasks',
    ],
    usageLimits: {
      unlimited: false, // Rolling rate limits apply, but 5x higher
    },
    includedModels: ['Factory Droid (proprietary)', 'Droid Computers', 'Droid Core (open-weight fallback)'],
    subscriptionType: 'monthly',
  },
  {
    id: 'factory-max',
    name: 'Factory Max',
    provider: 'Factory AI',
    monthlyCost: 200,
    description: '~10x Pro usage with early access to new features',
    features: [
      '~10x Pro usage limits',
      'Early access to new features',
      'All Pro Plus features',
      'Droid Computers: Cloud computers included',
      'Rolling rate limits (5-hour, 7-day, 30-day windows)',
      'Droid Core: Free fallback to open-weight models',
      'Agent-native architecture',
      'Desktop, CLI, and SDK access',
      'Cloud & local agents',
      'Extra Usage: Prepaid credits ($10 minimum), never expire',
      'Missions: Autonomous agent tasks',
    ],
    usageLimits: {
      unlimited: false, // Rolling rate limits apply, but 10x higher
    },
    includedModels: ['Factory Droid (proprietary)', 'Droid Computers', 'Droid Core (open-weight fallback)', 'Beta models (early access)'],
    subscriptionType: 'monthly',
  },
  {
    id: 'factory-teams',
    name: 'Factory Teams',
    provider: 'Factory AI',
    monthlyCost: 0, // Custom pricing
    description: 'Team plan for up to 150 seats with admin controls',
    features: [
      'Up to 150 seats',
      'SSO integration',
      'Admin controls & user management',
      'Zero Data Retention (ZDR) option',
      'Shared Standard Usage across team',
      'NOT affected by individual rate limit changes',
      'Droid Core included for all members',
      'Desktop, CLI, and SDK access',
      'Cloud & local agents',
      'Custom pricing - contact sales',
    ],
    usageLimits: {
      unlimited: true, // Not affected by rate limit changes
    },
    includedModels: ['Factory Droid (proprietary)', 'Droid Computers', 'Droid Core (open-weight fallback)'],
    subscriptionType: 'usage-based',
  },
  {
    id: 'factory-enterprise',
    name: 'Factory Enterprise',
    provider: 'Factory AI',
    monthlyCost: 0, // Custom pricing
    description: 'Enterprise plan with unlimited seats and dedicated compute',
    features: [
      'Unlimited seats',
      'Dedicated compute resources',
      'Audit logs & compliance features',
      'On-premise deployment options',
      'SSO & advanced admin controls',
      'Zero Data Retention (ZDR)',
      'Shared Standard Usage across organization',
      'NOT affected by rate limit changes',
      'Droid Core included for all members',
      'Desktop, CLI, and SDK access',
      'Cloud & local agents',
      'Priority support & SLAs',
      'Custom pricing - contact sales',
    ],
    usageLimits: {
      unlimited: true, // Not affected by rate limit changes
    },
    includedModels: ['Factory Droid (proprietary)', 'Droid Computers', 'Droid Core (open-weight fallback)', 'Custom models'],
    subscriptionType: 'usage-based',
  },

  // Cursor Plans - VS Code fork with built-in AI
  {
    id: 'cursor-hobby',
    name: 'Cursor Hobby',
    provider: 'Cursor',
    monthlyCost: 0,
    description: 'Free tier to explore Cursor capabilities - VS Code fork with built-in AI',
    features: [
      'VS Code fork with built-in AI',
      'Limited Agent requests',
      'Limited Tab completions',
      'No credit card required',
      'Agent: AI agent for coding tasks',
      'Tab: Smart code completions',
      'Privacy Mode available',
    ],
    usageLimits: {
      requestsPerMonth: 50, // Limited usage
    },
    includedModels: ['OpenAI GPT-4', 'Claude (Anthropic)', 'Gemini (Google)'],
    subscriptionType: 'free',
  },
  {
    id: 'cursor-pro',
    name: 'Cursor Pro',
    provider: 'Cursor',
    monthlyCost: 20,
    description: 'Extended limits with frontier models and MCPs - 1x usage',
    features: [
      'VS Code fork with built-in AI',
      'Extended usage limits (1x)',
      'Frontier models access',
      'MCPs: Model Context Protocols',
      'Skills and hooks',
      'Cloud agents: Remote AI agents',
      'Agent: AI agent for coding tasks',
      'Tab: Smart code completions',
      'Privacy Mode available',
    ],
    usageLimits: {
      requestsPerMonth: 500, // Extended limits
    },
    includedModels: ['OpenAI GPT-4', 'Claude (Anthropic)', 'Gemini (Google)'],
    subscriptionType: 'monthly',
  },
  {
    id: 'cursor-pro-plus',
    name: 'Cursor Pro+',
    provider: 'Cursor',
    monthlyCost: 60,
    description: '3x usage on OpenAI/Claude/Gemini - Recommended plan',
    features: [
      'VS Code fork with built-in AI',
      '3x usage on OpenAI/Claude/Gemini',
      'RECOMMENDED plan',
      'Frontier models access',
      'MCPs: Model Context Protocols',
      'Skills and hooks',
      'Cloud agents: Remote AI agents',
      'Agent: AI agent for coding tasks',
      'Tab: Smart code completions',
      'Privacy Mode available',
    ],
    usageLimits: {
      requestsPerMonth: 1500, // 3x Pro
    },
    includedModels: ['OpenAI GPT-4', 'Claude (Anthropic)', 'Gemini (Google)'],
    subscriptionType: 'monthly',
  },
  {
    id: 'cursor-ultra',
    name: 'Cursor Ultra',
    provider: 'Cursor',
    monthlyCost: 200,
    description: '20x usage with priority access to new features',
    features: [
      'VS Code fork with built-in AI',
      '20x usage on all models',
      'Priority access to new features',
      'Frontier models access',
      'MCPs: Model Context Protocols',
      'Skills and hooks',
      'Cloud agents: Remote AI agents',
      'Agent: AI agent for coding tasks',
      'Tab: Smart code completions',
      'Privacy Mode available',
    ],
    usageLimits: {
      requestsPerMonth: 10000, // 20x Pro
    },
    includedModels: ['OpenAI GPT-4', 'Claude (Anthropic)', 'Gemini (Google)'],
    subscriptionType: 'monthly',
  },
  {
    id: 'cursor-teams',
    name: 'Cursor Teams',
    provider: 'Cursor',
    monthlyCost: 40,
    description: 'Team collaboration with shared chats, commands, and rules',
    features: [
      'VS Code fork with built-in AI',
      'Per user pricing ($40/user/month)',
      'Shared chats and commands',
      'Shared rules',
      'Team billing',
      'Usage analytics',
      'SAML/OIDC SSO',
      'Agent: AI agent for coding tasks',
      'Tab: Smart code completions',
      'Privacy Mode available',
    ],
    usageLimits: {
      requestsPerMonth: 500, // Per user
    },
    includedModels: ['OpenAI GPT-4', 'Claude (Anthropic)', 'Gemini (Google)'],
    subscriptionType: 'monthly',
  },
  {
    id: 'cursor-enterprise',
    name: 'Cursor Enterprise',
    provider: 'Cursor',
    monthlyCost: 0, // Custom pricing
    description: 'Enterprise-grade with pooled usage and advanced security',
    features: [
      'VS Code fork with built-in AI',
      'Pooled usage across organization',
      'Invoice billing',
      'SCIM provisioning',
      'AI code tracking API',
      'Audit logs',
      'Agent: AI agent for coding tasks',
      'Tab: Smart code completions',
      'Code Review: Automated PR reviews',
      'Privacy Mode available',
      'Custom pricing - contact sales',
    ],
    usageLimits: {
      unlimited: true,
    },
    includedModels: ['OpenAI GPT-4', 'Claude (Anthropic)', 'Gemini (Google)'],
    subscriptionType: 'usage-based',
  },
  {
    id: 'cursor-bugbot-pro',
    name: 'Cursor Bugbot Pro',
    provider: 'Cursor',
    monthlyCost: 40,
    description: 'Code review plan with 200 PRs/month - Bugbot automated reviews',
    features: [
      'VS Code fork with built-in AI',
      'Code Review: Automated PR reviews (Bugbot)',
      '200 PRs per month',
      'Bugbot rules configuration',
      'Per user pricing ($40/user/month)',
      'Agent: AI agent for coding tasks',
      'Tab: Smart code completions',
      'Privacy Mode available',
    ],
    usageLimits: {
      requestsPerMonth: 200, // 200 PRs/month
    },
    includedModels: ['OpenAI GPT-4', 'Claude (Anthropic)', 'Gemini (Google)'],
    subscriptionType: 'monthly',
  },
];

// Model token pricing (per 1M tokens)
export const MODEL_TOKEN_PRICING: Record<string, { input: number; output: number }> = {
  // OpenAI
  'GPT-5.5': { input: 5.00, output: 25.00 },
  'GPT-5.4': { input: 2.50, output: 15.00 },
  'GPT-5.4-mini': { input: 0.75, output: 4.50 },
  'GPT-5.3-Codex': { input: 1.75, output: 14.00 },
  
  // Claude
  'Opus 4.7': { input: 5.00, output: 25.00 },
  'Opus 4.6': { input: 5.00, output: 25.00 },
  'Sonnet 4.6': { input: 3.00, output: 15.00 },
  'Sonnet 4.5': { input: 3.00, output: 15.00 },
  'Haiku 4.5': { input: 1.00, output: 5.00 },
  
  // OpenCode models (average)
  'Kimi K2.5': { input: 0.60, output: 3.00 },
  'Kimi K2.6': { input: 0.95, output: 4.00 },
  'DeepSeek V4': { input: 0.50, output: 2.00 },
  'MiniMax M2.7': { input: 0.30, output: 1.20 },
  'Big Pickle': { input: 0, output: 0 },
  
  // Kimi models (direct API pricing - cache miss rates)
  'kimi-k2.6': { input: 0.95, output: 4.00 },
  'kimi-k2.5': { input: 0.60, output: 3.00 },
  'kimi-k2-turbo': { input: 1.15, output: 8.00 },
  'kimi-k2-thinking': { input: 0.60, output: 2.50 },
  'moonshot-v1-8k': { input: 0.20, output: 2.00 },
  'moonshot-v1-32k': { input: 1.00, output: 3.00 },
  'moonshot-v1-128k': { input: 2.00, output: 5.00 },

  // Qwen models (OpenRouter pricing - most competitive)
  'Qwen 3.6 Plus': { input: 0.325, output: 1.95 },
  'Qwen 3.5 Flash': { input: 0.065, output: 0.26 },
  'Qwen 3.5 9B': { input: 0.10, output: 0.15 },
  'Qwen 3.5 Plus': { input: 0.40, output: 2.40 },
  'Qwen3-235B-A22B': { input: 0.071, output: 0.10 },
  'Qwen3-Coder-30B-A3B': { input: 0.07, output: 0.27 },
  'Qwen3-Coder-480B-A35B': { input: 0.22, output: 1.80 },
  'Qwen3-Coder-Next': { input: 0.12, output: 0.80 },

  // Replicate hosted models (infrastructure overhead pricing - matches or exceeds direct)
  'Claude 4.5 Sonnet (Replicate)': { input: 3.00, output: 15.00 },  // Same as Anthropic direct
  'DeepSeek R1 (Replicate)': { input: 3.75, output: 10.00 },  // Reasoning model
  'Llama 3 70B (Replicate A100)': { input: 1.40, output: 5.04 },  // Per-second GPU: $0.0014/sec on A100
};

// Calculate monthly cost for a plan based on usage
export interface UsageProfile {
  requestsPerMonth: number;
  avgInputTokensPerRequest: number;
  avgOutputTokensPerRequest: number;
  preferredModel?: string;
}

export function calculatePlanCost(
  plan: ProviderPlan,
  usage: UsageProfile
): {
  subscriptionCost: number;
  overageCost: number;
  totalCost: number;
  withinLimits: boolean;
  limitStatus: string;
} {
  const subscriptionCost = plan.monthlyCost;
  let overageCost = 0;
  let withinLimits = true;
  let limitStatus = 'Within limits';

  // Check if usage is within plan limits
  if (plan.usageLimits) {
    if (plan.usageLimits.requestsPerMonth !== undefined) {
      if (usage.requestsPerMonth > plan.usageLimits.requestsPerMonth) {
        withinLimits = false;
        limitStatus = `Exceeds by ${usage.requestsPerMonth - plan.usageLimits.requestsPerMonth} requests`;
      }
    }
    if (plan.usageLimits.messagesPerMonth !== undefined) {
      if (usage.requestsPerMonth > plan.usageLimits.messagesPerMonth) {
        withinLimits = false;
        limitStatus = `Exceeds by ${usage.requestsPerMonth - plan.usageLimits.messagesPerMonth} messages`;
      }
    }
  }

  // Calculate overage costs for pay-per-use plans
  if (plan.payPerUse && plan.overagePricing) {
    const inputTokens = usage.requestsPerMonth * usage.avgInputTokensPerRequest;
    const outputTokens = usage.requestsPerMonth * usage.avgOutputTokensPerRequest;
    
    const inputCost = (inputTokens / 1_000_000) * (plan.overagePricing.inputPerMTok || 0);
    const outputCost = (outputTokens / 1_000_000) * (plan.overagePricing.outputPerMTok || 0);
    
    overageCost = inputCost + outputCost;
  }

  // For API-only plans, just show usage cost
  if (plan.payPerUse && plan.monthlyCost === 0) {
    return {
      subscriptionCost: 0,
      overageCost,
      totalCost: overageCost,
      withinLimits: true,
      limitStatus: 'Pay-per-use',
    };
  }

  return {
    subscriptionCost,
    overageCost,
    totalCost: subscriptionCost + overageCost,
    withinLimits,
    limitStatus,
  };
}

// Find best value plan for given usage
export function findBestValuePlans(
  usage: UsageProfile,
  providers?: string[]
): Array<{
  plan: ProviderPlan;
  cost: ReturnType<typeof calculatePlanCost>;
  rank: number;
  valueScore: number;
}> {
  let plans = PROVIDER_PLANS;
  
  if (providers && providers.length > 0) {
    plans = plans.filter(p => providers.includes(p.provider));
  }

  const results = plans.map(plan => {
    const cost = calculatePlanCost(plan, usage);
    return {
      plan,
      cost,
      valueScore: 0,
      rank: 0,
    };
  });

  // Sort by total cost
  results.sort((a, b) => a.cost.totalCost - b.cost.totalCost);

  // Assign ranks and calculate value score
  results.forEach((result, index) => {
    result.rank = index + 1;
    // Value score: requests per dollar
    result.valueScore = usage.requestsPerMonth / (result.cost.totalCost || 1);
  });

  return results;
}

// Preset usage profiles
export const USAGE_PRESETS = {
  light: {
    name: 'Light Usage',
    description: 'Occasional coding help',
    requestsPerMonth: 50,
    avgInputTokensPerRequest: 2000,
    avgOutputTokensPerRequest: 1000,
  },
  moderate: {
    name: 'Moderate Usage',
    description: 'Regular development work',
    requestsPerMonth: 300,
    avgInputTokensPerRequest: 3000,
    avgOutputTokensPerRequest: 1500,
  },
  heavy: {
    name: 'Heavy Usage',
    description: 'Intensive daily coding',
    requestsPerMonth: 1000,
    avgInputTokensPerRequest: 4000,
    avgOutputTokensPerRequest: 2000,
  },
  team: {
    name: 'Team Usage',
    description: 'Small team (5 users)',
    requestsPerMonth: 2500,
    avgInputTokensPerRequest: 3500,
    avgOutputTokensPerRequest: 1800,
  },
  enterprise: {
    name: 'Enterprise Usage',
    description: 'Large team (20+ users)',
    requestsPerMonth: 10000,
    avgInputTokensPerRequest: 4000,
    avgOutputTokensPerRequest: 2000,
  },
};

// Original model pricing (kept for backwards compatibility)
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
