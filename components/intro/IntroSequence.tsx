'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const LuxuryStardustCanvas = dynamic(() => import('./LuxuryStardustCanvas'), { ssr: false });
const FluidDotMorphCanvas = dynamic(() => import('./FluidDotMorphCanvas'), { ssr: false });

interface IntroSequenceProps {
  onComplete: () => void;
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  const skip = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsExiting(true);
    setTimeout(onComplete, 450);
  }, [onComplete]);

  useEffect(() => {
    // 1. Reveal card smoothly as letters crystallize
    const t1 = setTimeout(() => setIsRevealed(true), 5400);
    // 2. Begin exit cross-fade
    const t2 = setTimeout(() => setIsExiting(true), 8800);
    // 3. Complete and hand over to landing page
    const t3 = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 9800);

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
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[99999] flex flex-col justify-between items-center overflow-hidden select-none text-white font-sans"
      style={{
        background: 'radial-gradient(120% 120% at 50% 30%, #081020 0%, #03060e 50%, #010206 100%)',
        backgroundColor: '#030712',
      }}
    >
      {/* ── PURE CSS MICRO-BRUSHED METALLIC & ENGRAVED STYLES ── */}
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

        .metallic-glare-sweep {
          background: linear-gradient(
            115deg,
            transparent 20%,
            rgba(255, 255, 255, 0.03) 35%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.03) 65%,
            transparent 80%
          );
        }

        .engraved-native-stamp {
          background: rgba(5, 8, 15, 0.45);
          box-shadow: 
            inset 0 1px 2px rgba(0, 0, 0, 0.8),
            0 1px 0 rgba(255, 255, 255, 0.12);
        }
      `}</style>

      {/* ── VOLUMETRIC ELECTRIC BLUE & CYAN NEBULA BLOOMS ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] rounded-full pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.10) 45%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse, rgba(186, 230, 253, 0.15) 0%, rgba(56, 189, 248, 0.06) 50%, transparent 70%)',
        }}
      />

      {/* ── ELECTRIC BLUE STARDUST & NEBULA CANVAS ── */}
      <LuxuryStardustCanvas />

      {/* ── FLUID 4 DOTS (SQUARE -> LINEAR -> MORPH -> SOLID) CANVAS ── */}
      <FluidDotMorphCanvas
        word="NISB"
        onSolidComplete={() => setIsRevealed(true)}
      />

      {/* ── TOP SPACER ── */}
      <div className="w-full h-8 sm:h-12 pointer-events-none" />

      {/* ── REFINED MICRO-BRUSHED METALLIC CARD (WITH INCREASED TOP MARGIN) ── */}
      <footer className="relative z-20 w-full max-w-2xl mx-auto px-4 sm:px-6 mt-8 sm:mt-14 pb-8 sm:pb-12 flex justify-center pointer-events-none">
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ y: 32, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{
                duration: 1.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ willChange: 'transform, opacity' }}
              className="relative w-full pointer-events-auto rounded-2xl bg-gradient-to-br from-[#0e1628] via-[#0a111f] to-[#060913] border border-slate-700/60 p-5 sm:p-7 metal-edge-bevel font-mono overflow-hidden transition-all duration-300 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.95)] hover:border-sky-400/50 group"
            >
              {/* Anisotropic Micro-Brushed Surface Texture Overlay */}
              <div className="absolute inset-0 bg-brushed-metal opacity-40 pointer-events-none z-0" />

              {/* Physical Light Glare Sweep */}
              <div className="absolute inset-0 metallic-glare-sweep opacity-25 pointer-events-none z-0 group-hover:opacity-40 transition-opacity duration-500" />

              {/* Subtle Ambient Nebula Glow behind metal plate */}
              <div className="absolute -top-12 right-1/4 w-36 h-36 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

              {/* CARD TOP ROW */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Machined Silver Metallic Dot with Glowing Aura */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-slate-400 via-white to-slate-200 ring-1 ring-slate-100/60 shadow-[0_0_8px_rgba(255,255,255,0.5)] flex-shrink-0" />
                  </div>

                  {/* Highly Visible Laser Engraved Branch Title */}
                  <h2 className="text-sm sm:text-base md:text-lg font-black tracking-[0.24em] text-debossed-platinum-bright uppercase leading-tight">
                    NIE IEEE STUDENT BRANCH
                  </h2>
                </div>

                {/* Natively Integrated Engraved Stamp */}
                <div className="px-3.5 py-1 rounded border border-slate-700/60 engraved-native-stamp text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-300 uppercase flex-shrink-0">
                  EST. 1999 <span className="text-slate-500 mx-1">•</span> REGION 10
                </div>
              </div>

              {/* Engraved Hairline Metallic Line Divider */}
              <div className="relative z-10 my-4 sm:my-5">
                <div className="h-[1px] w-full bg-slate-950 border-b border-slate-700/60" />
              </div>

              {/* CARD BOTTOM ROW */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <p className="text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.26em] text-debossed-platinum-bright uppercase leading-relaxed">
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
