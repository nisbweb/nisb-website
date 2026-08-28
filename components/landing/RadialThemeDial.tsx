'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ThemeColorItem {
  id: 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'clay' | 'obsidian';
  name: string;
  note: string; // Musical note like piano keys
  hex: string;
  glow: string;
}

export const PIANO_THEMES: ThemeColorItem[] = [
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    note: 'C4',
    hex: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.65)',
  },
  {
    id: 'blue',
    name: 'Electric Sky',
    note: 'D4',
    hex: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.65)',
  },
  {
    id: 'emerald',
    name: 'Emerald Bio',
    note: 'E4',
    hex: '#10b981',
    glow: 'rgba(16, 185, 129, 0.65)',
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    note: 'F4',
    hex: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.65)',
  },
  {
    id: 'rose',
    name: 'Neon Rose',
    note: 'G4',
    hex: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.65)',
  },
  {
    id: 'violet',
    name: 'Cosmic Violet',
    note: 'A4',
    hex: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.65)',
  },
  {
    id: 'clay',
    name: 'Warm Clay',
    note: 'B4',
    hex: '#84937e',
    glow: 'rgba(132, 147, 126, 0.65)',
  },
  {
    id: 'obsidian',
    name: 'Titanium Stealth',
    note: 'C5',
    hex: '#94a3b8',
    glow: 'rgba(148, 163, 184, 0.65)',
  },
];

// Helper to generate mathematical SVG annular wedge (curved piano key) for rightward fan
function getAnnularWedgePath(
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  startAngleDeg: number,
  endAngleDeg: number
): string {
  const startRad = (startAngleDeg * Math.PI) / 180;
  const endRad = (endAngleDeg * Math.PI) / 180;

  const xIn1 = cx + rIn * Math.cos(startRad);
  const yIn1 = cy + rIn * Math.sin(startRad);

  const xOut1 = cx + rOut * Math.cos(startRad);
  const yOut1 = cy + rOut * Math.sin(startRad);

  const xOut2 = cx + rOut * Math.cos(endRad);
  const yOut2 = cy + rOut * Math.sin(endRad);

  const xIn2 = cx + rIn * Math.cos(endRad);
  const yIn2 = cy + rIn * Math.sin(endRad);

  const largeArcFlag = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return `
    M ${xIn1} ${yIn1}
    L ${xOut1} ${yOut1}
    A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${xOut2} ${yOut2}
    L ${xIn2} ${yIn2}
    A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${xIn1} ${yIn1}
    Z
  `;
}

// Helper to generate downward SVG annular wedge (curved piano key opening downwards from navbar)
function getDownwardWedgePath(
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  startDeg: number,
  endDeg: number
): string {
  const rad1 = (startDeg * Math.PI) / 180;
  const rad2 = (endDeg * Math.PI) / 180;

  const xIn1 = cx + rIn * Math.cos(rad1);
  const yIn1 = cy + rIn * Math.sin(rad1);
  const xOut1 = cx + rOut * Math.cos(rad1);
  const yOut1 = cy + rOut * Math.sin(rad1);

  const xOut2 = cx + rOut * Math.cos(rad2);
  const yOut2 = cy + rOut * Math.sin(rad2);
  const xIn2 = cx + rIn * Math.cos(rad2);
  const yIn2 = cy + rIn * Math.sin(rad2);

  const sweep = startDeg < endDeg ? 1 : 0;
  const sweepBack = sweep === 1 ? 0 : 1;

  return `
    M ${xIn1} ${yIn1}
    L ${xOut1} ${yOut1}
    A ${rOut} ${rOut} 0 0 ${sweep} ${xOut2} ${yOut2}
    L ${xIn2} ${yIn2}
    A ${rIn} ${rIn} 0 0 ${sweepBack} ${xIn1} ${yIn1}
    Z
  `;
}

// ── 1. MOBILE NAVBAR THEME DIAL (OPENS FROM LEFT EDGE, FANS RIGHTWARD) ──
export function MobileNavbarThemeDial() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // Default: C4 (cyan)
  const [hoveredKeyIndex, setHoveredKeyIndex] = useState<number | null>(null);

  const applyTheme = useCallback((themeId: ThemeColorItem['id']) => {
    document.documentElement.setAttribute('data-theme', themeId);
    try { localStorage.setItem('nisb_theme', themeId); } catch (e) { }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nisb:themeChange', { detail: { theme: themeId } }));
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nisb_theme') as ThemeColorItem['id'] | null;
      if (saved) {
        const found = PIANO_THEMES.findIndex((t) => t.id === saved);
        if (found !== -1) { setActiveIndex(found); applyTheme(saved); return; }
      }
    } catch (e) { }
    setActiveIndex(0);
    applyTheme('cyan');
  }, [applyTheme]);

  // Sync with global theme changes (desktop dial also fires this)
  useEffect(() => {
    const handler = (e: any) => {
      const themeId = e.detail?.theme;
      if (themeId) {
        const found = PIANO_THEMES.findIndex((t) => t.id === themeId);
        if (found !== -1) setActiveIndex(found);
      }
    };
    window.addEventListener('nisb:themeChange', handler);
    return () => window.removeEventListener('nisb:themeChange', handler);
  }, []);

  const selectTheme = (index: number) => {
    setActiveIndex(index);
    applyTheme(PIANO_THEMES[index].id);
    setIsOpen(false);
  };

  const currentTheme = PIANO_THEMES[activeIndex] || PIANO_THEMES[0];
  const displayedTheme = hoveredKeyIndex !== null ? PIANO_THEMES[hoveredKeyIndex] : currentTheme;

  // Left-side rightward fan geometry (same math as desktop)
  // CX=8 puts the pivot at left edge; CY=200 centres the fan vertically in the SVG
  const CX = 8;
  const CY = 200;
  const INNER_R = 62;
  const DEFAULT_OUTER_R = 155;
  const ACTIVE_OUTER_R = 172;
  // 152° arc opening rightward (-76° to +76°)
  const START_ANGLE = -76;
  const TOTAL_SWEEP = 152;
  const STEP_ANGLE = TOTAL_SWEEP / PIANO_THEMES.length;
  const KEY_GAP = 1.8;

  return (
    <>
      {/* ── MOBILE NAVBAR TRIGGER BUTTON (CENTER OF NAVBAR) ── */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen((v) => !v); }}
        aria-label="Select Color Theme"
        className="relative rounded-lg bg-[#030810]/90 border backdrop-blur-xl flex items-center overflow-hidden transition-all duration-300 active:scale-95 cursor-pointer"
        style={{
          boxShadow: `0 0 18px -4px ${currentTheme.glow}`,
          borderColor: currentTheme.hex,
        }}
      >
        {/* Left accent bar */}
        <div className="h-full w-[2.5px] shrink-0" style={{ background: `linear-gradient(180deg, transparent, ${currentTheme.hex}, transparent)` }} />

        {/* Inner content */}
        <div className="flex items-center gap-1.5 py-1 px-2">
          {/* Animated equalizer bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-3">
            {[0.4, 1.0, 0.6, 0.85].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: ['20%', '100%', '35%'] }}
                transition={{ duration: 1.1 + i * 0.18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="flex-1 rounded-full"
                style={{ backgroundColor: currentTheme.hex }}
              />
            ))}
          </div>
          {/* CHANGE THEME label */}
          <span
            className="text-[7.5px] font-black uppercase tracking-[0.14em] leading-none select-none whitespace-nowrap"
            style={{ color: currentTheme.hex }}
          >
            CHANGE THEME
          </span>
        </div>

        {/* Right accent bar */}
        <div className="h-full w-[2.5px] shrink-0" style={{ background: `linear-gradient(180deg, transparent, ${currentTheme.hex}, transparent)` }} />
      </button>


      {/* ── LEFT-SIDE RIGHTWARD PIANO FAN (FIXED, FULLY VISIBLE) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-[2px]"
              onClick={() => { setIsOpen(false); setHoveredKeyIndex(null); }}
            />

            {/* Left-edge rightward fan — anchored at left:0, vertically centered */}
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.88 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.9 }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              className="fixed left-0 top-1/2 -translate-y-1/2 z-[1001] bg-transparent pointer-events-auto"
              style={{ padding: '24px 20px 24px 0' }}
            >
              <svg
                viewBox="0 0 185 400"
                className="w-[185px] h-[400px] overflow-visible drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
              >
                <defs>
                  <filter id="mPianoGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* ── 8 RIGHTWARD PIANO KEYS ── */}
                {PIANO_THEMES.map((theme, i) => {
                  const isSelected = activeIndex === i;
                  const isHov = hoveredKeyIndex === i;

                  const kStart = START_ANGLE + i * STEP_ANGLE + KEY_GAP / 2;
                  const kEnd = START_ANGLE + (i + 1) * STEP_ANGLE - KEY_GAP / 2;
                  const outerR = isSelected || isHov ? ACTIVE_OUTER_R : DEFAULT_OUTER_R;

                  const wedgePath = getAnnularWedgePath(CX, CY, INNER_R, outerR, kStart, kEnd);

                  const midAngle = (kStart + kEnd) / 2;
                  const midRad = (midAngle * Math.PI) / 180;
                  const labelX = CX + (outerR - 24) * Math.cos(midRad);
                  const labelY = CY + (outerR - 24) * Math.sin(midRad);

                  return (
                    <g
                      key={theme.id}
                      onClick={() => selectTheme(i)}
                      onMouseEnter={() => setHoveredKeyIndex(i)}
                      onMouseLeave={() => setHoveredKeyIndex(null)}
                      className="cursor-pointer"
                    >
                      {/* Key body */}
                      <path
                        d={wedgePath}
                        fill={isSelected ? theme.hex : isHov ? '#152033' : '#080e1a'}
                        stroke={isSelected ? '#ffffff' : isHov ? theme.hex : 'rgba(255,255,255,0.25)'}
                        strokeWidth={isSelected ? '2.5' : isHov ? '2' : '1.2'}
                        filter={isSelected || isHov ? 'url(#mPianoGlow)' : undefined}
                        className="transition-all duration-200"
                      />
                      {/* Bevel highlight */}
                      <path
                        d={getAnnularWedgePath(CX, CY, outerR - 9, outerR, kStart, kEnd)}
                        fill={isSelected ? '#ffffff' : theme.hex}
                        opacity={isSelected ? 0.95 : isHov ? 0.95 : 0.72}
                        className="transition-opacity duration-200"
                      />
                      {/* Note label */}
                      <text
                        x={labelX} y={labelY + 4}
                        textAnchor="middle"
                        fill={isSelected ? '#000000' : '#ffffff'}
                        fontSize="10" fontWeight="900" fontFamily="monospace"
                        className="pointer-events-none select-none"
                      >{theme.note}</text>
                    </g>
                  );
                })}

                {/* ── CENTRAL HUB ── */}
                <g className="pointer-events-none">
                  <circle cx={CX} cy={CY} r={INNER_R - 5} fill="#070c18" stroke={displayedTheme.hex} strokeWidth="2.5" filter="url(#mPianoGlow)" />
                  <circle cx={CX} cy={CY} r={INNER_R - 14} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle cx={CX} cy={CY} r={21} fill={displayedTheme.hex} style={{ transition: 'fill 0.25s ease' }} />
                  <path
                    d={`M ${CX - 9} ${CY} Q ${CX - 4.5} ${CY - 6}, ${CX} ${CY} T ${CX + 9} ${CY}`}
                    fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"
                  />
                </g>
              </svg>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


// ── 2. DESKTOP MIDDLE-LEFT SEMICIRCULAR PIANO DIAL (OPENING RIGHTWARD ON HOVER) ──
export default function RadialThemeDial() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // Default: C4 (Cyber Cyan #06b6d4)
  const [hoveredKeyIndex, setHoveredKeyIndex] = useState<number | null>(null);
  const [rippleColor, setRippleColor] = useState<string | null>(null);

  // Anti-flicker debounced collapse
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Smooth grace delay ensures seamless collapse without jitter
    collapseTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
      setHoveredKeyIndex(null);
    }, 200);
  };

  const applyTheme = useCallback((themeId: ThemeColorItem['id']) => {
    document.documentElement.setAttribute('data-theme', themeId);
    try {
      localStorage.setItem('nisb_theme', themeId);
    } catch (e) { }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nisb:themeChange', { detail: { theme: themeId } }));
    }
  }, []);

  // Initialize theme: default to C4 (cyan)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nisb_theme') as ThemeColorItem['id'] | null;
      if (saved) {
        const found = PIANO_THEMES.findIndex((t) => t.id === saved);
        if (found !== -1) {
          setActiveIndex(found);
          applyTheme(saved);
          return;
        }
      }
    } catch (e) { }

    // Default to C4 (Cyber Cyan)
    setActiveIndex(0);
    applyTheme('cyan');
  }, [applyTheme]);

  // Sync with global theme changes
  useEffect(() => {
    const handler = (e: any) => {
      const themeId = e.detail?.theme;
      if (themeId) {
        const found = PIANO_THEMES.findIndex((t) => t.id === themeId);
        if (found !== -1) setActiveIndex(found);
      }
    };
    window.addEventListener('nisb:themeChange', handler);
    return () => window.removeEventListener('nisb:themeChange', handler);
  }, []);

  const selectTheme = (index: number) => {
    setActiveIndex(index);
    const selected = PIANO_THEMES[index];
    applyTheme(selected.id);

    // Shockwave ripple animation
    setRippleColor(selected.hex);
    setTimeout(() => setRippleColor(null), 800);
  };

  const currentTheme = PIANO_THEMES[activeIndex] || PIANO_THEMES[0];
  const displayedTheme = hoveredKeyIndex !== null ? PIANO_THEMES[hoveredKeyIndex] : currentTheme;

  // Desktop Semicircular Piano Geometry Math
  const CX = 14;
  const CY = 175;
  const INNER_R = 68;
  const DEFAULT_OUTER_R = 168;
  const ACTIVE_OUTER_R = 186;

  const START_ANGLE = -76;
  const TOTAL_SWEEP = 152;
  const STEP_ANGLE = TOTAL_SWEEP / PIANO_THEMES.length;
  const KEY_GAP = 1.8;

  return (
    <>
      {/* ── VISUAL CHROMATIC SHOCKWAVE RIPPLE ── */}
      <AnimatePresence>
        {rippleColor && (
          <motion.div
            initial={{ scale: 0, opacity: 0.75 }}
            animate={{ scale: 40, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-0 z-[980] w-12 h-12 rounded-full pointer-events-none -translate-y-1/2"
            style={{
              background: `radial-gradient(circle, ${rippleColor} 0%, transparent 70%)`,
              boxShadow: `0 0 60px ${rippleColor}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── UNIFIED HOVER BOUNDING WRAPPER (HIDDEN ON MOBILE, VISIBLE ON LG+) ── */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="desktop-radial-dial hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-[999] select-none items-center"
        style={{
          padding: '30px 40px 30px 0px',
        }}
      >
        <AnimatePresence mode="wait">
          {/* 1 ── COMPACT COLLAPSED TAB ICON ── */}
          {!isExpanded ? (
            <motion.div
              key="collapsed-icon"
              initial={{ x: -18, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -14, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative cursor-pointer rounded-r-2xl bg-[#030810]/90 border-y border-r backdrop-blur-xl flex flex-col items-center overflow-hidden transition-all duration-300"
              style={{
                boxShadow: `0 0 28px -4px ${currentTheme.glow}, 0 12px 40px rgba(0,0,0,0.9)`,
                borderColor: currentTheme.hex,
              }}
            >
              {/* Top accent bar — active theme colour */}
              <div
                className="w-full h-[3px] shrink-0"
                style={{ background: `linear-gradient(90deg, transparent, ${currentTheme.hex}, transparent)` }}
              />

              {/* Inner content — vertical layout */}
              <div className="flex flex-col items-center gap-2 py-3 px-2.5">

                {/* Animated equalizer bars */}
                <div className="flex items-end gap-0.5 h-4 w-4">
                  {[0.4, 1.0, 0.6, 0.85].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '35%'] }}
                      transition={{
                        duration: 1.1 + i * 0.18,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      }}
                      className="flex-1 rounded-full"
                      style={{ backgroundColor: currentTheme.hex }}
                    />
                  ))}
                </div>

                {/* Vertical "CHANGE THEME" label */}
                <span
                  className="text-[8px] font-black uppercase tracking-[0.18em] [writing-mode:vertical-lr] rotate-180 leading-none select-none"
                  style={{ color: currentTheme.hex }}
                >
                  CHANGE THEME
                </span>

                {/* Colour spectrum swatch stack — one dot per theme */}
                <div className="flex flex-col items-center gap-[3px]">
                  {PIANO_THEMES.map((t, i) => (
                    <div
                      key={t.id}
                      className="rounded-full transition-all duration-200"
                      style={{
                        width: activeIndex === i ? '8px' : '5px',
                        height: activeIndex === i ? '8px' : '5px',
                        backgroundColor: t.hex,
                        boxShadow: activeIndex === i ? `0 0 8px ${t.hex}` : 'none',
                        opacity: activeIndex === i ? 1 : 0.45,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom accent bar */}
              <div
                className="w-full h-[3px] shrink-0"
                style={{ background: `linear-gradient(90deg, transparent, ${currentTheme.hex}, transparent)` }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="expanded-piano"
              initial={{ opacity: 0, scale: 0.85, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.88, x: -18 }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              className="relative bg-transparent flex items-center justify-start overflow-visible pointer-events-auto"
            >
              <svg
                viewBox="0 0 215 350"
                className="w-[215px] h-[350px] overflow-visible drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
              >
                <defs>
                  <filter id="pianoGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* ── 8 SEMICIRCULAR PIANO KEYS (ANNULAR WEDGES) ── */}
                {PIANO_THEMES.map((theme, i) => {
                  const isSelected = activeIndex === i;
                  const isHovered = hoveredKeyIndex === i;

                  const kStart = START_ANGLE + i * STEP_ANGLE + KEY_GAP / 2;
                  const kEnd = START_ANGLE + (i + 1) * STEP_ANGLE - KEY_GAP / 2;
                  const outerRadius = isHovered || isSelected ? ACTIVE_OUTER_R : DEFAULT_OUTER_R;

                  const wedgePath = getAnnularWedgePath(CX, CY, INNER_R, outerRadius, kStart, kEnd);

                  const midAngle = (kStart + kEnd) / 2;
                  const midRad = (midAngle * Math.PI) / 180;
                  const labelX = CX + (outerRadius - 26) * Math.cos(midRad);
                  const labelY = CY + (outerRadius - 26) * Math.sin(midRad);

                  return (
                    <g
                      key={theme.id}
                      onClick={() => selectTheme(i)}
                      onMouseEnter={() => setHoveredKeyIndex(i)}
                      className="cursor-pointer group/key"
                    >
                      {/* Piano Key Body */}
                      <path
                        d={wedgePath}
                        fill={isSelected ? theme.hex : isHovered ? '#152033' : '#080e1a'}
                        stroke={isSelected ? '#ffffff' : isHovered ? theme.hex : 'rgba(255, 255, 255, 0.25)'}
                        strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1.2'}
                        filter={isSelected || isHovered ? 'url(#pianoGlow)' : undefined}
                        className="transition-all duration-200"
                      />

                      {/* Top Bevel Highlight Stripe on Piano Key */}
                      <path
                        d={getAnnularWedgePath(CX, CY, outerRadius - 9, outerRadius, kStart, kEnd)}
                        fill={isSelected ? '#ffffff' : theme.hex}
                        opacity={isSelected ? 0.95 : isHovered ? 0.95 : 0.75}
                        className="transition-opacity duration-200"
                      />

                      {/* Musical Note Label on Piano Key (e.g. C4, D4, E4...) */}
                      <text
                        x={labelX}
                        y={labelY + 4}
                        textAnchor="middle"
                        fill={isSelected ? '#000000' : '#ffffff'}
                        fontSize="10"
                        fontWeight="900"
                        fontFamily="monospace"
                        className="pointer-events-none select-none"
                      >
                        {theme.note}
                      </text>
                    </g>
                  );
                })}

                {/* ── CENTRAL CYBER PIANO HUB ── */}
                <g className="pointer-events-none">
                  <circle
                    cx={CX}
                    cy={CY}
                    r={INNER_R - 5}
                    fill="#070c18"
                    stroke={displayedTheme.hex}
                    strokeWidth="2.5"
                    filter="url(#pianoGlow)"
                  />
                  <circle
                    cx={CX}
                    cy={CY}
                    r={INNER_R - 14}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  <circle
                    cx={CX}
                    cy={CY}
                    r={22}
                    fill={displayedTheme.hex}
                    style={{
                      boxShadow: `0 0 20px ${displayedTheme.hex}`,
                      transition: 'fill 0.25s ease',
                    }}
                  />

                  <path
                    d={`M ${CX - 9} ${CY} Q ${CX - 4.5} ${CY - 6}, ${CX} ${CY} T ${CX + 9} ${CY}`}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
