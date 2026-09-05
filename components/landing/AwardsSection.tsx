'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface AwardItem {
  id: string;
  year: string;
  category: string;
  title: string;
  issuer: string;
  description: string;
  highlight?: boolean;
  type: 'global' | 'branch' | 'chapter' | 'individual' | 'special';
}

const AWARDS: AwardItem[] = [
  // ─────────────────────────────────────────────
  // GLOBAL & MAJOR DISTINCTIONS
  // ─────────────────────────────────────────────
  {
    id: 'merwin',
    year: '2020–2025',
    category: 'GLOBAL DISTINCTION',
    title: 'Richard E. Merwin Scholarship (REM)',
    issuer: 'IEEE Computer Society',
    description:
      'Prestigious global scholarship earned by 5 NISB student leaders recognizing exceptional technical promise and IEEE involvement.',
    highlight: true,
    type: 'global',
  },
  {
    id: 'top25',
    year: '2025',
    category: 'GLOBAL & SECTION RECOGNITION',
    title: 'Top 25 Student Branch Recognition',
    issuer: 'IEEE Bangalore Section',
    description:
      'NISB was awarded the Certificate of Achievement recognizing its ranking among the Top 25 Student Branches across the section.',
    highlight: true,
    type: 'global',
  },
  {
    id: 'mem-top3',
    year: '2018',
    category: 'MEMBERSHIP EXCELLENCE',
    title: 'Top 3 in Student Membership Count',
    issuer: 'IEEE Bangalore Section',
    description:
      'Secured a Top 3 regional position with a record active membership strength of 316 dedicated student engineers.',
    highlight: true,
    type: 'global',
  },

  // ─────────────────────────────────────────────
  // STUDENT BRANCH EXCELLENCE
  // ─────────────────────────────────────────────
  {
    id: 'best-sb-2011',
    year: '2011',
    category: 'STUDENT BRANCH EXCELLENCE',
    title: 'Best Student Branch Award',
    issuer: 'IEEE',
    description:
      'Recognized NISB for stellar operational vitality, high-impact student engagement, and pioneering technical initiatives.',
    highlight: true,
    type: 'branch',
  },
  {
    id: 'out-sb-2013',
    year: '2013',
    category: 'STUDENT BRANCH EXCELLENCE',
    title: 'Outstanding Student Branch Award',
    issuer: 'IEEE',
    description:
      'Honoured NISB for sustained technical excellence, student leadership development, and exemplary symposium organization.',
    highlight: true,
    type: 'branch',
  },
  {
    id: 'large-sb-2015',
    year: '2015',
    category: 'STUDENT BRANCH EXCELLENCE',
    title: 'Best Large Student Branch Award',
    issuer: 'IEEE',
    description:
      'Distinguished as the premier large student branch across the region for expansive research projects and community fests.',
    highlight: true,
    type: 'branch',
  },
  {
    id: 'large-sb-2018-19',
    year: '2018–19',
    category: 'STUDENT BRANCH EXCELLENCE',
    title: 'Best Large Outstanding Student Branch',
    issuer: 'IEEE',
    description:
      'Recognized for exceptional contribution, record participant turnout, and sustained operational excellence.',
    highlight: true,
    type: 'branch',
  },
  {
    id: 'large-sb-2023-24',
    year: '2023–24',
    category: 'STUDENT BRANCH EXCELLENCE',
    title: 'Outstanding Large Student Branch Award',
    issuer: 'IEEE Bangalore Section',
    description:
      'NISB was felicitated with the Outstanding Large Student Branch trophy at the annual section awards banquet in 2024.',
    highlight: true,
    type: 'branch',
  },
  {
    id: 'mysuru-sb-2025',
    year: '2025',
    category: 'STUDENT BRANCH EXCELLENCE',
    title: 'Outstanding Large Student Branch Award',
    issuer: 'IEEE Mysuru Subsection AGM',
    description:
      'NISB was honoured for its continuous regional mentorship, hackathons, and high volunteer engagement at the 2025 AGM.',
    highlight: true,
    type: 'branch',
  },

  // ─────────────────────────────────────────────
  // DIGITAL & CHAPTER EXCELLENCE
  // ─────────────────────────────────────────────
  {
    id: 'digital-2024',
    year: '2024',
    category: 'DIGITAL EXCELLENCE',
    title: 'Outstanding Digital Presence Award',
    issuer: 'IEEE Bangalore Section',
    description:
      'Awarded for our state-of-the-art web portals, technical blogs, Tech & Tales podcasts, and digital ecosystem.',
    highlight: true,
    type: 'chapter',
  },
  {
    id: 'cass-best-2024',
    year: '2024',
    category: 'CHAPTER EXCELLENCE',
    title: 'Best Student Branch Chapter — CASS',
    issuer: 'IEEE CASS Bangalore Chapter',
    description:
      'NISB CASS was recognized as the Best Student Branch Chapter for premier circuit design bootcamps and workshops.',
    highlight: true,
    type: 'chapter',
  },
  {
    id: 'grss-best-2024',
    year: '2024',
    category: 'CHAPTER EXCELLENCE',
    title: 'Best Student Branch Chapter — GRSS',
    issuer: 'IEEE GRSS Bangalore Chapter',
    description:
      'NISB GRSS was awarded the Best Chapter distinction for pioneering remote sensing datathons and ISRO technical visits.',
    highlight: true,
    type: 'chapter',
  },
  {
    id: 'grss-large-2024',
    year: '2024',
    category: 'CHAPTER EXCELLENCE',
    title: 'Largest Student Branch Chapter — GRSS',
    issuer: 'IEEE GRSS Bangalore Chapter',
    description:
      'Recognized for cultivating the largest active student chapter focused on earth observation and geoscience analytics.',
    type: 'chapter',
  },
  {
    id: 'cs-out-2025',
    year: '2025',
    category: 'CHAPTER EXCELLENCE',
    title: 'Outstanding Student Branch Chapter — CS',
    issuer: 'IEEE CS Bangalore Chapter',
    description:
      'Recognized for exceptional MLOps bootcamps, open-source sprints, and competitive algorithmic leagues.',
    highlight: true,
    type: 'chapter',
  },
  {
    id: 'grss-large-2025',
    year: '2025',
    category: 'CHAPTER EXCELLENCE',
    title: 'Large Student Branch Award — GRSS',
    issuer: 'IEEE GRSS Bangalore Chapter',
    description:
      'Honoured with the Large Chapter distinction for sustained membership growth and research projects.',
    type: 'chapter',
  },

  // ─────────────────────────────────────────────
  // INDIVIDUAL & LEADERSHIP RECOGNITION
  // ─────────────────────────────────────────────
  {
    id: 'lead-faculty-2025',
    year: '2025',
    category: 'FACULTY EXCELLENCE',
    title: 'Best Faculty Advisor Award',
    issuer: 'IEEE CAS Bangalore Chapter',
    description:
      'Dr. Shashidhara H R was honoured for extraordinary mentorship, academic guidance, and student research empowerment.',
    highlight: true,
    type: 'individual',
  },
  {
    id: 'lead-mahima-2025',
    year: '2025',
    category: 'INDIVIDUAL RECOGNITION',
    title: 'Outstanding Student Volunteer Award',
    issuer: 'IEEE Bangalore Section',
    description:
      'Mahima Shripad Hegde was recognized for exemplary student leadership and service to the IEEE engineering community.',
    highlight: true,
    type: 'individual',
  },
  {
    id: 'lead-deepashree-2024',
    year: '2024',
    category: 'INDIVIDUAL RECOGNITION',
    title: 'Best Student Volunteer Award',
    issuer: 'IEEE Bangalore CASS Chapter',
    description:
      'Deepashree was felicitated for outstanding dedication, technical leadership, and hardware project coordination.',
    type: 'individual',
  },
  {
    id: 'lead-namratha-2024',
    year: '2024',
    category: 'INDIVIDUAL RECOGNITION',
    title: 'Outstanding Student Volunteer Award',
    issuer: 'IEEE WIE Bangalore Section',
    description:
      'Namratha Gopinath was honoured for impactful leadership as WIE Chairperson and driving community outreach drives.',
    type: 'individual',
  },
  {
    id: 'lead-susha-2025',
    year: '2025',
    category: 'INDIVIDUAL RECOGNITION',
    title: 'Outstanding Student Volunteer Award',
    issuer: 'IEEE Mysuru Subsection',
    description:
      'Susha Hegde was recognized for valuable contributions and high-energy volunteer coordination across subsection events.',
    type: 'individual',
  },
  {
    id: 'lead-shraddha-2025',
    year: '2025',
    category: 'INDIVIDUAL RECOGNITION',
    title: 'Best Student Volunteer Award',
    issuer: 'IEEE CEDA Bangalore Chapter',
    description:
      'Shraddha Satish Amalkar was honoured for leadership and driving electronic design automation initiatives.',
    type: 'individual',
  },
];

const CATEGORIES = [
  { label: 'ALL HONOURS', value: 'all' },
  { label: 'GLOBAL & MAJOR', value: 'global' },
  { label: 'BRANCH EXCELLENCE', value: 'branch' },
  { label: 'SOCIETY & CHAPTERS', value: 'chapter' },
  { label: 'LEADERSHIP & VOLUNTEERS', value: 'individual' },
];

export default function AwardsSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'global' | 'branch' | 'chapter' | 'individual'>('all');
  const [viewMode, setViewMode] = useState<'orbit' | 'grid'>('orbit');
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(440);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rotationAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const activeIndexRef = useRef(0);
  const isAutoSpinningRef = useRef(true);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

  // Keep auto-spin ref in sync with state
  useEffect(() => {
    isAutoSpinningRef.current = isAutoSpinning;
  }, [isAutoSpinning]);

  const filteredAwards = useMemo(() => {
    if (activeTab === 'all') return AWARDS;
    return AWARDS.filter((a) => a.type === activeTab);
  }, [activeTab]);

  const count = filteredAwards.length;

  // Responsive radius calculation
  useEffect(() => {
    const updateRadius = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w < 640) {
        setRadius(230);
      } else if (w < 1024) {
        setRadius(340);
      } else {
        setRadius(460);
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Update DOM cards transforms directly on GPU without React re-render thrashing
  const updateCardPositions = useCallback(() => {
    const angle = rotationAngleRef.current;
    const n = filteredAwards.length;
    if (n === 0) return;

    const step = (2 * Math.PI) / n;

    // Determine current active index
    let norm = (-angle) % (2 * Math.PI);
    if (norm < 0) norm += 2 * Math.PI;
    const closestIdx = Math.round(norm / step) % n;

    if (closestIdx !== activeIndexRef.current) {
      activeIndexRef.current = closestIdx;
      setActiveIndex(closestIdx);
    }

    cardsRef.current.forEach((el, i) => {
      if (!el) return;
      const theta = angle + i * step;
      const x = Math.sin(theta) * radius;
      const z = Math.cos(theta) * radius - radius;

      const depthProgress = (z + 2 * radius) / (2 * radius);
      const scale = 0.58 + depthProgress * 0.44;
      const opacity = Math.max(0.18, Math.pow(depthProgress, 1.8));
      const isFront = depthProgress > 0.88;
      const zIndex = Math.round(depthProgress * 100);

      el.style.transform = `translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = `${zIndex}`;
      el.style.filter = isFront ? 'none' : `blur(${Math.max(0, (1 - depthProgress) * 4).toFixed(1)}px)`;

      if (isFront) {
        el.classList.add('ring-1', 'ring-[var(--accent)]/50', 'border-[var(--accent)]');
      } else {
        el.classList.remove('ring-1', 'ring-[var(--accent)]/50', 'border-[var(--accent)]');
      }
    });
  }, [filteredAwards.length, radius]);

  // Main high-performance Animation Frame Loop
  useEffect(() => {
    if (viewMode !== 'orbit' || count === 0) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isDraggingRef.current) {
        if (isAutoSpinningRef.current) {
          const speed = (2 * Math.PI) / 28;
          rotationAngleRef.current -= speed * dt;
          targetAngleRef.current = rotationAngleRef.current;
        } else {
          // Smoothly interpolate towards target angle
          rotationAngleRef.current += (targetAngleRef.current - rotationAngleRef.current) * Math.min(1, dt * 7);
        }
      }

      updateCardPositions();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [viewMode, count, updateCardPositions]);

  // Reset angle when changing category
  const handleCategoryChange = (val: any) => {
    setActiveTab(val);
    rotationAngleRef.current = 0;
    targetAngleRef.current = 0;
    activeIndexRef.current = 0;
    setActiveIndex(0);
  };

  // Handle Drag / Scrub
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsAutoSpinning(false);
    isAutoSpinningRef.current = false;
    dragStartX.current = e.clientX;
    dragStartAngle.current = rotationAngleRef.current;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartX.current;
    const sensitivity = 0.0055;
    rotationAngleRef.current = dragStartAngle.current + deltaX * sensitivity;
    targetAngleRef.current = rotationAngleRef.current;
    updateCardPositions();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch { }
  };

  // Rotate directly to a card
  const rotateToCard = useCallback(
    (index: number) => {
      const n = filteredAwards.length;
      if (n === 0) return;
      const step = (2 * Math.PI) / n;
      const target = -index * step;
      const current = rotationAngleRef.current;
      const diff = ((target - current + Math.PI) % (2 * Math.PI)) - Math.PI;
      targetAngleRef.current = current + diff;
      setIsAutoSpinning(false);
      isAutoSpinningRef.current = false;
    },
    [filteredAwards.length]
  );

  const nextCard = () => {
    rotateToCard((activeIndexRef.current + 1) % count);
  };

  const prevCard = () => {
    rotateToCard((activeIndexRef.current - 1 + count) % count);
  };

  return (
    <section
      id="awards"
      className="premium-section py-20 bg-[var(--void)] text-[var(--star-white)] relative overflow-hidden border-b border-[var(--border-main)] select-none"
    >
      {/* ── AMBIENT SCI-FI BACKGROUND LIGHTING ── */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[var(--void)]/90 pointer-events-none" />

      <div className="max-w-[92rem] mx-auto space-y-10 px-4 md:px-10 relative z-10">
        {/* ── HEADER & CONTROLS ── */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-main)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[10px] font-mono font-bold tracking-widest text-[var(--accent)] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                IEEE DISTINCTIONS &amp; RECOGNITIONS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-[var(--star-white)] leading-tight">
              AWARDS &amp; <span className="text-[var(--accent)]">ACHIEVEMENTS</span>
            </h2>
          </div>

          {/* Mode Switcher: 3D Orbit vs Full Grid */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex rounded-full bg-white/5 border border-white/10 p-1">
              <button
                onClick={() => setViewMode('orbit')}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${viewMode === 'orbit'
                  ? 'bg-[var(--star-white)] text-[var(--void)] shadow-lg shadow-white/10'
                  : 'text-white/60 hover:text-white'
                  }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" strokeDasharray="4 2" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
                </svg>
                <span>3D Orbit Slider</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${viewMode === 'grid'
                  ? 'bg-[var(--star-white)] text-[var(--void)] shadow-lg shadow-white/10'
                  : 'text-white/60 hover:text-white'
                  }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <span>All Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── CATEGORY PILLS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${activeTab === cat.value
                ? 'bg-[var(--accent)] text-[var(--void)] shadow-lg scale-105'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* ── MODE 1: 3D CIRCULAR ORBITAL SLIDER (INFINITE GRAPHIC) ── */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {viewMode === 'orbit' && (
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] via-black/60 to-black/90 p-4 sm:p-8 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            {/* Top Interactive Status Bar */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-[var(--accent)] font-bold">
                  ORBIT {activeIndex + 1} / {count}
                </span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-white/60 hidden sm:inline">
                  Drag to rotate 360° or use controls
                </span>
              </div>

              {/* Orbit Controls (Play/Pause & Arrow Navigation) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                  className={`px-3 py-1 rounded-full border text-[11px] font-bold transition-colors flex items-center gap-1.5 ${isAutoSpinning
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                    : 'border-white/20 text-white/70 bg-white/5'
                    }`}
                  title={isAutoSpinning ? 'Pause auto-rotation' : 'Resume auto-rotation'}
                >
                  <span className={`w-2 h-2 rounded-full ${isAutoSpinning ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`} />
                  <span>{isAutoSpinning ? 'SPINNING' : 'PAUSED'}</span>
                </button>

                <button
                  onClick={prevCard}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-90"
                  aria-label="Previous Award"
                >
                  ❮
                </button>
                <button
                  onClick={nextCard}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-90"
                  aria-label="Next Award"
                >
                  ❯
                </button>
              </div>
            </div>

            {/* 3D Cylindrical Perspective Stage */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-full h-[460px] sm:h-[500px] md:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[1400px] select-none touch-pan-y"
            >
              {/* Background Circular Gyroscope / Orbital Reactor Rings */}
              <div
                className="absolute w-[360px] sm:w-[500px] md:w-[620px] h-[360px] sm:h-[500px] md:h-[620px] rounded-full border border-[var(--accent)]/15 pointer-events-none animate-[spin_60s_linear_infinite]"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(6, 182, 212, 0.08), 0 0 80px rgba(6, 182, 212, 0.05)',
                }}
              />
              <div
                className="absolute w-[240px] sm:w-[350px] md:w-[440px] h-[240px] sm:h-[350px] md:h-[440px] rounded-full border border-dashed border-amber-500/20 pointer-events-none animate-[spin_40s_linear_infinite_reverse]"
              />
              <div className="absolute w-32 h-32 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />

              {/* 3D Circular Orbit Ring Cards */}
              {filteredAwards.map((award, i) => {
                return (
                  <div
                    key={award.id}
                    ref={(el) => { cardsRef.current[i] = el; }}
                    onClick={() => rotateToCard(i)}
                    className="absolute w-[280px] sm:w-[320px] md:w-[360px] p-6 sm:p-7 rounded-3xl border transition-shadow duration-300 backdrop-blur-xl flex flex-col justify-between cursor-pointer bg-gradient-to-br from-white/[0.14] via-[#0b1324]/95 to-[#050914] border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] will-change-transform"
                  >
                    {/* Top Row: Year & Category Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-black uppercase tracking-wider text-[var(--accent)]">
                        {award.year}
                      </span>
                      <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-white/70 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        {award.category.split(' ')[0]}
                      </span>
                    </div>

                    {/* Middle: Trophy Medal Icon & Title */}
                    <div className="space-y-3 my-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border bg-gradient-to-tr from-[var(--accent)]/30 to-amber-400/20 border-[var(--accent)]/50 text-amber-300 shadow-md">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-black uppercase font-display tracking-tight leading-tight line-clamp-2 text-white">
                            {award.title}
                          </h3>
                          <p className="text-[11px] font-mono text-[var(--accent)] font-semibold mt-0.5 line-clamp-1">
                            {award.issuer}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs font-sans leading-relaxed line-clamp-3 text-white/85">
                        {award.description}
                      </p>
                    </div>

                    {/* Bottom Telemetry Bar */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[var(--accent)] font-bold">
                        ★ IEEE SPOTLIGHT
                      </span>
                      <span className="text-white/40">NISB MYSURU</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Slider Nav Indicators */}
            <div className="flex items-center justify-center gap-1.5 pt-4 flex-wrap max-w-xl mx-auto">
              {filteredAwards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => rotateToCard(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx
                    ? 'w-8 bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* ── MODE 2: COMPREHENSIVE ALL-AWARDS GRID VIEW ── */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAwards.map((award, i) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`p-7 rounded-3xl border transition-all duration-500 flex flex-col justify-between gap-6 group relative overflow-hidden ${award.highlight
                  ? 'bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent border-[var(--accent)]/50 hover:border-[var(--accent)] shadow-[0_0_30px_rgba(0,0,0,0.6)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                  }`}
              >
                {/* Top Row: Year & Category Pill */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-[var(--accent)]">
                    {award.year}
                  </span>
                  <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-white/60 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                    {award.category}
                  </span>
                </div>

                {/* Middle: Title & Issuer */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black uppercase font-display tracking-tight text-white group-hover:text-[var(--accent)] transition-colors leading-tight">
                    {award.title}
                  </h3>
                  <p className="text-xs font-mono text-white/50 uppercase tracking-wider">
                    {award.issuer}
                  </p>
                  <p className="text-xs sm:text-sm font-sans text-white/70 leading-relaxed pt-2">
                    {award.description}
                  </p>
                </div>

                {/* Bottom decorative bar */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40 group-hover:text-[var(--accent)] transition-colors">
                  <span>IEEE VERIFIED HONOUR</span>
                  <span className="text-base group-hover:translate-x-1 transition-transform">★</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── INFINITE MARQUEE STRIP AT THE BASE ── */}
        <div className="relative overflow-hidden py-4 border-y border-white/10 bg-white/[0.02] rounded-2xl">
          <div className="flex items-center gap-8 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
            {[
              'RICHARD E. MERWIN SCHOLARSHIP RECIPIENTS',
              '•',
              'R10 BEST STUDENT CHAPTER',
              '•',
              'TOP 25 STUDENT BRANCH BANGALORE SECTION',
              '•',
              'BEST STUDENT BRANCH CHAPTER CASS 2024',
              '•',
              'BEST STUDENT BRANCH CHAPTER GRSS 2024',
              '•',
              'OUTSTANDING STUDENT BRANCH CHAPTER CS 2025',
              '•',
              'DARREL CHONG STUDENT ACTIVITY HONOUR',
              '•',
              '25+ YEARS OF RAW ENGINEERING EXCELLENCE',
              '•',
            ].map((text, idx) => (
              <span
                key={idx}
                className="text-xs font-mono font-bold tracking-widest text-white/60 uppercase hover:text-[var(--accent)] transition-colors"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
