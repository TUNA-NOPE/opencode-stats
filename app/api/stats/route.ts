import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseStatsOutput } from '@/lib/parsers';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Execute opencode stats command
    const { stdout, stderr } = await execAsync('opencode stats', {
      timeout: 30000, // 30 second timeout
      env: { ...process.env, PATH: process.env.PATH },
    });
    
    if (stderr) {
      console.warn('opencode stats stderr:', stderr);
    }
    
    // Parse the output
    const stats = parseStatsOutput(stdout);
    
    return NextResponse.json({ 
      success: true, 
      data: stats,
      raw: stdout 
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
