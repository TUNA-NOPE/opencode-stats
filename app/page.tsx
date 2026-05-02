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
        setLastUpdated(new Date());
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
          <p className="text-sm text-muted-foreground">Loading stats...</p>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            {lastUpdated && `Updated ${lastUpdated.toLocaleTimeString()}`}
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

      {/* Overview Stats */}
      <OverviewCards stats={stats} />

      {/* Token Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Token Usage
        </h2>
        <TokenBreakdown stats={stats} />
      </div>

      {/* Tools Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Tool Usage
        </h2>
        <ToolUsageChart stats={stats} />
      </div>
    </div>
  );
}
