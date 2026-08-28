import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Google Spreadsheet Live Feed ID
const OFFICIAL_SPREADSHEET_ID = '1wHYE0SCpAApAzRKL2BQmEXrTDtxSh6LQ9EPy_27GWlI';
const LIVE_GVIZ_URL = `https://docs.google.com/spreadsheets/d/${OFFICIAL_SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

export interface WebhookEventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  venue?: string;
  description?: string;
  regLink?: string;
}

function sanitizeImageUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';
  }
  const str = rawUrl.trim();
  if (!str) {
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';
  }
  if (str.startsWith('http')) {
    const driveIdMatch = str.match(/\/d\/([a-zA-Z0-9_-]+)/) || str.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
    }
    return str;
  }
  if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) {
    return `https://lh3.googleusercontent.com/d/${str}`;
  }
  return str;
}

function parseGViz(text: string): WebhookEventItem[] {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return [];

  const json = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
  const rows = json.table?.rows || [];
  const eventsList: WebhookEventItem[] = [];

  for (let i = 0; i < rows.length; i++) {
    const c = rows[i]?.c;
    if (!c) continue;

    const eventName = c[0]?.v || '';
    const rawDate = c[1]?.v || '';
    const rawImage = c[2]?.v || c[4]?.v || c[5]?.v || '';
    const organiser = c[3]?.v || 'NISB';
    const venue = c[4]?.v || '';

    if (String(eventName).toLowerCase().trim() === 'name') continue;

    if (eventName && String(eventName).trim().length > 0) {
      let formattedDate = String(rawDate);
      if (rawDate && typeof rawDate === 'string' && rawDate.includes('Date(')) {
        const dateParts = rawDate.match(/\d+/g);
        if (dateParts && dateParts.length >= 3) {
          const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]), parseInt(dateParts[2]));
          formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }

      eventsList.push({
        id: `evt-${i}`,
        title: String(eventName).trim(),
        category: String(organiser).toUpperCase().trim() || 'NISB',
        date: formattedDate || '2025–2026',
        image: sanitizeImageUrl(String(rawImage)),
        venue: String(venue),
        description: `Organized by ${organiser} ${venue ? 'at ' + venue : 'at NIE Mysuru'}.`,
        regLink: 'https://social.nisb.in',
      });
    }
  }

  return eventsList;
}

// GET: Check webhook health & retrieve Google Apps Script code snippet
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/events/webhook',
    description: 'NISB Events Live Sheet Webhook. Automatically adds/updates events on the website when the Google Sheet is edited.',
    instructions: {
      step1: 'Open your Google Sheet (https://docs.google.com/spreadsheets/d/' + OFFICIAL_SPREADSHEET_ID + ')',
      step2: 'Go to Extensions -> Apps Script',
      step3: 'Paste the googleAppsScriptCode below into Code.gs and save',
      step4: 'Go to Triggers (clock icon on left) -> Add Trigger -> Run: onSheetEdit, Event source: From spreadsheet, Event type: On edit (or On change)',
    },
    googleAppsScriptCode: `
function onSheetEdit(e) {
  var url = "https://nisb-website-three.vercel.app/api/events/webhook"; // Replace with your domain if different
  var payload = JSON.stringify({
    action: "sync",
    timestamp: new Date().toISOString(),
    sheetId: "${OFFICIAL_SPREADSHEET_ID}"
  });
  
  var options = {
    method: "post",
    contentType: "application/json",
    payload: payload,
    muteHttpExceptions: true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log("NISB Webhook Response: " + response.getContentText());
  } catch (err) {
    Logger.log("Webhook Error: " + err.toString());
  }
}
    `.trim(),
  });
}

// POST: Webhook receiver when sheet is updated or event is pushed
export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is acceptable as a sync trigger
      body = { action: 'sync' };
    }

    console.log('[Webhook] Received Google Sheet update trigger:', body);

    // If an individual event or array of events was sent directly
    if (body.title && body.image) {
      const newEvent: WebhookEventItem = {
        id: `evt-${Date.now()}`,
        title: String(body.title).trim(),
        category: String(body.category || 'NISB').toUpperCase().trim(),
        date: String(body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
        image: sanitizeImageUrl(String(body.image)),
        venue: body.venue ? String(body.venue) : 'NIE Mysuru',
        description: body.description ? String(body.description) : 'Organized by NISB at NIE Mysuru.',
        regLink: body.regLink || 'https://social.nisb.in',
      };

      return NextResponse.json({
        success: true,
        message: 'Event successfully received and queued',
        event: newEvent,
      });
    }

    // Default action: Re-fetch the live spreadsheet directly and update cache
    const response = await fetch(LIVE_GVIZ_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'NISB-Website-Webhook/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheet returned HTTP ${response.status}`);
    }

    const text = await response.text();
    const latestEvents = parseGViz(text);

    // Write to local public cache file if in Node environment
    try {
      const cacheDir = path.join(process.cwd(), 'public', 'assets');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(cacheDir, 'events-cache.json'),
        JSON.stringify(latestEvents, null, 2)
      );
      console.log(`[Webhook] Saved ${latestEvents.length} events to public/assets/events-cache.json`);
    } catch (fsErr) {
      console.warn('[Webhook] Note: File cache write skipped (read-only filesystem or serverless):', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: `Google Sheet synchronized successfully. ${latestEvents.length} events loaded.`,
      eventsCount: latestEvents.length,
      topEvents: latestEvents.slice(0, 6).map(e => ({ title: e.title, date: e.date, category: e.category })),
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Webhook Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process sheet webhook',
      },
      { status: 500 }
    );
  }
}
