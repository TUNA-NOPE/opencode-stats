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
