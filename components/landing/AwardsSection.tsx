'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const mirrorNodesRef = useRef<(HTMLDivElement | null)[]>([]);

  // 3D Physics State stored in refs for 120fps GPU execution
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const cylinderRadiusRef = useRef(720);
  const isAutoSpinningRef = useRef(true);
  const activeIndexRef = useRef(0);
  const tiltXRef = useRef(0);
  const tiltYRef = useRef(0);
  const targetTiltXRef = useRef(0);
  const targetTiltYRef = useRef(0);

  const filteredAwards = useMemo(() => {
    if (activeTab === 'all') return AWARDS;
    return AWARDS.filter((a) => a.type === activeTab);
  }, [activeTab]);

  const totalCards = filteredAwards.length;
  const angleStep = 360 / Math.max(1, totalCards);

  // Sync auto-spin state ref
  useEffect(() => {
    isAutoSpinningRef.current = isAutoSpinning;
  }, [isAutoSpinning]);

  // Responsive Cylinder Radius calculation
  useEffect(() => {
    const updateRadius = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w < 640) {
        cylinderRadiusRef.current = 420;
      } else if (w < 1024) {
        cylinderRadiusRef.current = 580;
      } else {
        cylinderRadiusRef.current = 760;
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Helper: Normalize Angle to [-180, 180]
  const normalizeAngle = useCallback((angle: number) => {
    let a = angle % 360;
    if (a > 180) a -= 360;
    if (a < -180) a += 360;
    return a;
  }, []);

  // Render 3D Cylindrical Ring Transforms on DOM elements
  const render3DCards = useCallback(() => {
    const radius = cylinderRadiusRef.current;
    const currentAngle = currentAngleRef.current;
    let closestDist = Infinity;
    let newActiveIndex = 0;

    cardNodesRef.current.forEach((card, i) => {
      if (!card) return;

      const baseAngle = i * angleStep;
      const cardAngle = baseAngle + currentAngle;
      const normAngle = normalizeAngle(cardAngle);
      const absAngle = Math.abs(normAngle);

      if (absAngle < closestDist) {
        closestDist = absAngle;
        newActiveIndex = i;
      }

      // 3D Cylinder trigonometry
      const rad = (cardAngle * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const z = Math.cos(rad) * radius;

      // Depth calculations
      const normalizedDepth = (z + radius) / (radius * 2); // 0 (far) to 1 (near)
      const scale = 0.76 + normalizedDepth * 0.32;
      const opacity = Math.max(0.18, 0.2 + Math.pow(normalizedDepth, 1.8) * 0.8);
      const blur = Math.max(0, (1 - normalizedDepth) * 5.5);
      const zIndex = Math.round(normalizedDepth * 1000);

      // Apply 3D transform to main card
      card.style.transform = `translate3d(${x.toFixed(2)}px, 0px, ${z.toFixed(2)}px) rotateY(${cardAngle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(2);
      card.style.filter = `blur(${blur.toFixed(1)}px)`;
      card.style.zIndex = `${zIndex}`;

      // Mirror reflection ground projection
      const mirror = mirrorNodesRef.current[i];
      if (mirror) {
        mirror.style.transform = `translate3d(${x.toFixed(2)}px, 0px, ${z.toFixed(2)}px) rotateY(${cardAngle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        mirror.style.opacity = (opacity * 0.22).toFixed(2);
      }

      // Center card spotlight glow class
      if (absAngle < 16) {
        card.classList.add('active-center-card');
      } else {
        card.classList.remove('active-center-card');
      }
    });

    if (newActiveIndex !== activeIndexRef.current) {
      activeIndexRef.current = newActiveIndex;
      setActiveIndex(newActiveIndex);
    }
  }, [angleStep, normalizeAngle]);

  // Main 3D Animation & Physics Loop (Runs smoothly on GPU)
  useEffect(() => {
    if (viewMode !== 'orbit' || totalCards === 0) return;

    let animId: number;

    const animateLoop = () => {
      // 1. Auto-Orbit Drift
      if (isAutoSpinningRef.current && !isDraggingRef.current) {
        targetAngleRef.current -= 0.14;
      }

      // 2. Inertia Friction Deceleration
      if (!isDraggingRef.current && Math.abs(velocityRef.current) > 0.001) {
        targetAngleRef.current += velocityRef.current * 3.2;
        velocityRef.current *= 0.92;
      }

      // 3. Smooth Lerp to Target Angle
      currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * 0.085;

      // 4. Parallax Stage Tilt Lerp
      tiltXRef.current += (targetTiltXRef.current - tiltXRef.current) * 0.06;
      tiltYRef.current += (targetTiltYRef.current - tiltYRef.current) * 0.06;

      if (stageRef.current) {
        stageRef.current.style.transform = `translate(-50%, -50%) rotateX(${tiltXRef.current.toFixed(2)}deg) rotateY(${tiltYRef.current.toFixed(2)}deg)`;
      }

      // 5. Render All 3D Cards
      render3DCards();

      animId = requestAnimationFrame(animateLoop);
    };

    animId = requestAnimationFrame(animateLoop);
    return () => cancelAnimationFrame(animId);
  }, [viewMode, totalCards, render3DCards]);

  // Rotate to exact index with shortest angular path
  const rotateToIndex = useCallback(
    (targetIndex: number) => {
      setIsAutoSpinning(false);
      isAutoSpinningRef.current = false;

      const currentNorm = normalizeAngle(targetAngleRef.current);
      let diff = -targetIndex * angleStep - currentNorm;

      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      targetAngleRef.current += diff;
    },
    [angleStep, normalizeAngle]
  );

  // Snap gently to nearest slot
  const snapToNearest = useCallback(() => {
    const currentNorm = normalizeAngle(targetAngleRef.current);
    const nearestIndex = Math.round(-currentNorm / angleStep);
    const snapTarget = -nearestIndex * angleStep;

    let diff = snapTarget - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    targetAngleRef.current += diff;
  }, [angleStep, normalizeAngle]);

  // Pointer & Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = startXRef.current;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsAutoSpinning(false);
    isAutoSpinningRef.current = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Parallax Stage Tilt
    if (typeof window !== 'undefined') {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetTiltXRef.current = -normY * 10;
      targetTiltYRef.current = normX * 14;
    }

    if (!isDraggingRef.current) return;

    const now = performance.now();
    const deltaX = e.clientX - lastXRef.current;
    const deltaTime = Math.max(now - lastTimeRef.current, 1);

    const sens = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.32 : 0.2;
    targetAngleRef.current += deltaX * sens;
    velocityRef.current = (deltaX / deltaTime) * 1.6;

    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}

    if (Math.abs(velocityRef.current) < 0.25) {
      snapToNearest();
    }
  };

  // Wheel interaction
  const handleWheel = (e: React.WheelEvent) => {
    setIsAutoSpinning(false);
    isAutoSpinningRef.current = false;
    const delta = Math.sign(e.deltaY) * -1;
    targetAngleRef.current += delta * 12;
    velocityRef.current = delta * 0.35;
  };

  const handleCategoryChange = (val: any) => {
    setActiveTab(val);
    currentAngleRef.current = 0;
    targetAngleRef.current = 0;
    velocityRef.current = 0;
    activeIndexRef.current = 0;
    setActiveIndex(0);
  };

  return (
    <section
      id="awards"
      className="premium-section py-20 bg-[#050508] text-[var(--star-white)] relative overflow-hidden border-b border-[var(--border-main)] select-none"
    >
      {/* ── CSS STYLES FOR TRUE 3D CYLINDER STAGE ── */}
      <style jsx global>{`
        .aether-viewport {
          perspective: 1400px;
          perspective-origin: 50% 48%;
          transform-style: preserve-3d;
        }
        .aether-stage {
          transform-style: preserve-3d;
          will-change: transform;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .aether-ring {
          transform-style: preserve-3d;
          position: relative;
          width: 0;
          height: 0;
        }
        .aether-card {
          position: absolute;
          width: 310px;
          height: 420px;
          left: -155px;
          top: -210px;
          transform-style: preserve-3d;
          will-change: transform, filter, opacity;
          cursor: grab;
        }
        @media (max-width: 768px) {
          .aether-card {
            width: 250px;
            height: 360px;
            left: -125px;
            top: -180px;
          }
        }
        .aether-card:active {
          cursor: grabbing;
        }
        .aether-card-inner {
          width: 100%;
          height: 100%;
          border-radius: 24px;
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.07) 0%, rgba(10, 14, 26, 0.9) 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2);
          overflow: hidden;
          position: relative;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .aether-card.active-center-card .aether-card-inner {
          border-color: rgba(255, 255, 255, 0.45);
          box-shadow: 0 0 60px -10px var(--accent-glow, rgba(6, 182, 212, 0.45)), 0 30px 60px -15px rgba(0, 0, 0, 0.95), inset 0 0 30px rgba(255, 255, 255, 0.08);
        }
        .aether-holo-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.12) 45%, rgba(255, 255, 255, 0.25) 50%, transparent 55%);
          pointer-events: none;
          opacity: 0.35;
          mix-blend-mode: overlay;
        }
        .aether-card:hover .aether-holo-sheen {
          opacity: 0.85;
        }
        .aether-floor-grid {
          position: absolute;
          top: 62%;
          left: 50%;
          transform: translate(-50%, 0) rotateX(90deg);
          width: 2200px;
          height: 2200px;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 0%, rgba(5, 5, 8, 0.95) 70%, #050507 100%);
          pointer-events: none;
          mask-image: radial-gradient(circle at center, black 25%, transparent 75%);
          -webkit-mask-image: radial-gradient(circle at center, black 25%, transparent 75%);
        }
        .aether-mirror-stage {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scaleY(-1) translateY(-60px);
          transform-style: preserve-3d;
          opacity: 0.22;
          filter: blur(4px);
          pointer-events: none;
          mask-image: linear-gradient(to bottom, black 0%, transparent 65%);
          -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 65%);
        }
      `}</style>

      {/* Ambient Sci-Fi Glows */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-[var(--accent)]/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

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
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                  viewMode === 'orbit'
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
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                  viewMode === 'grid'
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
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                activeTab === cat.value
                  ? 'bg-[var(--accent)] text-[var(--void)] shadow-lg scale-105 font-extrabold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* ── MODE 1: 3D CYLINDRICAL ORBIT SHOWPIECE SLIDER ── */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {viewMode === 'orbit' && (
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] via-black/80 to-[#05050a] p-4 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
            {/* Top Orbit Telemetry Controls */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-[var(--accent)] font-bold">
                  ORBIT {activeIndex + 1} / {totalCards}
                </span>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="text-white/60 hidden sm:inline">
                  Drag 360° to rotate • Wheel to scrub
                </span>
              </div>

              {/* Orbit Controls (Play/Pause & Arrow Navigation) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                  className={`px-3 py-1 rounded-full border text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
                    isAutoSpinning
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : 'border-white/20 text-white/70 bg-white/5'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isAutoSpinning ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`} />
                  <span>{isAutoSpinning ? 'ORBITING' : 'MANUAL'}</span>
                </button>

                <button
                  onClick={() => rotateToIndex((activeIndex - 1 + totalCards) % totalCards)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-90"
                  aria-label="Previous Award"
                >
                  ❮
                </button>
                <button
                  onClick={() => rotateToIndex((activeIndex + 1) % totalCards)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-90"
                  aria-label="Next Award"
                >
                  ❯
                </button>
              </div>
            </div>

            {/* 3D Viewport & Stage */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
              className="aether-viewport relative w-full h-[480px] sm:h-[520px] md:h-[560px] flex items-center justify-center overflow-hidden touch-pan-y"
            >
              {/* 3D Floor Reflection Grid */}
              <div className="aether-floor-grid" />

              {/* Primary 3D Stage */}
              <div ref={stageRef} className="aether-stage">
                {/* Main 3D Cylinder Ring */}
                <div className="aether-ring">
                  {filteredAwards.map((award, i) => (
                    <div
                      key={award.id}
                      ref={(el) => {
                        cardNodesRef.current[i] = el;
                      }}
                      onClick={() => rotateToIndex(i)}
                      className="aether-card"
                    >
                      {/* ONLY CLEAN CARD CONTENT - NO EXTRA BUTTONS */}
                      <div className="aether-card-inner flex flex-col justify-between p-6 sm:p-7">
                        {/* Holographic Sheen Line */}
                        <div className="aether-holo-sheen" />

                        {/* Top Header: Year & Category Badge */}
                        <div className="flex items-center justify-between z-10">
                          <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] sm:text-xs font-mono font-black tracking-wider text-[var(--accent)] uppercase border border-white/10">
                            {award.year}
                          </span>
                          <span className="text-[9px] font-mono tracking-widest text-white/70 uppercase font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                            {award.category.split(' ')[0]}
                          </span>
                        </div>

                        {/* Middle: Award Trophy Laurel & Typography */}
                        <div className="my-auto space-y-3 z-10">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--accent)]/30 to-amber-400/20 border border-[var(--accent)]/50 text-amber-300 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>

                          <div>
                            <h3 className="text-xl sm:text-2xl font-black uppercase font-display tracking-tight text-white leading-tight line-clamp-2">
                              {award.title}
                            </h3>
                            <p className="text-xs font-mono text-[var(--accent)] font-semibold mt-1">
                              {award.issuer}
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed line-clamp-3">
                            {award.description}
                          </p>
                        </div>

                        {/* Bottom Telemetry Footer */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50 z-10">
                          <span className="text-[var(--accent)] font-bold">★ IEEE DISTINCTION</span>
                          <span>NISB MYSURU</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mirror Ring for specular floor reflection */}
                <div className="aether-mirror-stage">
                  {filteredAwards.map((award, i) => (
                    <div
                      key={`mirror-${award.id}`}
                      ref={(el) => {
                        mirrorNodesRef.current[i] = el;
                      }}
                      className="aether-card pointer-events-none"
                    >
                      <div className="aether-card-inner flex flex-col justify-between p-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-white">{award.year}</span>
                        </div>
                        <h4 className="text-xl font-bold uppercase font-display text-white">{award.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Slider Nav Indicators */}
            <div className="flex items-center justify-center gap-1.5 pt-4 flex-wrap max-w-xl mx-auto">
              {filteredAwards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => rotateToIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx
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
                className={`p-7 rounded-3xl border transition-all duration-500 flex flex-col justify-between gap-6 group relative overflow-hidden ${
                  award.highlight
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
