'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface AwardItem {
  id: string;
  year: string;
  category: string;
  title: string;
  issuer: string;
  description: string;
  highlight?: boolean;
  type: 'global' | 'branch' | 'chapter' | 'individual';
  accent?: string;
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
    accent: '#f59e0b',
  },
  {
    id: 'top25',
    year: '2025',
    category: 'GLOBAL RECOGNITION',
    title: 'Top 25 Student Branch Recognition',
    issuer: 'IEEE Bangalore Section',
    description:
      'NISB was awarded the Certificate of Achievement recognizing its ranking among the Top 25 Student Branches across the section.',
    highlight: true,
    type: 'global',
    accent: '#38bdf8',
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
    accent: '#a855f7',
  },

  // ─────────────────────────────────────────────
  // STUDENT BRANCH EXCELLENCE
  // ─────────────────────────────────────────────
  {
    id: 'best-sb-2011',
    year: '2011',
    category: 'BRANCH EXCELLENCE',
    title: 'Best Student Branch Award',
    issuer: 'IEEE',
    description:
      'Recognized NISB for stellar operational vitality, high-impact student engagement, and pioneering technical initiatives.',
    highlight: true,
    type: 'branch',
    accent: '#10b981',
  },
  {
    id: 'out-sb-2013',
    year: '2013',
    category: 'BRANCH EXCELLENCE',
    title: 'Outstanding Student Branch Award',
    issuer: 'IEEE',
    description:
      'Honoured NISB for sustained technical excellence, student leadership development, and exemplary symposium organization.',
    highlight: true,
    type: 'branch',
    accent: '#06b6d4',
  },
  {
    id: 'large-sb-2015',
    year: '2015',
    category: 'BRANCH EXCELLENCE',
    title: 'Best Large Student Branch Award',
    issuer: 'IEEE',
    description:
      'Distinguished as the premier large student branch across the region for expansive research projects and community fests.',
    highlight: true,
    type: 'branch',
    accent: '#ec4899',
  },
  {
    id: 'large-sb-2018-19',
    year: '2018–19',
    category: 'BRANCH EXCELLENCE',
    title: 'Best Large Outstanding Student Branch',
    issuer: 'IEEE',
    description:
      'Recognized for exceptional contribution, record participant turnout, and sustained operational excellence.',
    highlight: true,
    type: 'branch',
    accent: '#f43f5e',
  },
  {
    id: 'large-sb-2023-24',
    year: '2023–24',
    category: 'BRANCH EXCELLENCE',
    title: 'Outstanding Large Student Branch Award',
    issuer: 'IEEE Bangalore Section',
    description:
      'NISB was felicitated with the Outstanding Large Student Branch trophy at the annual section awards banquet in 2024.',
    highlight: true,
    type: 'branch',
    accent: '#3b82f6',
  },
  {
    id: 'mysuru-sb-2025',
    year: '2025',
    category: 'BRANCH EXCELLENCE',
    title: 'Outstanding Large Student Branch Award',
    issuer: 'IEEE Mysuru Subsection AGM',
    description:
      'NISB was honoured for its continuous regional mentorship, hackathons, and high volunteer engagement at the 2025 AGM.',
    highlight: true,
    type: 'branch',
    accent: '#eab308',
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
    accent: '#38bdf8',
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
    accent: '#f59e0b',
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
    accent: '#a855f7',
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
    accent: '#10b981',
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
    accent: '#06b6d4',
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
    accent: '#eab308',
  },
  {
    id: 'lead-mahima-2025',
    year: '2025',
    category: 'LEADERSHIP EXCELLENCE',
    title: 'Outstanding Student Volunteer Award',
    issuer: 'IEEE Bangalore Section',
    description:
      'Mahima Shripad Hegde was recognized for exemplary student leadership and service to the IEEE engineering community.',
    highlight: true,
    type: 'individual',
    accent: '#ec4899',
  },
  {
    id: 'lead-deepashree-2024',
    year: '2024',
    category: 'LEADERSHIP EXCELLENCE',
    title: 'Best Student Volunteer Award',
    issuer: 'IEEE Bangalore CASS Chapter',
    description:
      'Deepashree was felicitated for outstanding dedication, technical leadership, and hardware project coordination.',
    type: 'individual',
    accent: '#f59e0b',
  },
  {
    id: 'lead-namratha-2024',
    year: '2024',
    category: 'LEADERSHIP EXCELLENCE',
    title: 'Outstanding Student Volunteer Award',
    issuer: 'IEEE WIE Bangalore Section',
    description:
      'Namratha Gopinath was honoured for impactful leadership as WIE Chairperson and driving community outreach drives.',
    type: 'individual',
    accent: '#f43f5e',
  },
  {
    id: 'lead-susha-2025',
    year: '2025',
    category: 'LEADERSHIP EXCELLENCE',
    title: 'Outstanding Student Volunteer Award',
    issuer: 'IEEE Mysuru Subsection',
    description:
      'Susha Hegde was recognized for valuable contributions and high-energy volunteer coordination across subsection events.',
    type: 'individual',
    accent: '#38bdf8',
  },
  {
    id: 'lead-shraddha-2025',
    year: '2025',
    category: 'LEADERSHIP EXCELLENCE',
    title: 'Best Student Volunteer Award',
    issuer: 'IEEE CEDA Bangalore Chapter',
    description:
      'Shraddha Satish Amalkar was honoured for leadership and driving electronic design automation initiatives.',
    type: 'individual',
    accent: '#3b82f6',
  },
];

export default function AwardsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardNodesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Physics and continuous scroll offset state
  const currentOffsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);

  const totalCards = AWARDS.length;
  const totalCardsRef = useRef(totalCards);

  // Helper: Shortest modular distance in circular array
  const getShortestDiff = useCallback((target: number, current: number, total: number) => {
    if (total <= 0) return 0;
    let diff = (target - current) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  }, []);

  const activeIdxRef = useRef(0);
  const isLoopRunningRef = useRef(false);
  const isInViewRef = useRef(true);
  const animIdRef = useRef<number | null>(null);

  // Update card 3D transforms directly on DOM for 120fps smooth performance
  const renderCards = useCallback(() => {
    const total = totalCardsRef.current;
    if (total === 0) return;

    const offset = currentOffsetRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const cardSpacing = isMobile ? 260 : 340;

    let closestDist = Infinity;
    let newActiveIdx = 0;

    cardNodesRef.current.forEach((card, i) => {
      if (!card || i >= total) return;

      // Calculate relative circular distance to current offset
      let rel = (i - offset) % total;
      if (rel > total / 2) rel -= total;
      if (rel < -total / 2) rel += total;

      const absRel = Math.abs(rel);
      if (absRel < closestDist) {
        closestDist = absRel;
        newActiveIdx = i;
      }

      // Parabolic 3D curve positioning
      const x = rel * cardSpacing;
      // Cards curve gently backward as they move away from center
      const z = -Math.min(absRel * 130, 600);
      const rotateY = -rel * 14; // Subtle 3D tilt facing center
      const scale = Math.max(0.72, 1 - absRel * 0.12);
      const opacity = Math.max(0, 1 - absRel * 0.36);
      const blur = isMobile ? 0 : Math.max(0, (absRel - 0.6) * 4);
      const zIndex = Math.round((10 - Math.min(absRel, 10)) * 100);

      // Apply transform & styling
      card.style.transform = `translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(2);
      if (!isMobile) {
        card.style.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : 'none';
      }
      card.style.zIndex = `${zIndex}`;
      card.style.visibility = opacity > 0.02 ? 'visible' : 'hidden';

      if (absRel < 0.45) {
        card.classList.add('active-card-center');
      } else {
        card.classList.remove('active-card-center');
      }
    });

    if (newActiveIdx !== activeIdxRef.current) {
      activeIdxRef.current = newActiveIdx;
      setActiveIndex(newActiveIdx);
    }
  }, []);

  const startLoop = useCallback(() => {
    if (isLoopRunningRef.current || !isInViewRef.current) return;
    isLoopRunningRef.current = true;

    const tick = () => {
      if (!isInViewRef.current) {
        isLoopRunningRef.current = false;
        return;
      }

      // Apply momentum friction when user releases drag
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.0005) {
          targetOffsetRef.current += velocityRef.current;
          velocityRef.current *= 0.90; // smooth friction
        } else {
          // Snap strictly to nearest integer card when velocity subsides
          const currentTgt = targetOffsetRef.current;
          const nearest = Math.round(currentTgt);
          targetOffsetRef.current += (nearest - currentTgt) * 0.12;
        }
      }

      // Smooth lerp of current offset towards target offset
      const diff = targetOffsetRef.current - currentOffsetRef.current;
      currentOffsetRef.current += diff * 0.14;

      renderCards();

      // If animation has settled and user is not dragging, stop the RAF loop!
      const isSettled =
        !isDraggingRef.current &&
        Math.abs(velocityRef.current) < 0.0005 &&
        Math.abs(diff) < 0.001;

      if (!isSettled) {
        animIdRef.current = requestAnimationFrame(tick);
      } else {
        isLoopRunningRef.current = false;
      }
    };

    animIdRef.current = requestAnimationFrame(tick);
  }, [renderCards]);

  // Main Animation / Friction Deceleration Loop with Idle & Viewport detection
  useEffect(() => {
    renderCards();
    startLoop();

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startLoop();
        } else if (animIdRef.current) {
          cancelAnimationFrame(animIdRef.current);
          isLoopRunningRef.current = false;
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [renderCards, startLoop]);

  // Navigate to specific card index smoothly
  const navigateToIndex = useCallback((index: number) => {
    const total = totalCardsRef.current;
    if (total === 0) return;
    const diff = getShortestDiff(index, targetOffsetRef.current, total);
    targetOffsetRef.current += diff;
    velocityRef.current = 0;
    startLoop();
  }, [getShortestDiff, startLoop]);

  // Pointer / Drag Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch { }
    startLoop();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const deltaX = e.clientX - lastXRef.current;
    const deltaTime = Math.max(now - lastTimeRef.current, 1);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const cardSpacing = isMobile ? 260 : 340;
    const offsetDelta = -deltaX / cardSpacing;

    targetOffsetRef.current += offsetDelta;
    currentOffsetRef.current += offsetDelta;
    velocityRef.current = (offsetDelta / deltaTime) * 16; // velocity momentum

    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
    startLoop();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch { }

    // If drag was very small, snap directly to nearest card
    if (Math.abs(velocityRef.current) < 0.05) {
      targetOffsetRef.current = Math.round(targetOffsetRef.current);
    }
    startLoop();
  };

  // Wheel interaction: gentle horizontal scroll with trackpad/mouse
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      targetOffsetRef.current += e.deltaX * 0.0025;
      startLoop();
    }
  };

  return (
    <section
      id="awards"
      className="premium-section py-20 bg-[var(--void)] text-[var(--star-white)] relative overflow-hidden border-b border-[var(--border-main)] select-none"
    >
      {/* ── 3D VIEWPORT & CARD STYLING ── */}
      <style jsx global>{`
        .awards-3d-stage {
          perspective: 1200px;
          perspective-origin: 50% 50%;
          transform-style: preserve-3d;
          mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
        }
        .awards-card-wrapper {
          position: absolute;
          width: 320px;
          height: 420px;
          left: 50%;
          top: 50%;
          margin-left: -160px;
          margin-top: -210px;
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
          cursor: grab;
          -webkit-font-smoothing: antialiased;
        }
        @media (max-width: 768px) {
          .awards-card-wrapper {
            width: 260px;
            height: 360px;
            margin-left: -130px;
            margin-top: -180px;
          }
        }
        .awards-card-wrapper:active {
          cursor: grabbing;
        }
        .awards-card-body {
          width: 100%;
          height: 100%;
          border-radius: 24px;
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.07) 0%, rgba(10, 14, 26, 0.92) 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15);
          overflow: hidden;
          position: relative;
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease;
        }
        .awards-card-wrapper.active-card-center .awards-card-body {
          border-color: rgba(6, 182, 212, 0.55);
          box-shadow: 0 0 50px -10px rgba(6, 182, 212, 0.35), 0 30px 60px -15px rgba(0, 0, 0, 0.95), inset 0 0 20px rgba(255, 255, 255, 0.06);
        }
        .awards-card-wrapper:hover .awards-card-body {
          border-color: rgba(255, 255, 255, 0.35);
        }
        .awards-holo-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 25%, rgba(255, 255, 255, 0.08) 48%, rgba(255, 255, 255, 0.18) 50%, transparent 55%);
          pointer-events: none;
          opacity: 0.5;
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[var(--accent)]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-amber-500/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[92rem] mx-auto space-y-8 px-4 md:px-10 relative z-10">
        {/* ── STREAMLINED CLEAN HEADER ── */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-main)]">
          <div>
            <div className="flex items-center gap-2 mb-2">

            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-[var(--star-white)] leading-tight">
              AWARDS &amp; <span className="text-[var(--accent)]">ACHIEVEMENTS</span>
            </h2>
          </div>

          {/* Clean Navigation Arrows & Drag Hint */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-white/40 hidden sm:inline-block pr-1">
              DRAG TO SLIDE ⇄
            </span>
            <button
              onClick={() => navigateToIndex((activeIndex - 1 + totalCards) % totalCards)}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-transform active:scale-90"
              aria-label="Previous Award"
            >
              ❮
            </button>
            <button
              onClick={() => navigateToIndex((activeIndex + 1) % totalCards)}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-transform active:scale-90"
              aria-label="Next Award"
            >
              ❯
            </button>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* ── SMOOTH DRAG-ONLY 3D SLIDER SHOWCASE ── */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <div className="relative w-full py-4">
          {/* Viewport for 3D Carousel (Drag from left to right to slide) */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="awards-3d-stage relative w-full h-[470px] sm:h-[510px] md:h-[550px] flex items-center justify-center overflow-hidden touch-pan-y"
          >
            {AWARDS.map((award, i) => (
              <div
                key={award.id}
                ref={(el) => {
                  cardNodesRef.current[i] = el;
                }}
                onClick={() => navigateToIndex(i)}
                className="awards-card-wrapper"
              >
                <div className="awards-card-body flex flex-col justify-between p-6 sm:p-7">
                  <div className="awards-holo-sheen" />

                  {/* Card Top: Year & Category */}
                  <div className="flex items-center justify-between z-10">
                    <span
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-black tracking-wider uppercase border shadow-lg backdrop-blur-md transition-all"
                      style={{
                        backgroundColor: award.accent ? `${award.accent}25` : 'rgba(56, 189, 248, 0.2)',
                        borderColor: award.accent ? `${award.accent}70` : 'rgba(56, 189, 248, 0.6)',
                        color: award.accent || 'var(--accent)',
                        boxShadow: `0 0 16px -2px ${award.accent ? `${award.accent}60` : 'var(--accent-glow)'}`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full animate-pulse shadow-sm shrink-0"
                        style={{
                          backgroundColor: award.accent || 'var(--accent)',
                          boxShadow: `0 0 8px ${award.accent || 'var(--accent)'}`,
                        }}
                      />
                      <span>{award.year}</span>
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase font-bold px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10">
                      {award.category.split(' ')[0]}
                    </span>
                  </div>

                  {/* Card Middle: Imperial Laurel Crest & Typography */}
                  <div className="my-auto space-y-3 z-10">
                    {/* Imperial Laurel Wreath & Starburst Crest Medal */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/25 via-[var(--accent)]/20 to-yellow-300/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {/* Laurel Wreath */}
                        <path d="M7 19c-2-1.5-3-4-3-7 0-4 2-7 4-8" />
                        <path d="M5 8c1 .5 2 1.5 2 3" />
                        <path d="M4 13c1 .5 2 1.5 2 3" />
                        <path d="M17 19c2-1.5 3-4 3-7 0-4-2-7-4-8" />
                        <path d="M19 8c-1 .5-2 1.5-2 3" />
                        <path d="M20 13c-1 .5-2 1.5-2 3" />
                        {/* Central Starburst Medal */}
                        <polygon points="12 4 14.5 9 20 9.5 16 13.5 17.5 19 12 16 6.5 19 8 13.5 4 9.5 9.5 9" fill="currentColor" stroke="none" opacity="0.9" />
                        <circle cx="12" cy="12" r="1.8" fill="#ffffff" />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-black uppercase font-display tracking-tight text-white leading-tight line-clamp-2">
                        {award.title}
                      </h3>
                      <p className="text-xs font-mono text-[var(--accent)] font-semibold mt-1 truncate">
                        {award.issuer}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed line-clamp-3">
                      {award.description}
                    </p>
                  </div>

                  {/* Card Bottom: IEEE Distinction Badge */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50 z-10">
                    <span className="text-[var(--accent)] font-bold">◆ IEEE HONOUR</span>
                    <span>NISB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Slider Nav Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-3 flex-wrap max-w-xl mx-auto">
            {AWARDS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => navigateToIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx
                  ? 'w-7 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

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

              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

