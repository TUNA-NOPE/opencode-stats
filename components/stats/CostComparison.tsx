'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { OpenCodeStats, ModelPricing } from '@/types';
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
  
  const getSavingsBadge = (estimatedCost: number) => {
    const diff = estimatedCost - currentCost;
    const percentDiff = ((diff / currentCost) * 100);
    
    if (Math.abs(percentDiff) < 5) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Minus className="h-3 w-3" />
          Similar
        </Badge>
      );
    }
    
    if (diff < 0) {
      return (
        <Badge variant="default" className="bg-green-500 flex items-center gap-1">
          <ArrowDown className="h-3 w-3" />
          Save {Math.abs(percentDiff).toFixed(0)}%
        </Badge>
      );
    }
    
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <ArrowUp className="h-3 w-3" />
        +{percentDiff.toFixed(0)}%
      </Badge>
    );
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cost Comparison Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Your Current Usage</div>
            <div className="text-2xl font-bold">{formatCurrency(currentCost)}</div>
            <div className="text-sm text-muted-foreground">
              Based on {stats.overview.sessions} sessions with {((tokens.input + tokens.output) / 1_000_000).toFixed(1)}M tokens
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">Input/1M</TableHead>
                  <TableHead className="text-right">Output/1M</TableHead>
                  <TableHead className="text-right">Cached/1M</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                  <TableHead className="text-center">vs Current</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisons.map((comparison) => (
                  <TableRow key={comparison.model.id}>
                    <TableCell className="font-medium">
                      {comparison.model.name}
                    </TableCell>
                    <TableCell>{comparison.model.provider}</TableCell>
                    <TableCell className="text-right">
                      ${comparison.model.inputPrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${comparison.model.outputPrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${comparison.model.cachedReadPrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(comparison.totalCost)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getSavingsBadge(comparison.totalCost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisons.slice(0, 3).map((comparison) => (
              <div key={comparison.model.id} className="p-4 border rounded-lg">
                <div className="font-medium">{comparison.model.name}</div>
                <div className="text-sm text-muted-foreground mb-2">
                  {comparison.model.provider}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Input:</span>
                    <span>{formatCurrency(comparison.inputCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output:</span>
                    <span>{formatCurrency(comparison.outputCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Read:</span>
                    <span>{formatCurrency(comparison.cacheReadCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Write:</span>
                    <span>{formatCurrency(comparison.cacheWriteCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(comparison.totalCost)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
