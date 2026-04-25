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
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
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
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
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
