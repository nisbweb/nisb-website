'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Google Spreadsheet Live Feed ID
const OFFICIAL_SPREADSHEET_ID = '1wHYE0SCpAApAzRKL2BQmEXrTDtxSh6LQ9EPy_27GWlI';
const LIVE_GVIZ_URL = `https://docs.google.com/spreadsheets/d/${OFFICIAL_SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

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

// Convert Google Drive view links or raw Drive file IDs to direct high-speed image CDN URLs
function sanitizeImageUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';
  }

  const str = rawUrl.trim();
  if (!str) {
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';
  }

  // If it's a full URL containing drive.google.com or googleusercontent.com
  if (str.startsWith('http')) {
    const driveIdMatch = str.match(/\/d\/([a-zA-Z0-9_-]+)/) || str.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
    }
    return str;
  }

  // If it's a raw Google Drive File ID (e.g. 1Q7y--tV3KjjyTjsLaYK3kz_q03JmB_8b)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) {
    return `https://lh3.googleusercontent.com/d/${str}`;
  }

  return str;
}

function parseGVizResponse(text: string): EventItem[] {
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

    // Google Sheet schema: col 0 = Name, col 1 = Date, col 2 = Image ID, col 3 = Organiser/Category, col 4 = Venue
    const eventName = c[0]?.v || '';
    const rawDate = c[1]?.v || '';
    const rawImage = c[2]?.v || c[4]?.v || c[5]?.v || '';
    const organiser = c[3]?.v || 'NISB';
    const venue = c[4]?.v || '';

    // Ignore header row if present
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

      let category = String(organiser).toUpperCase().trim() || 'NISB';
      if (category.includes('GRSS') && category.includes('WIE')) {
        category = 'GRSS';
      }

      eventsList.push({
        id: `evt-${i}`,
        title: String(eventName).trim(),
        category: category,
        date: formattedDate || '2025–2026',
        image: sanitizeImageUrl(String(rawImage)),
        venue: String(venue),
        description: `Organized by ${organiser} ${venue ? 'at ' + venue : 'at NIE Mysuru'}. Join NISB for hands-on learning, engineering excellence, and networking.`,
        regLink: 'https://social.nisb.in',
      });
    }
  }

  return eventsList;
}

// Top 6 Events pre-seeded for instant 0ms initial paint
export const INITIAL_TOP_EVENTS: EventItem[] = [
  {
    id: 'evt-top-0',
    title: 'Automation in Healthcare',
    category: 'NISB',
    date: 'Sep 7, 2026',
    image: 'https://lh3.googleusercontent.com/d/1wxukQjIkKL_kUp9s9hdvI0tu8Kqr8ZwV',
    venue: 'NIE Mysuru',
    description: 'Explore the revolution of healthcare through automated systems, AI diagnostics, and biomedical innovations.',
    regLink: 'https://social.nisb.in',
  },
  {
    id: 'evt-top-1',
    title: "Vigyaan'26",
    category: 'NISB',
    date: 'Jul 6, 2026',
    image: 'https://lh3.googleusercontent.com/d/1NlxToDj9jmvVTiB-UR0u5oaq3Z7ICnsq',
    venue: 'NIE Mysuru',
    description: 'The flagship annual technical extravaganza of NIE IEEE Student Branch bringing competitions and project exhibitions.',
    regLink: 'https://social.nisb.in',
  },
  {
    id: 'evt-top-2',
    title: 'Release of Manas 26 and Mosiac Chase',
    category: 'EDITORIAL',
    date: 'May 30, 2026',
    image: 'https://lh3.googleusercontent.com/d/1qm0sJHLC6g2CRfXa9G8ZfTXdrWTmDbUZ',
    venue: 'NIE Mysuru',
    description: 'Annual magazine launch celebrating student literature, technical writing, and artistic brilliance.',
    regLink: 'https://social.nisb.in',
  },
  {
    id: 'evt-top-3',
    title: 'THE HITCHHIKER’S GUIDE TO MLOps',
    category: 'CS',
    date: 'May 16, 2026',
    image: 'https://lh3.googleusercontent.com/d/1NDwSbfg9h8u9X7EroiPtgqMyy4GNk0LW',
    venue: 'NIE Mysuru',
    description: 'Hands-on bootcamp on bridging Machine Learning model creation with continuous deployment pipelines.',
    regLink: 'https://social.nisb.in',
  },
  {
    id: 'evt-top-4',
    title: 'CrossCurrent & Valedictory',
    category: 'NISB',
    date: 'May 7, 2026',
    image: 'https://lh3.googleusercontent.com/d/1BJS7osF8v9BPipdJTev3sh9EKYJC35Li',
    venue: 'NIE Mysuru',
    description: 'The grand farewell, award recognitions, and annual leadership handover ceremony of NISB.',
    regLink: 'https://social.nisb.in',
  },
  {
    id: 'evt-top-5',
    title: 'Cascade Sprint',
    category: 'WIE',
    date: 'May 6, 2026',
    image: 'https://lh3.googleusercontent.com/d/1bBC1p57TTHiuiHVVpSEKAvXjSizNC7mn',
    venue: 'NIE Mysuru',
    description: 'Fast-paced coding and problem-solving sprint empowering technical women in engineering.',
    regLink: 'https://social.nisb.in',
  },
];

// Preload top event images in advance into browser memory & disk cache
function preloadTopEventImages(items: EventItem[], count = 6) {
  if (typeof window === 'undefined') return;
  const topList = items.slice(0, count);
  topList.forEach((evt) => {
    if (!evt.image) return;
    const img = new Image();
    img.src = evt.image;

    // Also prefetch the drive thumbnail fallback for seamless fallback switching
    if (evt.image.includes('lh3.googleusercontent.com/d/')) {
      const driveId = evt.image.split('lh3.googleusercontent.com/d/')[1];
      const fallbackImg = new Image();
      fallbackImg.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
    }
  });
}

// Immediate browser evaluation preload
if (typeof window !== 'undefined') {
  preloadTopEventImages(INITIAL_TOP_EVENTS, 6);
}

export default function CinematicEventsSection() {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_TOP_EVENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [selectedPosterEvent, setSelectedPosterEvent] = useState<EventItem | null>(null);
  const [visibleGridLimit, setVisibleGridLimit] = useState(12);

  // Reset pagination limit on filter/search change
  useEffect(() => {
    setVisibleGridLimit(12);
  }, [activeCategory, searchQuery]);

  // Sheet Integration Inputs
  const [sheetInput, setSheetInput] = useState(`https://docs.google.com/spreadsheets/d/${OFFICIAL_SPREADSHEET_ID}/edit`);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchLiveSpreadsheet = async (sheetUrl?: string) => {
    setIsLoading(true);
    setStatusMsg('Connecting to Google Sheet API...');

    let targetGvizUrl = LIVE_GVIZ_URL;

    if (sheetUrl) {
      const match = sheetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        targetGvizUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:json`;
      }
    }

    try {
      const res = await fetch(targetGvizUrl);
      const text = await res.text();
      const parsed = parseGVizResponse(text);

      if (parsed.length > 0) {
        setEvents(parsed);
        preloadTopEventImages(parsed, 6);
        try {
          localStorage.setItem('nisb_events_cache_v2', JSON.stringify(parsed));
        } catch (e) { }
        setCurrentIndex(0);
        setStatusMsg('');
      } else {
        setStatusMsg('No events found in spreadsheet.');
      }
    } catch (err) {
      console.error('Failed to load Google Sheet:', err);
      setStatusMsg('Showing cached events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Try instant restore from local cache
    try {
      const cached = localStorage.getItem('nisb_events_cache_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
          preloadTopEventImages(parsed, 6);
        }
      }
    } catch (e) { }

    // 2. Preload top 6 images immediately in advance
    preloadTopEventImages(INITIAL_TOP_EVENTS, 6);

    // 3. Fetch latest updates in background
    fetchLiveSpreadsheet();
  }, []);

  const SOCIETY_CATEGORIES = ['ALL', 'NISB', 'CS', 'WIE', 'CASS', 'RAS', 'GRSS', 'CEDA', 'EDITORIAL'];
  const SPECIAL_FILTERS = ['Collab Events', 'Industrial Visits', 'Social Initiatives', 'Weekly Meetups', 'Technical Talks'];

  // Enhanced category matching supporting collab events (e.g. CS+CASS on both feeds) and thematic filters
  const eventMatchesCategory = (evt: EventItem, cat: string): boolean => {
    if (cat === 'ALL') return true;

    const titleLower = (evt.title || '').toLowerCase();
    const catUpper = (evt.category || '').toUpperCase();
    const descLower = (evt.description || '').toLowerCase();

    if (cat === 'Industrial Visits') {
      return (
        titleLower.includes('visit') ||
        titleLower.includes('tour') ||
        titleLower.includes('isro') ||
        titleLower.includes('iisc') ||
        titleLower.includes('nigst') ||
        titleLower.includes('industry') ||
        catUpper.includes('VISIT') ||
        descLower.includes('industrial visit') ||
        descLower.includes('technical tour')
      );
    }

    if (cat === 'Social Initiatives') {
      return (
        titleLower.includes('social') ||
        titleLower.includes('ashram') ||
        titleLower.includes('divya deepa') ||
        titleLower.includes('literacy') ||
        titleLower.includes('outreach') ||
        titleLower.includes('charity') ||
        catUpper.includes('SOCIAL') ||
        descLower.includes('social initiative')
      );
    }

    if (cat === 'Weekly Meetups') {
      return (
        titleLower.includes('meetup') ||
        titleLower.includes('weekly') ||
        titleLower.includes('sync') ||
        titleLower.includes('peer') ||
        titleLower.includes('focus group') ||
        titleLower.includes('sfg') ||
        titleLower.includes('hfg') ||
        descLower.includes('weekly meetup')
      );
    }

    if (cat === 'Technical Talks') {
      return (
        titleLower.includes('talk') ||
        titleLower.includes('webinar') ||
        titleLower.includes('seminar') ||
        titleLower.includes('lecture') ||
        titleLower.includes('keynote') ||
        titleLower.includes('bootcamp') ||
        titleLower.includes('session') ||
        descLower.includes('technical talk') ||
        descLower.includes('expert lecture')
      );
    }

    if (cat === 'Collab Events') {
      return (
        catUpper.includes('+') ||
        catUpper.includes('&') ||
        catUpper.includes('COLLAB') ||
        titleLower.includes('jointly') ||
        titleLower.includes('collab') ||
        (catUpper.includes('CS') && catUpper.includes('CASS')) ||
        (catUpper.includes('GRSS') && catUpper.includes('WIE'))
      );
    }

    // Society matching with cross-collab detection (e.g. CS+CASS appears on CS, CASS, and Collab feeds)
    if (catUpper === cat.toUpperCase()) return true;
    if (catUpper.includes(cat.toUpperCase())) return true;

    return false;
  };

  const filteredEvents = events.filter((evt) => {
    const matchesCat = eventMatchesCategory(evt, activeCategory);
    const matchesSearch = searchQuery === '' ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.venue && evt.venue.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const currentEvent = filteredEvents[currentIndex] || filteredEvents[0];

  const handleNext = () => {
    if (filteredEvents.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredEvents.length);
  };

  const handlePrev = () => {
    if (filteredEvents.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);
  };

  return (
    <section
      id="events"
      className="premium-section py-20 bg-[var(--void)] text-[var(--star-white)] relative overflow-hidden border-b border-[var(--border-main)]"
    >
      <div className="max-w-[88rem] mx-auto space-y-10 px-4 md:px-12 relative z-10">

        {/* Header & Live Sheet Connection Status */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-main)]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {isLoading ? (
                <span className="text-[10px] font-mono text-[var(--accent)] animate-pulse">
                  {statusMsg}
                </span>
              ) : (
                <span className="text-[10px] font-mono text-green-400 font-bold">
                  {statusMsg}
                </span>
              )}
            </div>

            <h2 className="text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-[var(--star-white)]">
              NISB <span className="text-[var(--accent)]">EVENTS FEED</span>
            </h2>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-full bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-4 py-1 rounded-full text-xs font-mono font-bold uppercase transition-all ${viewMode === 'slider'
                ? 'bg-[var(--star-white)] text-[var(--void)] shadow-md'
                : 'text-white/60 hover:text-white'
                }`}
            >
              Slider
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-1 rounded-full text-xs font-mono font-bold uppercase transition-all ${viewMode === 'grid'
                ? 'bg-[var(--star-white)] text-[var(--void)] shadow-md'
                : 'text-white/60 hover:text-white'
                }`}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Category Pills & Search Input */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Society Badges */}
            {SOCIETY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentIndex(0); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${activeCategory === cat
                  ? 'bg-[var(--accent)] text-[var(--void)] font-extrabold shadow-lg scale-105'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
              >
                {cat}
              </button>
            ))}

            <span className="w-px h-5 bg-white/20 mx-1 hidden sm:inline-block" />

            {/* Special Filters */}
            {SPECIAL_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentIndex(0); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${activeCategory === cat
                  ? 'bg-[var(--star-white)] text-[var(--void)] font-extrabold shadow-lg scale-105'
                  : 'bg-white/[0.03] text-white/60 hover:bg-white/10 hover:text-white border border-dashed border-white/20'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0); }}
            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent)] w-full md:w-72"
          />
        </div>

        {/* ── MODE 1: INFINITE HERO SLIDER VIEW ── */}
        {viewMode === 'slider' && (
          <div className="space-y-6">
            {/* Navigation Header */}
            <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">


              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border border-[var(--border-main)] bg-[var(--card-bg)] hover:border-[var(--accent)] hover:text-[var(--accent)] flex items-center justify-center text-lg font-bold transition-all hover:scale-110 active:scale-95 shadow-xl"
                  title="Previous Event"
                >
                  ←
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-[var(--border-main)] bg-[var(--card-bg)] hover:border-[var(--accent)] hover:text-[var(--accent)] flex items-center justify-center text-lg font-bold transition-all hover:scale-110 active:scale-95 shadow-xl"
                  title="Next Event"
                >
                  ➔
                </button>
              </div>
            </div>

            {/* ── BESPOKE FULL-POSTER EXHIBITION STAGE & CYBER-PASS CARD ── */}
            <div className="relative min-h-[520px] rounded-3xl overflow-hidden border border-white/15 bg-[#060a14] shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
              <AnimatePresence mode="wait">
                {currentEvent && (
                  <motion.div
                    key={currentEvent.id || currentIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch"
                  >
                    {/* Left Column: 100% Full Uncropped Poster Exhibition Stage */}
                    <div
                      onClick={() => setSelectedPosterEvent(currentEvent)}
                      className="lg:col-span-6 relative p-5 sm:p-8 flex items-center justify-center bg-gradient-to-b from-[#080e1c] via-[#050812] to-[#020408] cursor-pointer group/poster overflow-hidden"
                      title="Click to view full event poster in lightbox"
                    >
                      {/* Ambient Ambilight Glow derived from the poster */}
                      <div
                        className="absolute inset-8 rounded-3xl blur-3xl opacity-30 group-hover/poster:opacity-50 transition-opacity duration-700 pointer-events-none scale-90"
                        style={{
                          backgroundImage: `url(${currentEvent.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />

                      {/* Physical Gallery Exhibition Mount */}
                      <div className="relative z-10 w-full max-h-[500px] flex items-center justify-center rounded-2xl p-2.5 sm:p-3 bg-black/50 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-md">
                        {/* Machined Metal Corner Rivets */}
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-300/80 ring-1 ring-black shadow-sm" />
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-300/80 ring-1 ring-black shadow-sm" />
                        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-300/80 ring-1 ring-black shadow-sm" />
                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-300/80 ring-1 ring-black shadow-sm" />

                        {/* 100% UNCROPPED FULL POSTER */}
                        <img
                          src={currentEvent.image}
                          alt={currentEvent.title}
                          loading="eager"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="max-h-[460px] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-500 group-hover/poster:scale-[1.02]"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes('lh3.googleusercontent.com/d/')) {
                              const driveId = target.src.split('lh3.googleusercontent.com/d/')[1];
                              target.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
                            } else {
                              target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';
                            }
                          }}
                        />

                        {/* Hover Magnify Tag */}
                        <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-center gap-1.5 shadow-xl">
                          <span>FULL SIZE</span>
                          <span className="text-[var(--accent)]">⤢</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: High-End Cyber Event Pass & Telemetry Deck */}
                    <div className="lg:col-span-6 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6 relative z-10 bg-gradient-to-br from-[#0c1424] via-[#080d18] to-[#04060c] border-t lg:border-t-0 lg:border-l border-white/15">
                      <div className="space-y-6">
                        {/* Top Ticket Header & Serial */}


                        {/* Formal Event Date & Category Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
                          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/15 backdrop-blur-md shadow-sm">
                            <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs font-mono font-bold tracking-wider text-white">
                              {currentEvent.date}
                            </span>
                          </div>

                          <span className="px-3 py-1 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/35 text-[10px] font-mono font-extrabold text-[var(--accent)] tracking-widest uppercase">
                            NISB {currentEvent.category}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight font-display leading-tight">
                          {currentEvent.title}
                        </h3>

                        <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed max-w-xl">
                          {currentEvent.description}
                        </p>

                        {/* Telemetry Chips: Venue & Society */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
                            <span className="text-[9px] uppercase tracking-wider text-[var(--accent)] font-bold block">
                              ORGANISER
                            </span>
                            <span className="text-xs font-bold text-white truncate block mt-0.5">
                              NISB {currentEvent.category}
                            </span>
                          </div>

                          {currentEvent.venue && (
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
                              <span className="text-[9px] uppercase tracking-wider text-[var(--accent)] font-bold block">
                                VENUE
                              </span>
                              <span className="text-xs font-bold text-white truncate block mt-0.5">
                                {currentEvent.venue}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedPosterEvent(currentEvent)}
                          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-all flex items-center gap-2 hover:scale-102"
                        >
                          <span>VIEW FULL POSTER</span>
                          <span className="text-[var(--accent)]">⤢</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePrev}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-sm text-white transition-all"
                            title="Previous Event"
                          >
                            ←
                          </button>
                          <button
                            onClick={handleNext}
                            className="w-10 h-10 rounded-full bg-[var(--accent)] hover:bg-sky-300 text-black font-bold flex items-center justify-center text-sm transition-all shadow-[0_0_15px_var(--accent-glow)]"
                            title="Next Event"
                          >
                            →
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Event Thumbnail Fast-Scroller Bar */}

          </div>
        )}

        {/* ── MODE 2: PAGINATED 185+ EVENTS GRID VIEW ── */}
        {viewMode === 'grid' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.slice(0, visibleGridLimit).map((evt, idx) => (
                <div
                  key={evt.id || idx}
                  onClick={() => setSelectedPosterEvent(evt)}
                  className="group relative rounded-3xl bg-[var(--card-bg)] border border-[var(--border-main)] hover:border-[var(--accent)] overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[380px] p-6 cursor-pointer"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      loading={idx < 6 ? 'eager' : 'lazy'}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('lh3.googleusercontent.com/d/')) {
                          const driveId = target.src.split('lh3.googleusercontent.com/d/')[1];
                          target.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
                        } else {
                          target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';
                        }
                      }}
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur border border-white/15 text-[9px] font-mono font-bold text-[var(--accent)] uppercase">
                      {evt.category}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[8px] font-mono text-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                      Full Poster
                    </div>
                    {evt.venue && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[8px] font-mono text-white/80">
                        {evt.venue}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--accent)] font-bold block mb-1">
                        {evt.date}
                      </span>
                      <h4 className="text-xl font-extrabold text-white tracking-tight group-hover:text-[var(--accent)] transition-colors leading-snug">
                        {evt.title}
                      </h4>
                      <p className="text-xs font-sans text-[var(--text-muted)] mt-1.5 line-clamp-2">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[var(--accent)] font-bold">
                      <span>View Full Poster ➔</span>
                      <span className="text-white/40 group-hover:text-white">NISB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Events Button */}
            {visibleGridLimit < filteredEvents.length && (
              <div className="flex flex-col items-center justify-center pt-6 gap-3">
                <button
                  onClick={() => setVisibleGridLimit((prev) => prev + 12)}
                  className="px-8 py-4 rounded-full bg-[var(--accent)] text-[var(--void)] text-xs font-mono font-extrabold uppercase tracking-widest hover:scale-105 transition-all shadow-xl hover:shadow-[0_0_25px_var(--accent-glow)] flex items-center gap-3 group"
                >
                  <span>LOAD MORE EVENTS</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-mono font-black">
                    +{Math.min(12, filteredEvents.length - visibleGridLimit)}
                  </span>
                  <span className="group-hover:translate-y-0.5 transition-transform font-bold">↓</span>
                </button>
                <span className="text-[11px] font-mono text-[var(--text-muted)] font-bold">
                  Showing {Math.min(visibleGridLimit, filteredEvents.length)} of {filteredEvents.length} events
                </span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── FULL EVENT POSTER CARD MODAL ── */}
      <AnimatePresence>
        {selectedPosterEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPosterEvent(null)}
            className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full rounded-3xl bg-[#09090d] border border-white/20 p-6 md:p-8 shadow-2xl overflow-y-auto flex flex-col lg:flex-row gap-8 items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPosterEvent(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-lg flex items-center justify-center transition-all shadow-xl"
                title="Close Poster Card"
              >
                ✕
              </button>

              {/* Full Uncropped Poster Image Container */}
              <div className="w-full lg:w-1/2 flex items-center justify-center bg-black/80 rounded-2xl p-3 border border-white/10 overflow-hidden max-h-[70vh] shadow-2xl">
                <img
                  src={selectedPosterEvent.image}
                  alt={selectedPosterEvent.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('lh3.googleusercontent.com/d/')) {
                      const driveId = target.src.split('lh3.googleusercontent.com/d/')[1];
                      target.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
                    }
                  }}
                />
              </div>

              {/* Poster Card Info Details */}
              <div className="w-full lg:w-1/2 space-y-5 text-left flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/40 text-[var(--accent)] text-[10px] font-mono font-bold uppercase">
                      {selectedPosterEvent.category}
                    </span>
                    {selectedPosterEvent.venue && (
                      <span className="text-xs font-mono text-white/60">
                        {selectedPosterEvent.venue}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl md:text-4xl font-black uppercase text-white font-display leading-tight tracking-tight">
                    {selectedPosterEvent.title}
                  </h3>

                  <p className="text-xs font-mono text-[var(--accent)] font-bold">
                    EVENT DATE: {selectedPosterEvent.date}
                  </p>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-sans text-white/80 leading-relaxed">
                    {selectedPosterEvent.description}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a
                    href={selectedPosterEvent.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all text-center"
                  >
                    Open Original Image
                  </a>
                  <button
                    onClick={() => setSelectedPosterEvent(null)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[var(--accent)] text-black text-xs font-mono font-bold uppercase hover:scale-105 transition-all shadow-lg"
                  >
                    Close Poster Card
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
