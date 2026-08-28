'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const LuxuryStardustCanvas = dynamic(() => import('./LuxuryStardustCanvas'), { ssr: false });
const FluidDotMorphCanvas = dynamic(() => import('./FluidDotMorphCanvas'), { ssr: false });

interface MobileIntroProps {
  onComplete: () => void;
}

export default function MobileIntro({ onComplete }: MobileIntroProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  const skip = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsExiting(true);
    setTimeout(onComplete, 400);
  }, [onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setIsRevealed(true), 5400);
    const t2 = setTimeout(() => setIsExiting(true), 8600);
    const t3 = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 9400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[99999] flex flex-col justify-between items-center overflow-hidden select-none font-sans text-white"
      style={{
        background: 'radial-gradient(120% 120% at 50% 30%, #081020 0%, #03060e 50%, #010206 100%)',
        backgroundColor: '#030712',
      }}
    >
      {/* ── PURE CSS MICRO-BRUSHED METALLIC STYLES ── */}
      <style jsx global>{`
        .bg-brushed-metal {
          background-image: 
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.035) 0px,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.18) 0px,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 2px,
              transparent 4px
            );
          background-size: 100% 100%, 100% 100%;
        }

        .text-debossed-platinum-bright {
          color: #ffffff;
          background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 45%, #cbd5e1 85%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0px 1.5px 2px rgba(0, 0, 0, 0.95));
        }

        .metal-edge-bevel {
          box-shadow: 
            inset 0 1px 1.5px rgba(255, 255, 255, 0.4),
            inset 0 -1px 1.5px rgba(0, 0, 0, 0.85),
            inset 1px 0 1.5px rgba(255, 255, 255, 0.25),
            inset -1px 0 1.5px rgba(0, 0, 0, 0.65),
            0 25px 50px -12px rgba(0, 0, 0, 0.85),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .engraved-native-stamp {
          background: rgba(5, 8, 15, 0.45);
          box-shadow: 
            inset 0 1px 2px rgba(0, 0, 0, 0.8),
            0 1px 0 rgba(255, 255, 255, 0.12);
        }
      `}</style>

      {/* Lightweight Ambient Cyan Glow on Mobile */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, transparent 70%)',
        }}
      />

      {/* Auto-optimized lightweight Electric Blue Stardust */}
      <LuxuryStardustCanvas />

      {/* 4-Dot to NISB Letterform Morph Engine */}
      <FluidDotMorphCanvas
        word="NISB"
        onSolidComplete={() => setIsRevealed(true)}
      />

      {/* Minimalist Top Skip Button */}
      <header className="relative z-20 w-full px-5 pt-6 flex justify-end items-center pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={skip}
            className="group relative px-4 py-2 rounded-full bg-white/[0.08] active:bg-white/[0.2] backdrop-blur-xl border border-sky-300/35 text-[11px] font-mono font-bold text-sky-100 uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-300 shadow-[0_0_6px_#38bdf8]" />
            </span>
            <span>SKIP</span>
            <span className="text-sky-300 font-bold">↗</span>
          </button>
        </div>
      </header>

      {/* ── REFINED MICRO-BRUSHED METALLIC CARD (MOBILE WITH TOP MARGIN) ── */}
      <footer className="relative z-20 w-full max-w-sm px-4 mt-6 pb-7 flex justify-center pointer-events-none">
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ y: 28, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 14, opacity: 0, scale: 0.98 }}
              transition={{
                duration: 0.95,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ willChange: 'transform, opacity' }}
              className="relative w-full pointer-events-auto rounded-2xl bg-gradient-to-br from-[#0e1628] via-[#0a111f] to-[#060913] border border-slate-700/60 p-4 metal-edge-bevel font-mono overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.9)] flex flex-col gap-2.5"
            >
              {/* Anisotropic Micro-Brushed Surface Overlay */}
              <div className="absolute inset-0 bg-brushed-metal opacity-35 pointer-events-none z-0" />

              {/* Card Top Row */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-slate-400 via-white to-slate-200 ring-1 ring-slate-100/60 shadow-[0_0_6px_rgba(255,255,255,0.5)] flex-shrink-0" />
                  <h3 className="text-xs font-black tracking-[0.2em] text-debossed-platinum-bright uppercase leading-tight">
                    NISB • IEEE
                  </h3>
                </div>

                <div className="px-2.5 py-0.5 rounded border border-slate-700/60 engraved-native-stamp text-[9px] font-bold tracking-wider text-slate-300 uppercase flex-shrink-0">
                  EST. 1999 • R10
                </div>
              </div>

              {/* Hairline Divider */}
              <div className="relative z-10 h-[1px] w-full bg-slate-950 border-b border-slate-700/60" />

              {/* Card Bottom Row */}
              <div className="relative z-10">
                <p className="text-[9.5px] font-extrabold tracking-[0.22em] text-debossed-platinum-bright uppercase leading-relaxed">
                  ADVANCING TECHNOLOGY FOR HUMANITY
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </motion.div>
  );
}
