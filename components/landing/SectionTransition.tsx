'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionTransitionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  label?: string;
  index?: number;
  showLaserSeam?: boolean;
}

export default function SectionTransition({
  children,
  id,
  className = '',
  label,
  index,
  showLaserSeam = true,
}: SectionTransitionProps) {
  const formattedIndex = typeof index === 'number' ? String(index).padStart(2, '0') : null;

  return (
    <div id={id} className={`relative section-transition-wrapper ${className}`} style={{ perspective: 1200 }}>
      {/* ── QUANTUM LASER SEAM & CYBERNETIC HUD TAG ── */}
      {showLaserSeam && (
        <div className="relative w-full overflow-hidden pointer-events-none z-20">
          {/* Base Grid Line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-main)] to-transparent" />

          {/* Gliding High-Energy Laser Beam */}
          <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden">
            <div className="quantum-laser-beam" />
          </div>

          {/* Futuristic HUD Coordinate Tag & Corner Reticles */}
          {label && (
            <div className="max-w-[88rem] mx-auto px-4 sm:px-8 flex items-center justify-between text-[9px] font-mono tracking-[0.25em] text-[var(--accent)]/50 uppercase select-none -translate-y-1/2">
              <div className="inline-flex items-center gap-2 bg-[var(--void)]/90 backdrop-blur-md px-3 py-0.5 rounded-full border border-[var(--border-main)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                <span className="font-bold text-[var(--star-white)]">
                  {formattedIndex ? `[${formattedIndex}]` : '•'} {label}
                </span>
                <span className="text-white/30">// SYS_ACTIVE</span>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-white/30">
                <span>COORD.45.29°N</span>
                <span className="text-[var(--accent)]/60">◈</span>
                <span>SEC_LOCKED</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 3D PERSPECTIVE CINEMATIC ENTRANCE CONTAINER ── */}
      <motion.div
        initial={{
          opacity: 0,
          y: 44,
          scale: 0.97,
          rotateX: 3.5,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
        }}
        viewport={{ once: true, amount: 0.08, margin: '0px 0px -40px 0px' }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
        }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}
