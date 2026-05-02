'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OpenCodeStats } from '@/types';
import { 
  PROVIDER_PLANS, 
  ProviderPlan,
  calculatePlanCost,
  UsageProfile 
} from '@/lib/planComparison';
import { 
  Loader2, 
  RefreshCw, 
  TrendingDown, 
  Wallet, 
  Zap, 
  Crown,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Activity,
  Coins,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Current plan constants
const CURRENT_PLAN_ID = 'firepass-unlimited';
const CURRENT_PLAN_NAME = 'FirePass Unlimited';
const CURRENT_PLAN_COST = 30.33; // $7/week * 52/12 = $30.33/month

interface PlanComparison {
  plan: ProviderPlan;
  cost: ReturnType<typeof calculatePlanCost>;
  savings: number;
  isCheaper: boolean;
}

export default function MyUsagePage() {
  const [stats, setStats] = useState<OpenCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{
    cachedAt: string | null;
    isCached: boolean;
    cacheAge: string;
  } | null>(null);

  const fetchStats = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const url = forceRefresh ? '/api/stats?refresh=true' : '/api/stats';
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
        setCacheInfo({
          cachedAt: data.cachedAt,
          isCached: data.isCached,
          cacheAge: data.cacheAge
        });
      } else {
        setError(data.error || 'Failed to fetch stats');
      }
    } catch {
      setError('Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStats();
  }, []);

  // Calculate plan comparisons
  const planComparisons = useMemo<PlanComparison[]>(() => {
    if (!stats) return [];

    // Estimate monthly usage from current stats
    // Assume current stats represent partial month data
    const daysActive = stats.overview.days || 1;
    const daysInMonth = 30;
    const monthlyMultiplier = daysInMonth / daysActive;

    // Estimate monthly requests (messages as proxy)
    const estimatedMonthlyRequests = Math.round(stats.overview.messages * monthlyMultiplier);
    
    // Estimate average tokens per request
    const totalTokens = stats.tokens.input + stats.tokens.output + stats.tokens.cacheRead + stats.tokens.cacheWrite;
    const avgTokensPerRequest = stats.overview.messages > 0 
      ? Math.round(totalTokens / stats.overview.messages) 
      : 3000;
    
    const avgInputTokens = Math.round(avgTokensPerRequest * 0.6); // 60% input
    const avgOutputTokens = Math.round(avgTokensPerRequest * 0.4); // 40% output

    const usage: UsageProfile = {
      requestsPerMonth: estimatedMonthlyRequests,
      avgInputTokensPerRequest: avgInputTokens,
      avgOutputTokensPerRequest: avgOutputTokens,
    };

    return PROVIDER_PLANS.map(plan => {
      const cost = calculatePlanCost(plan, usage);
      const savings = CURRENT_PLAN_COST - cost.totalCost;
      const isCheaper = cost.totalCost < CURRENT_PLAN_COST;
      
      return {
        plan,
        cost,
        savings,
        isCheaper,
      };
    }).sort((a, b) => a.cost.totalCost - b.cost.totalCost);
  }, [stats]);

  // Get top 3 cheaper alternatives
  const cheaperAlternatives = useMemo(() => {
    return planComparisons
      .filter(p => p.isCheaper && p.plan.id !== CURRENT_PLAN_ID)
      .slice(0, 3);
  }, [planComparisons]);

  // Get current plan from comparisons
  const currentPlanComparison = useMemo(() => {
    return planComparisons.find(p => p.plan.id === CURRENT_PLAN_ID);
  }, [planComparisons]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your usage data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button onClick={() => fetchStats()} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No usage data available.</p>
      </div>
    );
  }

  const totalTokens = stats.tokens.input + stats.tokens.output + stats.tokens.cacheRead + stats.tokens.cacheWrite;
  const avgTokensPerSession = stats.overview.sessions > 0 ? Math.round(totalTokens / stats.overview.sessions) : 0;
  const avgTokensPerMessage = stats.overview.messages > 0 ? Math.round(totalTokens / stats.overview.messages) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Usage</h1>
          <p className="text-sm text-muted-foreground">
            Your actual OpenCode usage with plan comparison
          </p>
        </div>
        <div className="flex items-center gap-3">
          {cacheInfo?.isCached ? (
            <span className="text-xs text-muted-foreground">
              Cached {cacheInfo.cacheAge} ago
            </span>
          ) : cacheInfo ? (
            <span className="text-xs font-medium text-emerald-600">Live</span>
          ) : null}
          <Button
            onClick={() => fetchStats(true)}
            variant="outline"
            size="sm"
            disabled={loading}
            className="h-8"
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Current Usage Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-3.5 w-3.5" />
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats.overview.sessions.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats.overview.messages.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Days Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats.overview.days}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5" />
              Total Cost (Zen)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-orange-600">
              {formatCurrency(stats.cost.totalCost)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Subscription: FirePass Unlimited ${CURRENT_PLAN_COST.toFixed(2)}/month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Token Breakdown */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Token Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Input Tokens</p>
              <p className="text-lg font-semibold font-mono">{formatNumber(stats.tokens.input)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Output Tokens</p>
              <p className="text-lg font-semibold font-mono">{formatNumber(stats.tokens.output)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Cache Read</p>
              <p className="text-lg font-semibold font-mono">{formatNumber(stats.tokens.cacheRead)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Cache Write</p>
              <p className="text-lg font-semibold font-mono">{formatNumber(stats.tokens.cacheWrite)}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Tokens per Session:</span>
              <span className="font-mono font-medium">{formatNumber(avgTokensPerSession)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Tokens per Message:</span>
              <span className="font-mono font-medium">{formatNumber(avgTokensPerMessage)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Card */}
      <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">{CURRENT_PLAN_NAME}</CardTitle>
              </div>
              <CardDescription className="mt-1">
                Your current plan with unlimited Kimi K2.5 Turbo access
              </CardDescription>
            </div>
            <Badge className="bg-orange-500 text-white">CURRENT PLAN</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{formatCurrency(CURRENT_PLAN_COST)}</span>
            <span className="text-sm text-muted-foreground">/month</span>
            <span className="text-xs text-muted-foreground ml-2">($7/week)</span>
          </div>
          
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Unlimited tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Kimi K2.5 Turbo access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Zero token pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Weekly billing</span>
            </div>
          </div>

          <div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3">
            <p className="text-sm">
              <strong>Note:</strong> Your actual usage would have cost{' '}
              <span className="font-bold text-orange-700 dark:text-orange-300">
                {formatCurrency(stats.cost.totalCost)}
              </span>{' '}
              on OpenCode Zen pay-per-use pricing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Plans Comparison */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-emerald-500" />
          Plan Comparison
        </h2>
        <p className="text-sm text-muted-foreground">
          Based on your estimated monthly usage ({formatNumber(Math.round(stats.overview.messages * (30 / (stats.overview.days || 1))))} messages/month)
        </p>

        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Monthly Cost</TableHead>
                    <TableHead className="text-center">vs FirePass</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planComparisons.slice(0, 15).map((comparison, index) => {
                    const isCurrentPlan = comparison.plan.id === CURRENT_PLAN_ID;
                    const savings = CURRENT_PLAN_COST - comparison.cost.totalCost;
                    
                    return (
                      <TableRow 
                        key={comparison.plan.id}
                        className={cn(
                          isCurrentPlan && "bg-orange-50/50 dark:bg-orange-950/10",
                          comparison.isCheaper && !isCurrentPlan && "bg-emerald-50/30 dark:bg-emerald-950/10"
                        )}
                      >
                        <TableCell className="font-medium">
                          {isCurrentPlan ? (
                            <Crown className="h-4 w-4 text-orange-500" />
                          ) : (
                            <span className={cn(
                              "text-muted-foreground",
                              index < 3 && "font-semibold"
                            )}>
                              {index + 1}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {comparison.plan.name}
                          {isCurrentPlan && (
                            <Badge variant="secondary" className="ml-2 bg-orange-500/10 text-orange-600">
                              Current
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {comparison.plan.provider}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {comparison.plan.subscriptionType === 'free' && (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">Free</Badge>
                          )}
                          {comparison.plan.subscriptionType === 'usage-based' && (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">Pay-as-you-go</Badge>
                          )}
                          {comparison.plan.subscriptionType === 'monthly' && (
                            <Badge variant="secondary">Monthly</Badge>
                          )}
                          {comparison.plan.subscriptionType === 'yearly' && (
                            <Badge variant="secondary">Yearly</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(comparison.cost.totalCost)}
                        </TableCell>
                        <TableCell className="text-center">
                          {isCurrentPlan ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : comparison.isCheaper ? (
                            <Badge className="bg-emerald-500 text-white">
                              Save {formatCurrency(savings)}/mo
                            </Badge>
                          ) : (
                            <span className="text-xs text-destructive">
                              +{formatCurrency(Math.abs(savings))}/mo
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Recommendations */}
      {cheaperAlternatives.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Top Money-Saving Alternatives
          </h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            {cheaperAlternatives.map((alternative, index) => (
              <Card 
                key={alternative.plan.id} 
                className="border-emerald-200 dark:border-emerald-800"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">#{index + 1} Alternative</Badge>
                    <Badge className="bg-emerald-500 text-white">
                      Save {formatCurrency(alternative.savings)}/mo
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{alternative.plan.name}</CardTitle>
                  <CardDescription>{alternative.plan.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{formatCurrency(alternative.cost.totalCost)}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {alternative.plan.description}
                  </div>

                  <div className="space-y-1">
                    {alternative.plan.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {alternative.cost.overageCost > 0 && (
                    <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
                      <AlertCircle className="h-3 w-3 mt-0.5" />
                      <span>Includes {formatCurrency(alternative.cost.overageCost)} estimated overage</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pros and Cons */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Pros of Staying with FirePass
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1.5 text-emerald-500" />
                <span><strong>Unlimited usage</strong> — Never worry about hitting limits</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1.5 text-emerald-500" />
                <span><strong>Predictable cost</strong> — Flat ${CURRENT_PLAN_COST.toFixed(2)}/month regardless of usage</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1.5 text-emerald-500" />
                <span><strong>Kimi K2.5 Turbo</strong> — High-quality model included</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1.5 text-emerald-500" />
                <span><strong>No overage surprises</strong> — Bills stay consistent</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-blue-500" />
              Reasons to Consider Switching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1.5 text-blue-500" />
                <span><strong>Potential savings</strong> — Could save up to {cheaperAlternatives.length > 0 ? formatCurrency(cheaperAlternatives[0]?.savings || 0) : '$0'}/month</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1.5 text-blue-500" />
                <span><strong>Access to other models</strong> — Claude, GPT, Gemini options</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1.5 text-blue-500" />
                <span><strong>Free tiers available</strong> — Some alternatives start at $0</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1.5 text-blue-500" />
                <span><strong>Pay for what you use</strong> — If usage is low, costs could be lower</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-border/50 bg-muted/30 p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> These calculations are estimates based on your current usage patterns 
          projected to a full month. Actual costs may vary based on usage fluctuations, model selection, 
          and provider pricing changes. Some plans have complex pricing structures (overages, rate limits, 
          token-based billing) that may affect actual costs. Always verify current pricing on official 
          provider websites before making decisions.
        </p>
      </div>
    </div>
  );
}
