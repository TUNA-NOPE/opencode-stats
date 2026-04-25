# OpenCode Stats Dashboard - Design Document

**Date**: 2025-04-25  
**Author**: OpenCode  
**Status**: Approved  

## Overview

A Next.js application that automatically fetches OpenCode usage statistics by running the `opencode stats` command, parses the output, and displays comprehensive analytics with cost comparisons across different LLM models.

## Goals

1. Automatically fetch OpenCode stats via API route executing `opencode stats`
2. Display comprehensive dashboard with sessions, messages, tokens, and costs
3. Provide cost calculator comparing usage across different models/providers
4. Visualize tool usage, token breakdown, and session trends
5. Fetch and cache pricing data from https://opencode.ai/docs/zen/

## Architecture

### Approach
**Local Next.js App with API Routes** - Next.js runs locally, uses API routes to execute `opencode stats` via `child_process`, providing direct access to local OpenCode installation with real-time data.

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

### Project Structure

```
opencode-stats/
├── app/
│   ├── api/stats/route.ts      # Execute and parse `opencode stats`
│   ├── compare/page.tsx         # Cost comparison calculator
│   ├── tools/page.tsx           # Tool usage analysis
│   ├── layout.tsx               # Root layout with nav
│   ├── page.tsx                 # Main dashboard
│   └── globals.css
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── stats/                   # Stats visualization components
│   └── layout/Navigation.tsx    # Navigation component
├── lib/
│   ├── parsers.ts               # Parse stats output
│   ├── pricing.ts               # LLM pricing data
│   └── utils.ts                 # Utilities
├── types/index.ts               # TypeScript types
└── package.json
```

## Features

### 1. Main Dashboard (`/`)
- **Overview Cards**: Sessions, Messages, Days Active, Total Cost, Avg Cost/Day
- **Token Summary**: Input, Output, Cache Read, Cache Write with totals
- **Tool Usage Chart**: Horizontal bar chart showing tool usage percentages
- **Recent Activity**: Last sessions and models used

### 2. Cost Comparison (`/compare`)
- **Model Pricing Table**: Prices per 1M tokens (input/output) from opencode docs
- **Cost Calculator**: Calculate what your usage would cost on different models
- **Savings Analysis**: Compare current cost vs alternatives
- **Custom Pricing**: Allow users to input their own prices

### 3. Tool Usage Analysis (`/tools`)
- **Detailed Breakdown**: All 17+ tools with call counts and percentages
- **Visual Charts**: Pie chart and sorted bar chart
- **Trends**: Usage patterns over time (if historical data available)

### 4. Data Flow
1. API route executes `opencode stats` command
2. Parser extracts structured data from terminal output
3. Client fetches via SWR/React Query for caching
4. Components render with Recharts visualizations

## API Design

### GET /api/stats
Returns parsed OpenCode stats as JSON:

```typescript
interface OpenCodeStats {
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
  tools: Array<{
    name: string;
    calls: number;
    percentage: number;
  }>;
}
```

## Pricing Data

Fetch pricing from https://opencode.ai/docs/zen/ to populate cost comparison table. Cache locally and refresh periodically.

## Error Handling

- Handle case when `opencode` not in PATH
- Timeout on stats command execution (>30s)
- Parse errors with fallback to cached data
- Show user-friendly error messages

## Security Considerations

- API route only executable server-side (safe)
- No sensitive data exposed in client
- Local-only app (no auth needed)

## Future Enhancements

- Export stats to CSV/JSON
- Historical tracking (store previous stats)
- Multiple user profiles
- Dark/light theme toggle

## Success Criteria

- [ ] `opencode stats` command runs successfully via API
- [ ] Dashboard displays all overview metrics correctly
- [ ] Token breakdown shows accurate numbers
- [ ] Tool usage chart renders with real data
- [ ] Cost comparison calculates correctly for different models
- [ ] Pricing data loads from opencode docs
- [ ] UI is responsive and visually appealing
