'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpenCodeStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TokenBreakdownProps {
  stats: OpenCodeStats;
}

// Cal.com inspired monochrome palette
const CHART_COLORS = {
  input: '#111111',
  output: '#3e3e3e',
  cacheRead: '#6b6b6b',
  cacheWrite: '#9ca3af',
};

export function TokenBreakdown({ stats }: TokenBreakdownProps) {
  const { tokens } = stats;
  
  const data = [
    { name: 'Input', value: tokens.input, color: CHART_COLORS.input, short: 'In' },
    { name: 'Output', value: tokens.output, color: CHART_COLORS.output, short: 'Out' },
    { name: 'Cache Read', value: tokens.cacheRead, color: CHART_COLORS.cacheRead, short: 'Cache R' },
    { name: 'Cache Write', value: tokens.cacheWrite, color: CHART_COLORS.cacheWrite, short: 'Cache W' },
  ];
  
  const total = tokens.input + tokens.output + tokens.cacheRead + tokens.cacheWrite;
  
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };
  
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Token Summary Cards */}
      <div className="lg:col-span-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item) => (
          <div 
            key={item.name}
            className="relative overflow-hidden rounded-lg border border-border/50 bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div 
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {item.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold tracking-tight font-mono">
                    {formatNumber(item.value)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {((item.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bar Chart */}
      <Card className="lg:col-span-2 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Token Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  dy={10}
                />
                <YAxis 
                  hide
                />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-sm">
                          <p className="text-xs font-medium">{data.name}</p>
                          <p className="text-sm font-semibold font-mono">
                            {formatNumber(data.value)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">Total Tokens</p>
            <p className="text-2xl font-semibold tracking-tight font-mono">
              {formatNumber(total)}
            </p>
          </div>
          
          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-mono font-medium">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
