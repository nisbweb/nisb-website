import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { fetchLiveEvents } from '@/lib/events-feed';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Automated Cronjob & Background Sync Endpoint for Google Sheets Events Feed
 * Callable via Vercel Cron, external ping (e.g. cron-job.org / GitHub Actions), or internal background timers.
 */
export async function GET(req: NextRequest) {
  try {
    const liveEvents = await fetchLiveEvents();

    if (liveEvents && liveEvents.length > 0) {
      try {
        const cacheFilePath = path.join(process.cwd(), 'public', 'assets', 'events-cache.json');
        if (fs.existsSync(path.dirname(cacheFilePath))) {
          fs.writeFileSync(cacheFilePath, JSON.stringify(liveEvents, null, 2));
        }
      } catch (fileErr) {
        // Read-only serverless environment safe
      }

      return NextResponse.json({
        success: true,
        message: 'Events feed automatically synced with Google Sheets',
        count: liveEvents.length,
        syncedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, message: 'No events returned from live sheet' },
      { status: 502 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Auto-sync failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
