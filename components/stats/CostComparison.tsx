'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OpenCodeStats } from '@/types';
import { compareCosts, DEFAULT_MODELS } from '@/lib/pricing';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface CostComparisonProps {
  stats: OpenCodeStats;
  currentCost: number;
}

export function CostComparison({ stats, currentCost }: CostComparisonProps) {
  const { tokens } = stats;

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

  const getSavingsIndicator = (estimatedCost: number) => {
    const diff = estimatedCost - currentCost;
    const percentDiff = ((diff / currentCost) * 100);

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
        <Card className="sm:col-span-2 lg:col-span-1 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Current Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight font-mono">
              {formatCurrency(currentCost)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.overview.sessions} sessions
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
                {comparisons.map((comparison) => (
                  <TableRow key={comparison.model.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-sm">
                      {comparison.model.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {comparison.model.provider}
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono">
                      ${comparison.model.inputPrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono">
                      ${comparison.model.outputPrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono">
                      ${comparison.model.cachedReadPrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono font-medium">
                      {formatCurrency(comparison.totalCost)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getSavingsIndicator(comparison.totalCost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {comparisons.slice(0, 3).map((comparison) => (
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
                <span className="text-sm font-medium">Total</span>
                <span className="font-mono font-semibold">{formatCurrency(comparison.totalCost)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
