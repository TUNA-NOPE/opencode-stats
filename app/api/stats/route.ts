import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseStatsOutput } from '@/lib/parsers';

const execAsync = promisify(exec);

// Cache storage
let cachedStats: ReturnType<typeof parseStatsOutput> | null = null;
let cachedAt: number | null = null;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

function formatCacheAge(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) {
    const seconds = Math.floor(ms / 1000);
    return `${seconds} second${seconds === 1 ? '' : 's'}`;
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours} hour${hours === 1 ? '' : 's'}`;
}

export async function GET(request: Request) {
  try {
    // Check for force refresh
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Check if we should use cached data
    const now = Date.now();
    const isCacheValid = cachedStats !== null && 
                         cachedAt !== null && 
                         (now - cachedAt) < CACHE_DURATION_MS;
    
    let stats: NonNullable<typeof cachedStats>;
    let isCached = false;
    
    if (!forceRefresh && isCacheValid && cachedStats !== null) {
      // Return cached data
      stats = cachedStats;
      isCached = true;
      console.log('Returning cached stats (age: ' + formatCacheAge(now - cachedAt!) + ')');
    } else {
      // Fetch fresh data
      console.log(forceRefresh ? 'Force refresh requested' : 'Cache expired or empty, fetching fresh data');
      
      const { stdout, stderr } = await execAsync('opencode stats', {
        timeout: 30000, // 30 second timeout
        env: { ...process.env, PATH: process.env.PATH },
      });
      
      if (stderr) {
        console.warn('opencode stats stderr:', stderr);
      }
      
      // Parse and cache the output
      stats = parseStatsOutput(stdout);
      cachedStats = stats;
      cachedAt = now;
    }
    
    return NextResponse.json({ 
      success: true, 
      data: stats,
      cachedAt: cachedAt ? new Date(cachedAt).toISOString() : null,
      isCached,
      cacheAge: isCached && cachedAt ? formatCacheAge(now - cachedAt) : null,
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
