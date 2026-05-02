import { OpenCodeStats, ToolUsage } from '@/types';

function calculateAvgRequests(messages: number, days: number, sessions: number): {
  perSession: number;
  per5Hours: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
} {
  // Calculate averages based on messages
  const perSession = sessions > 0 ? messages / sessions : 0;
  const perDay = days > 0 ? messages / days : 0;
  const per5Hours = days > 0 ? (messages / days) / 4.8 : 0; // 24 hours / 5 = 4.8 periods per day
  const perWeek = days > 0 ? (messages / days) * 7 : 0;
  const perMonth = days > 0 ? (messages / days) * 30 : 0;

  return {
    perSession,
    per5Hours,
    perDay,
    perWeek,
    perMonth,
  };
}

export function parseStatsOutput(output: string): OpenCodeStats {
  const lines = output.split('\n');
  
  // Parse Overview section
  const overviewSection = extractSection(lines, 'OVERVIEW');
  const sessions = extractNumber(overviewSection, 'Sessions');
  const messages = extractNumber(overviewSection, 'Messages');
  const days = extractNumber(overviewSection, 'Days');
  
  const overview = {
    sessions,
    messages,
    days,
    avgRequests: calculateAvgRequests(messages, days, sessions),
  };
  
  // Parse Cost & Tokens section
  const costSection = extractSection(lines, 'COST & TOKENS');
  const cost = {
    totalCost: extractCurrency(costSection, 'Total Cost'),
    avgCostPerDay: extractCurrency(costSection, 'Avg Cost/Day'),
    avgTokensPerSession: extractTokens(costSection, 'Avg Tokens/Session'),
    medianTokensPerSession: extractTokens(costSection, 'Median Tokens/Session'),
  };
  
  const inputTokens = extractTokens(costSection, 'Input');
  const outputTokens = extractTokens(costSection, 'Output');
  const cacheReadTokens = extractTokens(costSection, 'Cache Read');
  const cacheWriteTokens = extractTokens(costSection, 'Cache Write');
  const sessions = overview.sessions;
  const days = overview.days;
  
  // Calculate request averages
  const messages = overview.messages;
  const requests = {
    avgPerSession: sessions > 0 ? Math.round(messages / sessions) : 0,
    avgPer5Hours: days > 0 ? Math.round(messages / (days * 24 / 5)) : 0,
    avgPerDay: days > 0 ? Math.round(messages / days) : 0,
    avgPerWeek: days > 0 ? Math.round(messages / (days / 7)) : 0,
    avgPerMonth: days > 0 ? Math.round(messages / (days / 30)) : 0,
  };
  
  const tokens = {
    input: inputTokens,
    output: outputTokens,
    cacheRead: cacheReadTokens,
    cacheWrite: cacheWriteTokens,
    avgInputPerSession: sessions > 0 ? Math.round(inputTokens / sessions) : 0,
    avgOutputPerSession: sessions > 0 ? Math.round(outputTokens / sessions) : 0,
    avgCacheReadPerSession: sessions > 0 ? Math.round(cacheReadTokens / sessions) : 0,
    avgCacheWritePerSession: sessions > 0 ? Math.round(cacheWriteTokens / sessions) : 0,
    avgInputPerDay: days > 0 ? Math.round(inputTokens / days) : 0,
    avgOutputPerDay: days > 0 ? Math.round(outputTokens / days) : 0,
    avgCacheReadPerDay: days > 0 ? Math.round(cacheReadTokens / days) : 0,
    avgCacheWritePerDay: days > 0 ? Math.round(cacheWriteTokens / days) : 0,
    avgInputPerRequest: overview.messages > 0 ? Math.round(inputTokens / overview.messages) : 0,
    avgOutputPerRequest: overview.messages > 0 ? Math.round(outputTokens / overview.messages) : 0,
    avgCacheReadPerRequest: overview.messages > 0 ? Math.round(cacheReadTokens / overview.messages) : 0,
    avgCacheWritePerRequest: overview.messages > 0 ? Math.round(cacheWriteTokens / overview.messages) : 0,
  };
  
  // Parse Tool Usage section
  const tools = parseToolUsage(lines);
  
  return { overview, requests, cost, tokens, tools };
}

function extractSection(lines: string[], sectionName: string): string[] {
  const startIdx = lines.findIndex(line => line.includes(sectionName));
  if (startIdx === -1) return [];
  
  // Find next section or end
  const endIdx = lines.slice(startIdx + 1).findIndex(line => 
    line.includes('┌─') && !line.includes('│')
  );
  
  return endIdx === -1 
    ? lines.slice(startIdx)
    : lines.slice(startIdx, startIdx + endIdx + 1);
}

function extractNumber(lines: string[], key: string): number {
  const line = lines.find(l => l.includes(key));
  if (!line) return 0;
  const match = line.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
}

function extractCurrency(lines: string[], key: string): number {
  const line = lines.find(l => l.includes(key));
  if (!line) return 0;
  const match = line.match(/\$([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function extractTokens(lines: string[], key: string): number {
  const line = lines.find(l => l.includes(key));
  if (!line) return 0;
  // Handle formats like "148.3M", "346.1K", or plain numbers
  const match = line.match(/([\d.]+)([MK])?/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const suffix = match[2];
  
  if (suffix === 'M') return Math.round(value * 1000000);
  if (suffix === 'K') return Math.round(value * 1000);
  return Math.round(value);
}

function parseToolUsage(lines: string[]): ToolUsage[] {
  const sectionStart = lines.findIndex(line => line.includes('TOOL USAGE'));
  if (sectionStart === -1) return [];

  const tools: ToolUsage[] = [];

  for (let i = sectionStart + 1; i < lines.length; i++) {
    const line = lines[i];
    // Match pattern: tool_name ████████ 12345 (xx.x%)
    const match = line.match(/(\w+)\s+[\u2588\s]+(\d+)\s+\(([\d.]+)%\)/);
    if (match) {
      const name = match[1];
      const calls = parseInt(match[2], 10);
      const percentage = parseFloat(match[3]);

      tools.push({ name, calls, percentage });
    }
  }

  return tools;
}
