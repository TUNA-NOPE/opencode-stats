'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OpenCodeStats } from '@/types';
import { compareCosts, calculateCost, DEFAULT_MODELS } from '@/lib/pricing';
import { ArrowDown, ArrowUp, Minus, Infinity } from 'lucide-react';

interface CostComparisonProps {
  stats: OpenCodeStats;
  currentCost: number;
}

export function CostComparison({ stats, currentCost }: CostComparisonProps) {
  const { tokens, overview } = stats;

  // Find FirePass Kimi K2.5 Turbo model
  const firepassKimiModel = DEFAULT_MODELS.find(m => m.id === 'firepass/kimi-k2-5-turbo');
  
  // Calculate subscription-based cost: $7/week, adjusted for actual usage period
  // If user has data for X days, we calculate how many weeks that represents
  const weeksOfUsage = overview.days / 7;
  const actualFirepassCost = firepassKimiModel?.subscriptionCost 
    ? firepassKimiModel.subscriptionCost * Math.max(1, weeksOfUsage)
    : 7.00; // Default to $7 if no usage data

  const comparisons = compareCosts(
    tokens.input,
    tokens.output,
    tokens.cacheRead,
    tokens.cacheWrite,
    DEFAULT_MODELS
  );

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getSavingsIndicator = (estimatedCost: number, isSubscription = false) => {
    // Baseline is $7/week FirePass subscription
    const baselineCost = 7.00;
    const diff = estimatedCost - baselineCost;
    const percentDiff = ((diff / baselineCost) * 100);

    // For unlimited subscription, show special indicator
    if (isSubscription) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600">
          <Infinity className="h-3 w-3" />
          Unlimited
        </span>
      );
    }

    if (Math.abs(percentDiff) < 5) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Minus className="h-3 w-3" />
          Similar
        </span>
      );
    }

    if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
          <ArrowDown className="h-3 w-3" />
          Save {Math.abs(percentDiff).toFixed(0)}%
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
        <ArrowUp className="h-3 w-3" />
        +{percentDiff.toFixed(0)}%
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Current Usage Summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="sm:col-span-2 lg:col-span-1 border-border/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-orange-700 dark:text-orange-300">
              FirePass Unlimited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight font-mono text-orange-900 dark:text-orange-100">
              $7.00<span className="text-sm font-normal text-muted-foreground">/week</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.overview.sessions} sessions · {overview.days} days
            </p>
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mt-2">
              ∞ Unlimited Kimi K2.5 Turbo
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              (vs ${currentCost.toFixed(2)} if on OpenCode Zen)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Input Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold tracking-tight font-mono">
              {(tokens.input / 1_000_000).toFixed(1)}M
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Output Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold tracking-tight font-mono">
              {(tokens.output / 1_000_000).toFixed(1)}M
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Cache Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold tracking-tight font-mono">
              {((tokens.cacheRead + tokens.cacheWrite) / 1_000_000).toFixed(1)}M
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Model Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-medium">Model</TableHead>
                  <TableHead className="text-xs font-medium">Provider</TableHead>
                  <TableHead className="text-xs font-medium text-right">Input/1M</TableHead>
                  <TableHead className="text-xs font-medium text-right">Output/1M</TableHead>
                  <TableHead className="text-xs font-medium text-right">Cached/1M</TableHead>
                  <TableHead className="text-xs font-medium text-right">Est. Cost</TableHead>
                  <TableHead className="text-xs font-medium text-center">vs Current</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisons.map((comparison) => {
                  const isSubscription = !!comparison.model.subscriptionCost;
                  return (
                    <TableRow key={comparison.model.id} className={`hover:bg-muted/30 ${isSubscription ? 'bg-orange-50/50 dark:bg-orange-950/10' : ''}`}>
                      <TableCell className="font-medium text-sm">
                        {comparison.model.name}
                        {isSubscription && (
                          <span className="ml-2 text-xs text-orange-600 font-medium">★</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {comparison.model.provider}
                      </TableCell>
                      <TableCell className="text-right text-sm font-mono">
                        {isSubscription ? '—' : `$${comparison.model.inputPrice.toFixed(3)}`}
                      </TableCell>
                      <TableCell className="text-right text-sm font-mono">
                        {isSubscription ? '—' : `$${comparison.model.outputPrice.toFixed(3)}`}
                      </TableCell>
                      <TableCell className="text-right text-sm font-mono">
                        {isSubscription ? '—' : `$${comparison.model.cachedReadPrice.toFixed(3)}`}
                      </TableCell>
                      <TableCell className="text-right text-sm font-mono font-medium">
                        {isSubscription ? `$${comparison.model.subscriptionCost}/wk` : formatCurrency(comparison.totalCost)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getSavingsIndicator(comparison.totalCost, isSubscription)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Show FirePass first as current plan */}
        {firepassKimiModel && (
          <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  {firepassKimiModel.name}
                </CardTitle>
                {getSavingsIndicator(0, true)}
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300">{firepassKimiModel.provider}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-mono font-medium">Unlimited</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Weekly Rate</span>
                  <span className="font-mono">${firepassKimiModel.subscriptionCost}/week</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-orange-200 dark:border-orange-800 pt-2 mt-2">
                <span className="text-sm font-medium">Your Cost</span>
                <span className="font-mono font-semibold text-orange-700 dark:text-orange-300">~$7-30/mo</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Show top 2 alternatives */}
        {comparisons.filter(c => !c.model.subscriptionCost).slice(0, 2).map((comparison) => (
          <Card key={comparison.model.id} className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{comparison.model.name}</CardTitle>
                {getSavingsIndicator(comparison.totalCost)}
              </div>
              <p className="text-xs text-muted-foreground">{comparison.model.provider}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1.5">
                {[
                  { label: 'Input', value: comparison.inputCost },
                  { label: 'Output', value: comparison.outputCost },
                  { label: 'Cache Read', value: comparison.cacheReadCost },
                  { label: 'Cache Write', value: comparison.cacheWriteCost },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-2 mt-2">
                <span className="text-sm font-medium">Est. Cost</span>
                <span className="font-mono font-semibold">{formatCurrency(comparison.totalCost)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
