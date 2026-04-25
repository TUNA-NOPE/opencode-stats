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
                formatter={(value, name, props) => [
                  `${(value as number).toLocaleString()} calls (${(props?.payload as any)?.percentage?.toFixed(1)}%)`,
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
