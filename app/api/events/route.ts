import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { fetchLiveEvents, EventItem } from '@/lib/events-feed';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Server-side in-memory cache
let inMemoryEvents: EventItem[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 25 * 1000; // 25 seconds server cache for blazing fast responses while staying live

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const forceRefresh = searchParams.get('refresh') === 'true' || searchParams.get('force') === 'true';
  const customSheet = searchParams.get('sheet') || undefined;

  const now = Date.now();

  // If in-memory cache is fresh and not force-refreshing, return immediately
  if (!forceRefresh && !customSheet && inMemoryEvents && (now - lastFetchTime < CACHE_TTL_MS)) {
    return NextResponse.json(
      {
        success: true,
        count: inMemoryEvents.length,
        source: 'memory-cache',
        updatedAt: new Date(lastFetchTime).toISOString(),
        events: inMemoryEvents,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=25, stale-while-revalidate=60',
          'X-NISB-Cache': 'HIT',
        },
      }
    );
  }

  try {
    const liveEvents = await fetchLiveEvents(customSheet);

    if (liveEvents && liveEvents.length > 0) {
      inMemoryEvents = liveEvents;
      lastFetchTime = now;

      // Try updating public/assets/events-cache.json asynchronously on local/container filesystem
      try {
        const cacheFilePath = path.join(process.cwd(), 'public', 'assets', 'events-cache.json');
        if (fs.existsSync(path.dirname(cacheFilePath))) {
          fs.writeFile(cacheFilePath, JSON.stringify(liveEvents, null, 2), () => {});
        }
      } catch {
        // Ignored on read-only environments
      }

      return NextResponse.json(
        {
          success: true,
          count: liveEvents.length,
          source: 'live-sheet',
          updatedAt: new Date(now).toISOString(),
          events: liveEvents,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=25, stale-while-revalidate=60',
            'X-NISB-Cache': 'MISS',
          },
        }
      );
    }
  } catch (err: any) {
    console.warn('[API /api/events] Live fetch failed, falling back to cache:', err.message);
  }

  // Fallback 1: in-memory cache
  if (inMemoryEvents && inMemoryEvents.length > 0) {
    return NextResponse.json(
      {
        success: true,
        count: inMemoryEvents.length,
        source: 'memory-fallback',
        updatedAt: new Date(lastFetchTime).toISOString(),
        events: inMemoryEvents,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
          'X-NISB-Cache': 'FALLBACK',
        },
      }
    );
  }

  // Fallback 2: Disk cache
  try {
    const cacheFilePath = path.join(process.cwd(), 'public', 'assets', 'events-cache.json');
    if (fs.existsSync(cacheFilePath)) {
      const fileData = fs.readFileSync(cacheFilePath, 'utf-8');
      const diskEvents = JSON.parse(fileData);
      if (Array.isArray(diskEvents) && diskEvents.length > 0) {
        inMemoryEvents = diskEvents;
        lastFetchTime = now;

        return NextResponse.json({
          success: true,
          count: diskEvents.length,
          source: 'disk-fallback',
          updatedAt: new Date(now).toISOString(),
          events: diskEvents,
        });
      }
    }
  } catch (diskErr) {
    console.error('[API /api/events] Disk fallback failed:', diskErr);
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Unable to retrieve live events from Google Sheet',
      events: [],
    },
    { status: 502 }
  );
}
