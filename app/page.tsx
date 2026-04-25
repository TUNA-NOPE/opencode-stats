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
              <Button onClick={() => fetchStats()} variant="outline">
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
        <div className="flex items-center gap-4">
          {cacheInfo?.isCached ? (
            <span className="text-sm text-muted-foreground">
              Cached {cacheInfo.cacheAge} ago
            </span>
          ) : cacheInfo ? (
            <span className="text-sm text-green-600">Live data</span>
          ) : null}
          <Button onClick={() => fetchStats(true)} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Force Refresh
          </Button>
        </div>
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
