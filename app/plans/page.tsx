'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PROVIDER_PLANS,
  USAGE_PRESETS,
  calculatePlanCost,
  findBestValuePlans,
  UsageProfile,
  ProviderPlan,
} from '@/lib/planComparison';
import { 
  Calculator, 
  TrendingDown, 
  Crown, 
  Zap, 
  Check,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PlanComparisonPage() {
  const [requestsPerMonth, setRequestsPerMonth] = useState(300);
  const [avgInputTokens, setAvgInputTokens] = useState(3000);
  const [avgOutputTokens, setAvgOutputTokens] = useState(1500);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [showAllPlans, setShowAllPlans] = useState(false);

  const usage: UsageProfile = {
    requestsPerMonth,
    avgInputTokensPerRequest: avgInputTokens,
    avgOutputTokensPerRequest: avgOutputTokens,
  };

  const bestValuePlans = useMemo(() => {
    return findBestValuePlans(usage, selectedProviders.length > 0 ? selectedProviders : undefined);
  }, [usage, selectedProviders]);

  const top3Plans = bestValuePlans.slice(0, 3);
  const displayedPlans = showAllPlans ? bestValuePlans : top3Plans;

  const providers = Array.from(new Set(PROVIDER_PLANS.map(p => p.provider)));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      'OpenAI Codex': 'bg-blue-500/10 text-blue-600 border-blue-200',
      'Claude': 'bg-orange-500/10 text-orange-600 border-orange-200',
      'OpenCode Zen': 'bg-purple-500/10 text-purple-600 border-purple-200',
      'OpenCode Go': 'bg-green-500/10 text-green-600 border-green-200',
      'FirePass': 'bg-red-500/10 text-red-600 border-red-200',
      'Crof AI': 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
    };
    return colors[provider] || 'bg-gray-500/10 text-gray-600 border-gray-200';
  };

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'free':
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">Free</Badge>;
      case 'usage-based':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">Pay-as-you-go</Badge>;
      default:
        return <Badge variant="secondary">Subscription</Badge>;
    }
  };

  const totalTokensPerMonth = requestsPerMonth * (avgInputTokens + avgOutputTokens);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Plan Comparison Calculator</h1>
            <Badge variant="secondary" className="font-mono">
              {PROVIDER_PLANS.length} plans
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Compare all AI coding assistant plans from OpenAI, Claude, OpenCode, FirePass, and Crof AI
          </p>
        </div>
      </div>

      {/* Usage Calculator */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Usage Profile
          </CardTitle>
          <CardDescription>
            Adjust your expected usage to see which plan offers the best value
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(USAGE_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => {
                  setRequestsPerMonth(preset.requestsPerMonth);
                  setAvgInputTokens(preset.avgInputTokensPerRequest);
                  setAvgOutputTokens(preset.avgOutputTokensPerRequest);
                }}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>

          {/* Request Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <label className="font-medium">Requests per Month</label>
              <span className="text-muted-foreground font-mono">{requestsPerMonth.toLocaleString()}</span>
            </div>
            <Slider
              value={[requestsPerMonth]}
              onValueChange={(value) => setRequestsPerMonth(Array.isArray(value) ? value[0] : value)}
              min={10}
              max={20000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>10,000</span>
              <span>20,000</span>
            </div>
          </div>

          {/* Token Inputs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Avg Input Tokens</label>
              <Input
                type="number"
                value={avgInputTokens}
                onChange={(e) => setAvgInputTokens(Number(e.target.value))}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">Tokens sent to the model per request</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Avg Output Tokens</label>
              <Input
                type="number"
                value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">Tokens received per response</p>
            </div>
          </div>

          {/* Usage Summary */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Tokens/Month:</span>
              <span className="font-mono font-medium">{totalTokensPerMonth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Est. Cost Range:</span>
              <span className="font-mono font-medium">
                {formatCurrency(bestValuePlans[0]?.cost.totalCost || 0)} - {formatCurrency(bestValuePlans[bestValuePlans.length - 1]?.cost.totalCost || 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Filter by Provider</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedProviders.length === 0 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedProviders([])}
          >
            All Providers
          </Button>
          {providers.map(provider => (
            <Button
              key={provider}
              variant={selectedProviders.includes(provider) ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedProviders(prev => 
                  prev.includes(provider) 
                    ? prev.filter(p => p !== provider)
                    : [...prev, provider]
                );
              }}
              className={cn(
                selectedProviders.includes(provider) && getProviderColor(provider)
              )}
            >
              {provider}
            </Button>
          ))}
        </div>
      </div>

      {/* Top 3 Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Top Recommendations
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          {top3Plans.map((result, index) => (
            <Card 
              key={result.plan.id} 
              className={cn(
                "relative overflow-hidden border-2 transition-all",
                index === 0 
                  ? "border-yellow-400 shadow-lg" 
                  : index === 1 
                    ? "border-gray-300" 
                    : "border-orange-300"
              )}
            >
              {/* Rank Badge */}
              <div className={cn(
                "absolute -right-8 -top-8 w-16 h-16 rotate-45 flex items-end justify-center pb-2 text-xs font-bold",
                index === 0 ? "bg-yellow-400 text-yellow-900" : 
                index === 1 ? "bg-gray-300 text-gray-700" : 
                "bg-orange-300 text-orange-800"
              )}>
                #{index + 1}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge 
                      variant="outline" 
                      className={cn("mb-2", getProviderColor(result.plan.provider))}
                    >
                      {result.plan.provider}
                    </Badge>
                    <CardTitle className="text-base">{result.plan.name}</CardTitle>
                  </div>
                  {getSubscriptionBadge(result.plan.subscriptionType)}
                </div>
                <CardDescription className="text-xs">
                  {result.plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{formatCurrency(result.cost.totalCost)}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  {result.cost.overageCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Includes {formatCurrency(result.cost.overageCost)} overage
                    </p>
                  )}
                </div>

                {/* Value Score */}
                <div className="rounded-lg bg-muted/50 p-2">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">
                      {Math.round(result.valueScore)} requests per $
                    </span>
                  </div>
                </div>

                {/* Limit Status */}
                <div className="flex items-center gap-2 text-xs">
                  {result.cost.withinLimits ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600">{result.cost.limitStatus}</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-destructive" />
                      <span className="text-destructive">{result.cost.limitStatus}</span>
                    </>
                  )}
                </div>

                {/* Expand Details */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setExpandedPlan(expandedPlan === result.plan.id ? null : result.plan.id)}
                >
                  {expandedPlan === result.plan.id ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" /> Less details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" /> More details
                    </>
                  )}
                </Button>

                {expandedPlan === result.plan.id && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground">Features:</p>
                    <ul className="space-y-1">
                      {result.plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                          <Zap className="h-3 w-3 mt-0.5 text-yellow-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full Comparison Table */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Complete Plan Comparison</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllPlans(!showAllPlans)}
            >
              {showAllPlans ? 'Show Top 3 Only' : 'Show All Plans'}
            </Button>
          </div>
        </CardHeader>
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
                  <TableHead className="text-right">Overage</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Limits</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPlans.map((result, index) => (
                  <TableRow 
                    key={result.plan.id}
                    className={cn(
                      index < 3 && "bg-muted/30",
                      index === 0 && "bg-yellow-50/50 dark:bg-yellow-950/10"
                    )}
                  >
                    <TableCell className="font-medium">
                      {index < 3 ? (
                        <Crown className={cn(
                          "h-4 w-4",
                          index === 0 ? "text-yellow-500" :
                          index === 1 ? "text-gray-400" :
                          "text-orange-400"
                        )} />
                      ) : (
                        <span className="text-muted-foreground">{index + 1}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{result.plan.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getProviderColor(result.plan.provider)}>
                        {result.plan.provider}
                      </Badge>
                    </TableCell>
                    <TableCell>{getSubscriptionBadge(result.plan.subscriptionType)}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(result.cost.subscriptionCost)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {result.cost.overageCost > 0 ? formatCurrency(result.cost.overageCost) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(result.cost.totalCost)}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.cost.withinLimits ? (
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-destructive">
                          <X className="h-4 w-4" />
                          <Info className="h-3 w-3" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <span className="text-emerald-600 font-medium">
                        {Math.round(result.valueScore)}
                      </span>
                      <span className="text-muted-foreground text-xs"> req/$</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Provider Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">OpenAI Codex</CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href="https://developers.openai.com/codex/pricing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View official pricing
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Claude</CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href="https://claude.com/pricing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View official pricing
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">OpenCode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="https://opencode.ai/go" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Go pricing
              <ExternalLink className="h-3 w-3" />
            </a>
            <a 
              href="https://opencode.ai/zen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Zen pricing
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Pricing and limits are estimates based on publicly available information as of May 2025. 
          Actual pricing may vary. Some plans have complex usage calculations that cannot be fully represented here. 
          Always verify current pricing on the official provider websites before making a purchase decision.
        </p>
      </div>
    </div>
  );
}
