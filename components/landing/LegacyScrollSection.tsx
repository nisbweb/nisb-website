'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/* ─── The Solar Obsidian Background ─── */
function SolarBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020202] overflow-hidden pointer-events-none">
      {/* Mobile-light static gradient */}
      <div className="md:hidden absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.06),transparent_60%)]" />

      {/* Desktop Harsh, focused spotlight */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="hidden md:block absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[var(--accent)]/[0.04] blur-[150px]"
      />

      {/* Bottom organic shape */}
      <div className="hidden md:block absolute -bottom-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#ffffff]/[0.02] blur-[120px]" />

      {/* Film Grain (desktop only to prevent mobile compositor blend thrashing) */}
      <div className="hidden md:block absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}

function Word({ word, i, total, progress, isMobile }: { word: string; i: number; total: number; progress: any; isMobile: boolean }) {
  const start = 0.05 + (i / total) * 0.7;
  const end = start + 0.1;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const y = useTransform(progress, [start, end], [16, 0]);

  return (
    <motion.span
      style={{ opacity: isMobile ? 1 : opacity, y: isMobile ? 0 : y }}
      className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
    >
      {word}
    </motion.span>
  );
}

export default function SolarLegacySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 40 });

  const paragraph1 =
    "For generations of students, NISB has been a space where curiosity becomes capability and ideas become impact. Through a year-round calendar of technical initiatives, we bring together engineering, creativity, competition, and collaboration."
      .split(/\s+/)
      .filter(Boolean);

  const paragraph2 =
    "This is more than an IEEE Student Branch. It is a legacy of ideas, a community of innovators, and a tradition of engineering excellence that continues to move forward."
      .split(/\s+/)
      .filter(Boolean);

  const totalWords = paragraph1.length + paragraph2.length;

  const legacyVideoUrl = 'https://www.youtube.com/watch?v=2sM8orzFsZo';

  return (
    <section
      ref={containerRef}
      id="legacy"
      className="relative bg-[var(--void)] text-[var(--star-white)] py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b border-[var(--border-main)] selection:bg-[var(--accent)] selection:text-black w-full overflow-hidden"
    >
      <SolarBackground />

      {/* Top Solar Progress Line */}
      <div className="w-full h-[2px] bg-white/10 mb-12 sm:mb-16">
        <motion.div
          className="h-full bg-[var(--accent)] shadow-[0_0_20px_var(--accent)]"
          style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
        />
      </div>

      <div className="w-full space-y-16 sm:space-y-24">
        {/* ── PART 1: EDITORIAL WRITEUP SPREAD FULL WIDTH ── */}
        <div className="w-full space-y-8 sm:space-y-12">
          {/* Header & Badges */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-[var(--accent)] text-[var(--accent)] text-xs font-mono font-bold uppercase tracking-[0.35em] rounded-full bg-[var(--accent)]/10 shadow-[0_0_15px_var(--accent-glow)]">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span>Region 10 Excellence • 25 Years</span>
              </span>

              <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.92] sm:leading-[0.88] tracking-[-0.05em] uppercase font-display">
                The <span className="text-transparent stroke-white" style={{ WebkitTextStroke: '2px white' }}>Unmatched</span> <br />
                <span className="text-[var(--accent)] drop-shadow-[0_0_35px_var(--accent-glow)]">Legacy</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm md:text-base font-mono text-white/60 max-w-lg uppercase tracking-wider leading-relaxed">
              Preserving engineering heritage while advancing breakthrough research and technical leadership since 1999.
            </p>
          </div>

          {/* Full Screen Word Reveal Paragraphs */}
          <div className="w-full space-y-6 sm:space-y-8 pt-2">
            <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 sm:gap-x-3.5 sm:gap-y-2 md:gap-x-4 md:gap-y-2.5">
              {paragraph1.map((word, i) => (
                <Word
                  key={`p1-${i}`}
                  word={word}
                  i={i}
                  total={totalWords}
                  progress={smoothProgress}
                  isMobile={isMobile}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 sm:gap-x-3.5 sm:gap-y-2 md:gap-x-4 md:gap-y-2.5">
              {paragraph2.map((word, i) => (
                <Word
                  key={`p2-${i}`}
                  word={word}
                  i={paragraph1.length + i}
                  total={totalWords}
                  progress={smoothProgress}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── PART 2: STUNNING FULL-SCREEN PANORAMIC 25-YEAR FILM SHOWCASE ── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '200px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--border-main)] bg-[var(--card-bg)] shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_50px_var(--accent-glow)] group hover:border-[var(--accent)]/60 transition-all duration-700"
        >
          {/* Ambient Lighting Orbs inside Card */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--accent)]/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Panoramic Film Frame */}
          <div className="relative aspect-[16/9] md:aspect-[24/9] lg:aspect-[28/9] min-h-[340px] sm:min-h-[440px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Cinematic Graphic / Video Poster */}
            <img
              src="https://img.youtube.com/vi/2sM8orzFsZo/maxresdefault.jpg"
              alt="NISB 25 Years Legacy Film"
              className="w-full h-full object-cover filter brightness-[0.6] contrast-110 group-hover:scale-105 transition-transform duration-1000"
            />

            {/* Dark Vignette & Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.75)_100%)]" />

            {/* Center Luminous Play Button */}
            <a
              href={legacyVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute z-20 group/play flex flex-col items-center justify-center gap-3 transition-transform duration-300 hover:scale-110 active:scale-95"
              aria-label="Play NISB 25-Year Legacy Film on YouTube"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-black/60 backdrop-blur-xl border-2 border-[var(--accent)] flex items-center justify-center shadow-[0_0_40px_var(--accent-glow)] group-hover/play:shadow-[0_0_60px_var(--accent)] group-hover/play:border-white transition-all">
                <div className="w-0 h-0 border-y-[12px] sm:border-y-[15px] border-y-transparent border-l-[20px] sm:border-l-[26px] border-l-white ml-1.5 transition-colors group-hover/play:border-l-[var(--accent)]" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-white/80 group-hover/play:text-white transition-colors bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                PLAY FILM ↗
              </span>
            </a>

            {/* Bottom Info Banner */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
              <div className="max-w-2xl">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-display">
                  Watch The 25-Year <span className="text-[var(--accent)]">Legacy Story</span>
                </h3>
                <p className="text-xs sm:text-sm font-sans text-white/70 mt-1.5 leading-relaxed line-clamp-2 sm:line-clamp-none max-w-xl">
                  Experience the founding memories, historic flagships, alumni achievements, and the visionary community that forged NIE IEEE Student Branch.
                </p>
              </div>

              <a
                href={legacyVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--star-white)] hover:bg-[var(--accent)] text-[var(--void)] hover:text-black text-xs font-mono font-extrabold uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 shrink-0"
              >
                <span>Open in YouTube</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}