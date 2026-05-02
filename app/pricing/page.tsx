'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { DEFAULT_MODELS } from '@/lib/pricing';
import { ArrowUpDown, Sparkles, Zap, Crown, ExternalLink } from 'lucide-react';

interface SortConfig {
  key: 'name' | 'provider' | 'inputPrice' | 'outputPrice' | 'cachedReadPrice' | 'contextWindow';
  direction: 'asc' | 'desc';
}

export default function PricingPage() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'inputPrice',
    direction: 'asc',
  });
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const providers = useMemo(() => {
    const unique = new Set(DEFAULT_MODELS.map(m => m.provider));
    return Array.from(unique);
  }, []);

  const filteredAndSortedModels = useMemo(() => {
    let models = [...DEFAULT_MODELS];
    
    if (selectedProvider) {
      models = models.filter(m => m.provider === selectedProvider);
    }

    return models.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortConfig, selectedProvider]);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  const formatContextWindow = (tokens: number) => {
    if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
    return tokens.toString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
          <p className="text-sm text-muted-foreground">
            Compare model pricing across providers. All prices per 1M tokens.
          </p>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* OpenCode Zen */}
        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-base font-semibold">OpenCode Zen</CardTitle>
              </div>
              <Badge variant="secondary">Pay-per-use</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold">Variable</div>
              <p className="text-xs text-muted-foreground">Based on token usage</p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Access to all models</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Premium models available</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">No subscription required</span>
              </li>
            </ul>
            <a href="https://opencode.ai/zen" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full" variant="outline" size="sm">
                Learn more
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* FirePass Unlimited */}
        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-red-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-orange-500" />
                <CardTitle className="text-base font-semibold">FirePass Unlimited</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">Subscription</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold">$7<span className="text-sm font-normal text-muted-foreground">/week</span></div>
              <p className="text-xs text-muted-foreground">~$30/month • Unlimited tokens</p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Kimi K2.5 Turbo access</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Zero token pricing</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Unlimited usage</span>
              </li>
            </ul>
            <a href="https://firepass.ai" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full" variant="outline" size="sm">
                Learn more
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* OpenCode Go */}
        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <CardTitle className="text-base font-semibold">OpenCode Go</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">Subscription</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg line-through text-muted-foreground">$10</span>
                <span className="text-2xl font-bold">$5</span>
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground">First month, then $10/month</p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Generous usage limits</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Open source models</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Reliable access</span>
              </li>
            </ul>
            <a href="https://opencode.ai/go" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full" variant="outline" size="sm">
                Learn more
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedProvider === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedProvider(null)}
        >
          All Providers
        </Button>
        {providers.map(provider => (
          <Button
            key={provider}
            variant={selectedProvider === provider ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedProvider(provider === selectedProvider ? null : provider)}
          >
            {provider}
          </Button>
        ))}
      </div>

      {/* Pricing Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-2 font-medium"
                      onClick={() => handleSort('name')}
                    >
                      Model
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-2 font-medium"
                      onClick={() => handleSort('provider')}
                    >
                      Provider
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-2 font-medium"
                      onClick={() => handleSort('inputPrice')}
                    >
                      Input / 1M
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-2 font-medium"
                      onClick={() => handleSort('cachedReadPrice')}
                    >
                      Cache Read / 1M
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-2 font-medium"
                      onClick={() => handleSort('outputPrice')}
                    >
                      Output / 1M
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-2 font-medium"
                      onClick={() => handleSort('contextWindow')}
                    >
                      Context
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedModels.map((model) => (
                  <TableRow key={model.id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{model.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{model.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {model.provider}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(model.inputPrice)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(model.cachedReadPrice)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(model.outputPrice)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatContextWindow(model.contextWindow)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Prices are per 1 million tokens. Cache write prices are not shown in the table but are available in the model details. 
          All pricing data is sourced from the official OpenCode documentation. Last updated: April 2025.
        </p>
      </div>
    </div>
  );
}
