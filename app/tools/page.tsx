'use client';

import { useEffect, useState } from 'react';
import { ToolUsageChart } from '@/components/stats/ToolUsageChart';
import { OpenCodeStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';

export default function ToolsPage() {
  const [stats, setStats] = useState<OpenCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{
    cachedAt: string | null;
    isCached: boolean;
    cacheAge: string;
  } | null>(null);

  const fetchStats = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const url = forceRefresh ? '/api/stats?refresh=true' : '/api/stats';
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
        setCacheInfo({
          cachedAt: data.cachedAt,
          isCached: data.isCached,
          cacheAge: data.cacheAge
        });
      } else {
        setError(data.error || 'Failed to fetch stats');
      }
    } catch {
      setError('Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading tool usage data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button onClick={() => fetchStats()} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
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
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No stats available.</p>
      </div>
    );
  }

  const totalCalls = stats.tools.reduce((sum, t) => sum + t.calls, 0);
  const avgCallsPerSession = totalCalls / stats.overview.sessions;
  const topTool = stats.tools.reduce((max, t) => t.calls > max.calls ? t : max, stats.tools[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
          <p className="text-sm text-muted-foreground">
            Detailed tool usage analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          {cacheInfo?.isCached ? (
            <span className="text-xs text-muted-foreground">
              Cached {cacheInfo.cacheAge} ago
            </span>
          ) : cacheInfo ? (
            <span className="text-xs font-medium text-emerald-600">Live</span>
          ) : null}
          <Button
            onClick={() => fetchStats(true)}
            variant="outline"
            size="sm"
            disabled={loading}
            className="h-8"
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Tool Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight font-mono">
              {totalCalls.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {stats.overview.sessions} sessions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Avg per Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight font-mono">
              {avgCallsPerSession.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average usage
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Most Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold tracking-tight truncate" title={topTool?.name}>
              {topTool?.name || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {topTool ? `${topTool.calls.toLocaleString()} calls (${topTool.percentage.toFixed(1)}%)` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      <ToolUsageChart stats={stats} />

      {/* Detailed Tool List */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Complete Tool Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {stats.tools
              .sort((a, b) => b.calls - a.calls)
              .map((tool, index) => (
                <div key={tool.name} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-muted-foreground w-5 shrink-0">
                      {index + 1}
                    </span>
                    <code className="text-xs sm:text-sm bg-muted px-1.5 py-0.5 rounded truncate">
                      {tool.name}
                    </code>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    <span className="text-sm font-mono font-medium">
                      {tool.calls.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground w-10 text-right font-mono">
                      {tool.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
