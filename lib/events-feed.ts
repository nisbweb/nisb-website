// Shared Google Spreadsheet Live Events Feed Utilities for NISB Website

export const OFFICIAL_SPREADSHEET_ID = '1wHYE0SCpAApAzRKL2BQmEXrTDtxSh6LQ9EPy_27GWlI';
// CRITICAL: &headers=1 forces Google GViz to treat row 1 as headers, preventing new top rows from being swallowed
export const LIVE_GVIZ_URL = `https://docs.google.com/spreadsheets/d/${OFFICIAL_SPREADSHEET_ID}/gviz/tq?tqx=out:json&headers=1`;

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  venue?: string;
  description?: string;
  regLink?: string;
}

export function formatEventDate(rawDate: unknown): string {
  if (!rawDate) return '2025–2026';
  const str = String(rawDate).trim();
  if (!str) return '2025–2026';

  // Format 1: Google GViz Date(YYYY, MM, DD)
  if (str.includes('Date(')) {
    const parts = str.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2], 10));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
  }

  // Format 2: DD-MM-YYYY or DD/MM/YYYY (e.g. "31-8-2026" or "06/07/2026")
  const dmyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1; // 0-indexed
    const year = parseInt(dmyMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  // Format 3: YYYY-MM-DD (e.g. "2026-08-31")
  const ymdMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  return str;
}

export function getCategoryFallbackImage(category?: string): string {
  const cat = String(category || '').toUpperCase();
  if (cat.includes('CS')) return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop';
  if (cat.includes('RAS')) return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop';
  if (cat.includes('WIE')) return 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2070&auto=format&fit=crop';
  if (cat.includes('CASS')) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop';
  if (cat.includes('GRSS')) return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070&auto=format&fit=crop';
  if (cat.includes('EDITORIAL') || cat.includes('MANAS')) return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop';
  return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop';
}

export function sanitizeImageUrl(rawUrl?: string, category?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return getCategoryFallbackImage(category);
  }

  const str = rawUrl.trim();
  if (!str) {
    return getCategoryFallbackImage(category);
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

export function parseGVizResponse(text: string): EventItem[] {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return [];

  const jsonString = text.substring(jsonStart, jsonEnd + 1);
  const data = JSON.parse(jsonString);

  const rows = data.table?.rows || [];
  const eventsList: EventItem[] = [];

  for (let i = 0; i < rows.length; i++) {
    const c = rows[i]?.c;
    if (!c) continue;

    const eventName = c[0]?.v || '';
    const rawDate = c[1]?.v || '';
    const rawImage = c[2]?.v || c[4]?.v || c[5]?.v || '';
    const organiser = c[3]?.v || 'NISB';
    const venue = c[4]?.v || '';

    // Ignore header row if accidentally passed through
    if (String(eventName).toLowerCase().trim() === 'name') continue;

    if (eventName && String(eventName).trim().length > 0) {
      const formattedDate = formatEventDate(rawDate);

      let category = String(organiser).toUpperCase().trim() || 'NISB';
      if (category.includes('GRSS') && category.includes('WIE')) {
        category = 'GRSS';
      }

      eventsList.push({
        id: `evt-${i}`,
        title: String(eventName).trim(),
        category: category,
        date: formattedDate || '2025–2026',
        image: sanitizeImageUrl(String(rawImage || ''), category),
        venue: String(venue || '').trim(),
        description: `Organized by ${organiser} ${venue ? 'at ' + venue : 'at NIE Mysuru'}. Join NISB for hands-on learning, engineering excellence, and networking.`,
        regLink: 'https://social.nisb.in',
      });
    }
  }

  return eventsList;
}

export async function fetchLiveEvents(sheetUrl?: string): Promise<EventItem[]> {
  let targetUrl = LIVE_GVIZ_URL;

  if (sheetUrl) {
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      targetUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:json&headers=1`;
    }
  }

  // Append timestamp to prevent intermediate CDN/proxy stale caching
  const fetchUrl = `${targetUrl}&_t=${Date.now()}`;

  const res = await fetch(fetchUrl, {
    cache: 'no-store',
    headers: {
      'User-Agent': 'NISB-Website-LiveEvents/1.0',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Google Sheet: HTTP ${res.status}`);
  }

  const text = await res.text();
  return parseGVizResponse(text);
}
