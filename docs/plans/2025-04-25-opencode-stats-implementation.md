# OpenCode Stats Dashboard - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Next.js app with Bun that fetches OpenCode stats and displays analytics with cost comparison across models

**Architecture:** Local Next.js 15 app with API routes to execute `opencode stats` via child_process, parse terminal output, and display using shadcn/ui components with Recharts for visualizations

**Tech Stack:** Next.js 15, React 19, TypeScript, Bun, Tailwind CSS, shadcn/ui, Recharts, Lucide React

---

## Task 1: Initialize Next.js Project with Bun

**Files:**
- Create: All project files via `bun create next-app`

**Step 1: Create project directory and initialize**

```bash
cd /home/relu/Projects/AiUsege
bun create next-app@latest opencode-stats --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-bun --no-turbopack
```

**Step 2: Verify project structure**

```bash
cd opencode-stats
ls -la
```

Expected: `app/`, `public/`, `package.json`, `next.config.ts`, `tsconfig.json`

**Step 3: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project with Bun"
```

---

## Task 2: Install Dependencies (shadcn/ui, Recharts, Utilities)

**Files:**
- Modify: `package.json`
- Create: `components.json`

**Step 1: Initialize shadcn/ui**

```bash
cd /home/relu/Projects/AiUsege/opencode-stats
bunx shadcn@latest init -y --base-color neutral
```

**Step 2: Install required shadcn components**

```bash
bunx shadcn@latest add card button badge tabs table separator
```

**Step 3: Install additional dependencies**

```bash
bun add recharts lucide-react
```

**Step 4: Verify installations**

```bash
bun list | grep -E "(recharts|lucide|class-variance|clsx|tailwind-merge)"
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add shadcn/ui, recharts, and dependencies"
```

---

## Task 3: Create TypeScript Types

**Files:**
- Create: `types/index.ts`

**Step 1: Write types**

```typescript
// types/index.ts

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
  inputPrice: number;  // per 1M tokens
  outputPrice: number; // per 1M tokens
  contextWindow: number;
}

export interface CostComparison {
  model: ModelPricing;
  estimatedInputCost: number;
  estimatedOutputCost: number;
  estimatedCacheCost: number;
  totalEstimatedCost: number;
}
```

**Step 2: Verify types compile**

```bash
bunx tsc --noEmit types/index.ts
```

Expected: No errors

**Step 3: Commit**

```bash
git add types/
git commit -m "feat: add TypeScript types for stats and pricing"
```

---

## Task 4: Create Stats Parser Utility

**Files:**
- Create: `lib/parsers.ts`
- Test: `lib/parsers.test.ts` (optional for now)

**Step 1: Write parser module**

```typescript
// lib/parsers.ts
import { OpenCodeStats, ToolUsage } from '@/types';

export function parseStatsOutput(output: string): OpenCodeStats {
  const lines = output.split('\n');
  
  // Parse Overview section
  const overviewSection = extractSection(lines, 'OVERVIEW');
  const overview = {
    sessions: extractNumber(overviewSection, 'Sessions'),
    messages: extractNumber(overviewSection, 'Messages'),
    days: extractNumber(overviewSection, 'Days'),
  };
  
  // Parse Cost & Tokens section
  const costSection = extractSection(lines, 'COST & TOKENS');
  const cost = {
    totalCost: extractCurrency(costSection, 'Total Cost'),
    avgCostPerDay: extractCurrency(costSection, 'Avg Cost/Day'),
    avgTokensPerSession: extractTokens(costSection, 'Avg Tokens/Session'),
    medianTokensPerSession: extractTokens(costSection, 'Median Tokens/Session'),
  };
  
  const tokens = {
    input: extractTokens(costSection, 'Input'),
    output: extractTokens(costSection, 'Output'),
    cacheRead: extractTokens(costSection, 'Cache Read'),
    cacheWrite: extractTokens(costSection, 'Cache Write'),
  };
  
  // Parse Tool Usage section
  const tools = parseToolUsage(lines);
  
  return { overview, cost, tokens, tools };
}

function extractSection(lines: string[], sectionName: string): string[] {
  const startIdx = lines.findIndex(line => line.includes(sectionName));
  if (startIdx === -1) return [];
  
  // Find next section or end
  const endIdx = lines.slice(startIdx + 1).findIndex(line => 
    line.includes('┌─') && !line.includes('│')
  );
  
  return endIdx === -1 
    ? lines.slice(startIdx)
    : lines.slice(startIdx, startIdx + endIdx + 1);
}

function extractNumber(lines: string[], key: string): number {
  const line = lines.find(l => l.includes(key));
  if (!line) return 0;
  const match = line.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
}

function extractCurrency(lines: string[], key: string): number {
  const line = lines.find(l => l.includes(key));
  if (!line) return 0;
  const match = line.match(/\$([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function extractTokens(lines: string[], key: string): number {
  const line = lines.find(l => l.includes(key));
  if (!line) return 0;
  // Handle formats like "148.3M", "346.1K", or plain numbers
  const match = line.match(/([\d.]+)([MK])?/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const suffix = match[2];
  
  if (suffix === 'M') return Math.round(value * 1000000);
  if (suffix === 'K') return Math.round(value * 1000);
  return Math.round(value);
}

function parseToolUsage(lines: string[]): ToolUsage[] {
  const sectionStart = lines.findIndex(line => line.includes('TOOL USAGE'));
  if (sectionStart === -1) return [];
  
  const tools: ToolUsage[] = [];
  
  for (let i = sectionStart + 1; i < lines.length; i++) {
    const line = lines[i];
    // Match pattern: tool_name ████████ 12345 (xx.x%)
    const match = line.match(/(\w+)\s+[█\s]+\d+\s+\(([\d.]+)%\)/);
    if (match) {
      const name = match[1];
      const percentage = parseFloat(match[2]);
      const callsMatch = line.match(/(\d+)\s+\(/);
      const calls = callsMatch ? parseInt(callsMatch[1], 10) : 0;
      
      tools.push({ name, calls, percentage });
    }
  }
  
  return tools;
}
```

**Step 2: Commit**

```bash
git add lib/parsers.ts
git commit -m "feat: add stats output parser"
```

---

## Task 5: Create API Route to Execute opencode stats

**Files:**
- Create: `app/api/stats/route.ts`

**Step 1: Write API route**

```typescript
// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseStatsOutput } from '@/lib/parsers';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Execute opencode stats command
    const { stdout, stderr } = await execAsync('opencode stats', {
      timeout: 30000, // 30 second timeout
      env: { ...process.env, PATH: process.env.PATH },
    });
    
    if (stderr) {
      console.warn('opencode stats stderr:', stderr);
    }
    
    // Parse the output
    const stats = parseStatsOutput(stdout);
    
    return NextResponse.json({ 
      success: true, 
      data: stats,
      raw: stdout 
    });
    
  } catch (error) {
    console.error('Failed to execute opencode stats:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stats. Make sure opencode is installed and in PATH.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
```

**Step 2: Test the API route**

```bash
bun run dev &
sleep 5
curl http://localhost:3000/api/stats
```

Expected: JSON response with success: true and data object

**Step 3: Commit**

```bash
git add app/api/stats/route.ts
git commit -m "feat: add API route to execute and parse opencode stats"
```

---

## Task 6: Create Pricing Data Module

**Files:**
- Create: `lib/pricing.ts`

**Step 1: Write pricing module with scraped data**

```typescript
// lib/pricing.ts
import { ModelPricing } from '@/types';

// Pricing data from opencode.ai/docs/zen/ (per 1M tokens)
export const DEFAULT_MODELS: ModelPricing[] = [
  // OpenCode Models (from user config)
  {
    id: 'antigravity-claude-opus-4-6-thinking',
    name: 'Claude Opus 4.6 Thinking',
    provider: 'Antigravity',
    inputPrice: 15.00,
    outputPrice: 75.00,
    contextWindow: 200000,
  },
  {
    id: 'antigravity-claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Antigravity',
    inputPrice: 3.00,
    outputPrice: 15.00,
    contextWindow: 200000,
  },
  {
    id: 'antigravity-gemini-3-pro',
    name: 'Gemini 3 Pro',
    provider: 'Antigravity',
    inputPrice: 1.25,
    outputPrice: 10.00,
    contextWindow: 1048576,
  },
  {
    id: 'antigravity-gemini-3-flash',
    name: 'Gemini 3 Flash',
    provider: 'Antigravity',
    inputPrice: 0.075,
    outputPrice: 0.30,
    contextWindow: 1048576,
  },
  {
    id: 'kimi-k2.5-turbo',
    name: 'Kimi K2.5 Turbo',
    provider: 'Fireworks AI',
    inputPrice: 0.50,
    outputPrice: 2.00,
    contextWindow: 256000,
  },
  {
    id: 'minimax-m2.7',
    name: 'MiniMax M2.7',
    provider: 'MiniMax',
    inputPrice: 0.20,
    outputPrice: 0.60,
    contextWindow: 1000000,
  },
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPrice: 2.50,
    outputPrice: 10.00,
    contextWindow: 128000,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputPrice: 0.150,
    outputPrice: 0.600,
    contextWindow: 128000,
  },
  {
    id: 'o3-mini',
    name: 'o3-mini',
    provider: 'OpenAI',
    inputPrice: 1.10,
    outputPrice: 4.40,
    contextWindow: 200000,
  },
  // Anthropic Models
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPrice: 3.00,
    outputPrice: 15.00,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    inputPrice: 15.00,
    outputPrice: 75.00,
    contextWindow: 200000,
  },
  // Google Models
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    inputPrice: 1.25,
    outputPrice: 10.00,
    contextWindow: 1000000,
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    inputPrice: 0.075,
    outputPrice: 0.30,
    contextWindow: 1000000,
  },
];

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  model: ModelPricing
): {
  inputCost: number;
  outputCost: number;
  cacheCost: number;
  totalCost: number;
} {
  // Calculate per 1M tokens
  const inputCost = (inputTokens / 1_000_000) * model.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * model.outputPrice;
  // Assume cache read is 50% of input price (common discount)
  const cacheCost = (cacheReadTokens / 1_000_000) * (model.inputPrice * 0.5);
  
  return {
    inputCost,
    outputCost,
    cacheCost,
    totalCost: inputCost + outputCost + cacheCost,
  };
}

export function compareCosts(
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  models: ModelPricing[] = DEFAULT_MODELS
) {
  return models.map(model => {
    const costs = calculateCost(inputTokens, outputTokens, cacheReadTokens, model);
    return {
      model,
      ...costs,
    };
  }).sort((a, b) => a.totalCost - b.totalCost);
}
```

**Step 2: Commit**

```bash
git add lib/pricing.ts
git commit -m "feat: add pricing data and cost calculation utilities"
```

---

## Task 7: Create Overview Stats Cards Component

**Files:**
- Create: `components/stats/OverviewCards.tsx`

**Step 1: Write component**

```tsx
// components/stats/OverviewCards.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpenCodeStats } from '@/types';
import { Messages, Calendar, DollarSign, Hash } from 'lucide-react';

interface OverviewCardsProps {
  stats: OpenCodeStats;
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const { overview, cost } = stats;
  
  const cards = [
    {
      title: 'Total Sessions',
      value: overview.sessions.toLocaleString(),
      icon: Hash,
      description: 'OpenCode sessions',
    },
    {
      title: 'Total Messages',
      value: overview.messages.toLocaleString(),
      icon: Messages,
      description: 'Messages sent',
    },
    {
      title: 'Days Active',
      value: overview.days.toString(),
      icon: Calendar,
      description: 'Active days',
    },
    {
      title: 'Total Cost',
      value: `$${cost.totalCost.toFixed(2)}`,
      icon: DollarSign,
      description: `~$${cost.avgCostPerDay.toFixed(2)}/day`,
    },
  ];
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/stats/OverviewCards.tsx
git commit -m "feat: add overview stats cards component"
```

---

## Task 8: Create Token Breakdown Component

**Files:**
- Create: `components/stats/TokenBreakdown.tsx`

**Step 1: Write component**

```tsx
// components/stats/TokenBreakdown.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpenCodeStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TokenBreakdownProps {
  stats: OpenCodeStats;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function TokenBreakdown({ stats }: TokenBreakdownProps) {
  const { tokens } = stats;
  
  const data = [
    { name: 'Input', value: tokens.input, color: COLORS[0] },
    { name: 'Output', value: tokens.output, color: COLORS[1] },
    { name: 'Cache Read', value: tokens.cacheRead, color: COLORS[2] },
    { name: 'Cache Write', value: tokens.cacheWrite, color: COLORS[3] },
  ];
  
  const total = tokens.input + tokens.output + tokens.cacheRead + tokens.cacheWrite;
  
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Token Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Token Usage</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Token Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.map((item) => (
              <div key={item.name} className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground">{item.name}</div>
                <div className="text-2xl font-bold" style={{ color: item.color }}>
                  {formatNumber(item.value)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {((item.value / total) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-muted-foreground">Total Tokens: </span>
            <span className="font-bold">{formatNumber(total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/stats/TokenBreakdown.tsx
git commit -m "feat: add token breakdown visualization component"
```

---

## Task 9: Create Tool Usage Chart Component

**Files:**
- Create: `components/stats/ToolUsageChart.tsx`

**Step 1: Write component**

```tsx
// components/stats/ToolUsageChart.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpenCodeStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface ToolUsageChartProps {
  stats: OpenCodeStats;
}

export function ToolUsageChart({ stats }: ToolUsageChartProps) {
  const { tools } = stats;
  
  // Sort by calls descending and take top 10
  const topTools = [...tools]
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 10);
  
  const totalCalls = tools.reduce((sum, t) => sum + t.calls, 0);
  
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Tools by Usage</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topTools}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={90}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `${value.toLocaleString()} calls (${props.payload.percentage.toFixed(1)}%)`,
                  'Usage'
                ]}
              />
              <Bar dataKey="calls" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Tools ({tools.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tools
              .sort((a, b) => b.calls - a.calls)
              .map((tool) => (
                <Badge 
                  key={tool.name} 
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {tool.name}: {tool.calls.toLocaleString()} ({tool.percentage.toFixed(1)}%)
                </Badge>
              ))}
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Total Tool Calls: {totalCalls.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/stats/ToolUsageChart.tsx
git commit -m "feat: add tool usage chart component"
```

---

## Task 10: Create Cost Comparison Component

**Files:**
- Create: `components/stats/CostComparison.tsx`

**Step 1: Write component**

```tsx
// components/stats/CostComparison.tsx
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
                    <span>Cache:</span>
                    <span>{formatCurrency(comparison.cacheCost)}</span>
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
```

**Step 2: Commit**

```bash
git add components/stats/CostComparison.tsx
git commit -m "feat: add cost comparison calculator component"
```

---

## Task 11: Create Navigation Component

**Files:**
- Create: `components/layout/Navigation.tsx`

**Step 1: Write component**

```tsx
// components/layout/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Calculator, Wrench, Home } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/compare', label: 'Cost Compare', icon: Calculator },
  { href: '/tools', label: 'Tools', icon: Wrench },
];

export function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="text-lg font-bold">OpenCode Stats</span>
          </div>
          
          <div className="flex items-center gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Step 2: Commit**

```bash
git add components/layout/Navigation.tsx
git commit -m "feat: add navigation component"
```

---

## Task 12: Update Root Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update layout with navigation**

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OpenCode Stats Dashboard',
  description: 'Analyze your OpenCode usage and compare costs across models',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: update root layout with navigation"
```

---

## Task 13: Create Main Dashboard Page

**Files:**
- Create: `app/page.tsx`

**Step 1: Write main page**

```tsx
// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { OverviewCards } from '@/components/stats/OverviewCards';
import { TokenBreakdown } from '@/components/stats/TokenBreakdown';
import { ToolUsageChart } from '@/components/stats/ToolUsageChart';
import { OpenCodeStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<OpenCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setLastUpdated(new Date());
      } else {
        setError(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError('Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading your OpenCode stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive font-medium">{error}</p>
              <Button onClick={fetchStats} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No stats available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {lastUpdated && `Last updated: ${lastUpdated.toLocaleString()}`}
          </p>
        </div>
        <Button onClick={fetchStats} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <OverviewCards stats={stats} />
      
      <div className="pt-4">
        <h2 className="text-2xl font-bold mb-4">Token Usage</h2>
        <TokenBreakdown stats={stats} />
      </div>
      
      <div className="pt-4">
        <h2 className="text-2xl font-bold mb-4">Tool Usage</h2>
        <ToolUsageChart stats={stats} />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add main dashboard page with all stats"
```

---

## Task 14: Create Cost Comparison Page

**Files:**
- Create: `app/compare/page.tsx`

**Step 1: Write compare page**

```tsx
// app/compare/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { CostComparison } from '@/components/stats/CostComparison';
import { OpenCodeStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';

export default function ComparePage() {
  const [stats, setStats] = useState<OpenCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError('Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading stats for comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive font-medium">{error}</p>
              <Button onClick={fetchStats} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No stats available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cost Comparison</h1>
          <p className="text-muted-foreground">
            Compare your OpenCode usage costs across different models
          </p>
        </div>
        <Button onClick={fetchStats} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <CostComparison 
        stats={stats} 
        currentCost={stats.cost.totalCost} 
      />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/compare/page.tsx
git commit -m "feat: add cost comparison page"
```

---

## Task 15: Create Tools Analysis Page

**Files:**
- Create: `app/tools/page.tsx`

**Step 1: Write tools page**

```tsx
// app/tools/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ToolUsageChart } from '@/components/stats/ToolUsageChart';
import { OpenCodeStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ToolsPage() {
  const [stats, setStats] = useState<OpenCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError('Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading tool usage data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive font-medium">{error}</p>
              <Button onClick={fetchStats} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No stats available.</p>
      </div>
    );
  }

  const totalCalls = stats.tools.reduce((sum, t) => sum + t.calls, 0);
  const avgCallsPerSession = totalCalls / stats.overview.sessions;
  const topTool = stats.tools.reduce((max, t) => t.calls > max.calls ? t : max, stats.tools[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8" />
            Tool Usage Analysis
          </h1>
          <p className="text-muted-foreground">
            Deep dive into your OpenCode tool usage patterns
          </p>
        </div>
        <Button onClick={fetchStats} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tool Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.overview.sessions} sessions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Calls/Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCallsPerSession.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Average tool usage
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Used Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topTool?.name || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {topTool ? `${topTool.calls.toLocaleString()} calls (${topTool.percentage.toFixed(1)}%)` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      <ToolUsageChart stats={stats} />

      {/* Detailed Tool List */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Tool Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {stats.tools
              .sort((a, b) => b.calls - a.calls)
              .map((tool, index) => (
                <div key={tool.name}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {tool.name}
                      </code>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {tool.calls.toLocaleString()} calls
                      </span>
                      <Badge variant="secondary">
                        {tool.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  {index < stats.tools.length - 1 && <Separator />}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/tools/page.tsx
git commit -m "feat: add tools analysis page"
```

---

## Task 16: Configure Next.js for Static Export (Optional)

**Files:**
- Modify: `next.config.ts`

**Step 1: Update next.config.ts**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

**Step 2: Commit**

```bash
git add next.config.ts
git commit -m "chore: configure Next.js for standalone output"
```

---

## Task 17: Add README with Setup Instructions

**Files:**
- Create: `README.md`

**Step 1: Write README**

```markdown
# OpenCode Stats Dashboard

A Next.js application that automatically fetches and visualizes your OpenCode usage statistics with cost comparisons across different AI models.

## Features

- **📊 Dashboard Overview**: Sessions, messages, tokens, and cost summaries
- **🪙 Token Analytics**: Visual breakdown of input, output, and cache tokens
- **🔧 Tool Usage**: Detailed analysis of which tools you use most
- **💰 Cost Comparison**: Calculate what your usage would cost on different models
- **🔄 Auto-Refresh**: Live data from `opencode stats` command

## Prerequisites

- [Bun](https://bun.sh/) installed
- [OpenCode CLI](https://opencode.ai/) installed and in your PATH

## Setup

1. Install dependencies:
```bash
bun install
```

2. Run the development server:
```bash
bun run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Dashboard** (`/`): View overview stats, token breakdown, and tool usage
- **Cost Compare** (`/compare`): Compare your costs across different LLM models
- **Tools** (`/tools`): Deep dive into your tool usage patterns

## Architecture

- **Framework**: Next.js 15 with App Router
- **Runtime**: Bun
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Data Source**: Local `opencode stats` command execution

## API

The app exposes one API endpoint:

- `GET /api/stats` - Executes `opencode stats` and returns parsed JSON

## Pricing Data

Model pricing is sourced from [opencode.ai/docs/zen/](https://opencode.ai/docs/zen/) and includes:
- OpenCode models (Claude, Gemini, Kimi, MiniMax)
- OpenAI models (GPT-4o, GPT-4o-mini, o3-mini)
- Anthropic models (Claude 3.5 Sonnet, Claude 3 Opus)
- Google models (Gemini 2.5 Pro, Gemini 2.5 Flash)

## Development

```bash
# Run dev server
bun run dev

# Build for production
bun run build

# Start production server
bun start
```

## License

MIT
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup and usage instructions"
```

---

## Task 18: Final Verification and Build

**Step 1: Type check**

```bash
cd /home/relu/Projects/AiUsege/opencode-stats
bunx tsc --noEmit
```

Expected: No type errors

**Step 2: Build the application**

```bash
bun run build
```

Expected: Build completes successfully with no errors

**Step 3: Final commit**

```bash
git add .
git status
git commit -m "feat: complete OpenCode Stats Dashboard with all features"
```

---

## Summary

The implementation creates a fully functional Next.js application that:

1. ✅ Executes `opencode stats` via API route
2. ✅ Parses terminal output into structured data
3. ✅ Displays overview stats (sessions, messages, cost)
4. ✅ Visualizes token breakdown with charts
5. ✅ Shows tool usage with ranked lists and visualizations
6. ✅ Compares costs across 13+ different LLM models
7. ✅ Uses shadcn/ui components for professional UI
8. ✅ Includes three pages: Dashboard, Cost Compare, Tools
9. ✅ Built with Bun and Next.js 15

Total estimated time: 60-90 minutes
