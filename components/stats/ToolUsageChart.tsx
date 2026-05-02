'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpenCodeStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ToolUsageChartProps {
  stats: OpenCodeStats;
}

// Cal.com inspired monochrome gradient
const BAR_COLORS = [
  '#111111', '#1a1a1a', '#2d2d2d', '#3e3e3e', 
  '#4a4a4a', '#555555', '#6b6b6b', '#757575',
  '#858585', '#9ca3af'
];

export function ToolUsageChart({ stats }: ToolUsageChartProps) {
  const { tools } = stats;
  
  // Sort by calls descending and take top 10
  const topTools = [...tools]
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 10)
    .map((tool) => ({
      ...tool,
      displayName: tool.name.length > 20 ? tool.name.slice(0, 20) + '...' : tool.name,
    }));
  
  const totalCalls = tools.reduce((sum, t) => sum + t.calls, 0);
  
  return (
    <div className="grid gap-4">
      {/* Chart Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Top 10 Tools by Usage</CardTitle>
            <span className="text-xs text-muted-foreground">
              {tools.length} total tools
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topTools}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <XAxis 
                  type="number" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="displayName" 
                  width={110}
                  tick={{ fontSize: 11, fill: 'var(--foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const tool = payload[0].payload;
                      return (
                        <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-sm">
                          <p className="text-xs font-medium truncate max-w-[200px]">{tool.name}</p>
                          <p className="text-sm font-semibold font-mono mt-1">
                            {tool.calls.toLocaleString()} calls
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tool.percentage.toFixed(1)}% of total
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="calls" radius={[0, 4, 4, 0]} barSize={20}>
                  {topTools.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* All Tools List */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">All Tools</CardTitle>
            <div className="text-xs text-muted-foreground">
              <span className="font-mono font-medium">{totalCalls.toLocaleString()}</span> total calls
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tools
              .sort((a, b) => b.calls - a.calls)
              .map((tool) => (
                <div 
                  key={tool.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-2.5 py-1 text-xs transition-colors hover:border-border hover:bg-muted"
                >
                  <span className="font-medium truncate max-w-[120px]">{tool.name}</span>
                  <span className="text-muted-foreground font-mono">{tool.calls.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
