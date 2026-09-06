import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  OFFICIAL_SPREADSHEET_ID,
  fetchLiveEvents,
  sanitizeImageUrl,
  EventItem,
} from '@/lib/events-feed';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Check webhook health & retrieve Google Apps Script code snippet
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/events/webhook',
    description: 'NISB Events Live Sheet Webhook. Automatically adds/updates events on the website when the Google Sheet is edited.',
    instructions: {
      step1: `Open your Google Sheet (https://docs.google.com/spreadsheets/d/${OFFICIAL_SPREADSHEET_ID})`,
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

    // If an individual event was sent directly
    if (body.title && body.image) {
      const newEvent: EventItem = {
        id: `evt-${Date.now()}`,
        title: String(body.title).trim(),
        category: String(body.category || 'NISB').toUpperCase().trim(),
        date: String(body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
        image: sanitizeImageUrl(String(body.image), String(body.category || 'NISB')),
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

    // Default action: Re-fetch the live spreadsheet directly with &headers=1
    const latestEvents = await fetchLiveEvents(body.sheetId ? `https://docs.google.com/spreadsheets/d/${body.sheetId}` : undefined);

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
      topEvents: latestEvents.slice(0, 6).map((e) => ({ title: e.title, date: e.date, category: e.category, venue: e.venue })),
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
