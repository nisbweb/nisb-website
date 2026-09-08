'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PublicationEdition {
  id: string;
  title: string;
  edition: string;
  subtitle: string;
  coverImage: string;
  pdfUrl: string;
  driveEmbedUrl: string;
  year: string;
  pages: {
    pageNumber: number;
    title?: string;
    image?: string;
    content: string;
    section?: string;
  }[];
}

interface BookFlipReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  publication: {
    title: string;
    subtitle: string;
    currentEditionId: string;
    editions: PublicationEdition[];
  } | null;
}

export default function BookFlipReaderModal({
  isOpen,
  onClose,
  publication,
}: BookFlipReaderModalProps) {
  const [selectedEditionId, setSelectedEditionId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0); // 0-indexed: 0 is cover
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isFlipping, setIsFlipping] = useState(false);
  const [viewMode, setViewMode] = useState<'flipbook' | 'pdf'>('flipbook');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize selected edition when publication opens
  useEffect(() => {
    if (publication && publication.editions.length > 0) {
      setSelectedEditionId(publication.currentEditionId || publication.editions[0].id);
      setCurrentPage(0);
      setViewMode('flipbook');
    }
  }, [publication]);

  const activeEdition =
    publication?.editions.find((e) => e.id === selectedEditionId) ||
    publication?.editions[0];

  const totalPages = activeEdition?.pages.length || 1;

  // Handle Page Turns with Realistic Flip Animation
  const turnNext = useCallback(() => {
    if (!activeEdition || isFlipping || currentPage >= totalPages - 1) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setCurrentPage((prev) => Math.min(prev + 2, totalPages - 1));
    setTimeout(() => setIsFlipping(false), 500);
  }, [activeEdition, isFlipping, currentPage, totalPages]);

  const turnPrev = useCallback(() => {
    if (!activeEdition || isFlipping || currentPage <= 0) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    setCurrentPage((prev) => Math.max(prev - 2, 0));
    setTimeout(() => setIsFlipping(false), 500);
  }, [activeEdition, isFlipping, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') turnNext();
      if (e.key === 'ArrowLeft') turnPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, turnNext, turnPrev, onClose]);

  if (!isOpen || !publication || !activeEdition) return null;

  const leftPageIndex = currentPage > 0 ? currentPage : 0;
  const rightPageIndex = currentPage + 1 < totalPages ? currentPage + 1 : null;

  const leftPage = activeEdition.pages[leftPageIndex];
  const rightPage = rightPageIndex !== null ? activeEdition.pages[rightPageIndex] : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 md:p-8">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative z-10 w-full max-w-6xl bg-[#080c16] border border-white/15 rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden ${
            isFullscreen ? 'fixed inset-2 max-w-none max-h-none rounded-none' : 'max-h-[92vh]'
          }`}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#050811]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase text-white font-display flex items-center gap-2">
                  <span>{publication.title}</span>
                  <span className="text-xs font-mono text-[var(--accent)] font-semibold">
                    • {activeEdition.edition}
                  </span>
                </h3>
                <p className="text-[10px] font-mono text-white/50">{publication.subtitle}</p>
              </div>
            </div>

            {/* Edition Tabs & Mode Selector */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Switch Editions Dropdown / Pills */}
              <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                {publication.editions.map((ed) => (
                  <button
                    key={ed.id}
                    onClick={() => {
                      setSelectedEditionId(ed.id);
                      setCurrentPage(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      ed.id === activeEdition.id
                        ? 'bg-[var(--accent)] text-black shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {ed.year}
                  </button>
                ))}
              </div>

              {/* Flipbook vs Raw PDF Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  onClick={() => setViewMode('flipbook')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    viewMode === 'flipbook'
                      ? 'bg-white/20 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                  title="3D Flipbook Experience"
                >
                  📖 Flipbook
                </button>
                <button
                  onClick={() => setViewMode('pdf')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    viewMode === 'pdf'
                      ? 'bg-white/20 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                  title="PDF Document View"
                >
                  📄 PDF Frame
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:flex w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 items-center justify-center text-white/70 hover:text-white transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFullscreen ? "M6 18L18 6M6 6l12 12" : "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"} />
                </svg>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center transition-colors"
                title="Close Reader (Esc)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Edition Select Row on Mobile */}
          <div className="flex sm:hidden items-center gap-1.5 px-4 py-2 bg-white/[0.02] border-b border-white/5 overflow-x-auto">
            <span className="text-[9px] font-mono text-white/40 shrink-0">EDITIONS:</span>
            {publication.editions.map((ed) => (
              <button
                key={ed.id}
                onClick={() => {
                  setSelectedEditionId(ed.id);
                  setCurrentPage(0);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap ${
                  ed.id === activeEdition.id
                    ? 'bg-[var(--accent)] text-black font-bold'
                    : 'text-white/60 bg-white/5'
                }`}
              >
                {ed.year}
              </button>
            ))}
          </div>

          {/* Main Content Stage */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center min-h-[420px] sm:min-h-[500px]">
            {viewMode === 'pdf' ? (
              /* Embedded PDF Frame View */
              <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-white/15 bg-black/40">
                <iframe
                  src={activeEdition.driveEmbedUrl}
                  className="w-full h-full min-h-[500px] border-0"
                  title={`${publication.title} PDF Document`}
                  allow="autoplay"
                />
              </div>
            ) : (
              /* 3D Realistic Double-Page Book Flip Stage */
              <div
                className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-[16/10] flex items-stretch rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/15 overflow-hidden"
                style={{ perspective: 1600 }}
              >
                {/* Book Spine Center Shadow */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 z-30 pointer-events-none bg-gradient-to-r from-black/60 via-black/85 to-black/60 hidden sm:block shadow-inner" />

                {/* Left Page */}
                <div className="w-full sm:w-1/2 bg-[#0d121f] p-6 sm:p-8 flex flex-col justify-between border-r border-white/10 relative overflow-hidden">
                  {/* Subtle paper gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />

                  {/* Header / Chapter */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-mono text-[var(--accent)] uppercase font-bold tracking-widest">
                      {leftPage?.section || publication.title}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      Page {leftPageIndex + 1}
                    </span>
                  </div>

                  {/* Body Content / Visual */}
                  <div className="my-auto space-y-4 py-4">
                    {leftPageIndex === 0 && activeEdition.coverImage && (
                      <div className="w-32 h-44 sm:w-40 sm:h-56 mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/20">
                        <img
                          src={activeEdition.coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h4 className="text-xl sm:text-2xl font-black uppercase text-white font-display tracking-tight">
                      {leftPage?.title || `${publication.title} — ${activeEdition.edition}`}
                    </h4>
                    <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed max-h-[180px] sm:max-h-[220px] overflow-y-auto pr-1">
                      {leftPage?.content}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40 border-t border-white/10 pt-3">
                    <span>IEEE NISB ARCHIVES</span>
                    <span>{activeEdition.year}</span>
                  </div>
                </div>

                {/* Right Page (hidden on mobile, single page flow) */}
                <div className="hidden sm:flex sm:w-1/2 bg-[#0c101c] p-6 sm:p-8 flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tl from-white/[0.02] to-transparent pointer-events-none" />

                  {rightPage ? (
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-[10px] font-mono text-[var(--accent)] uppercase font-bold tracking-widest">
                          {rightPage.section || activeEdition.edition}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          Page {rightPageIndex! + 1}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="my-auto space-y-4 py-4">
                        <h4 className="text-xl sm:text-2xl font-black uppercase text-white font-display tracking-tight">
                          {rightPage.title || 'Branch Highlights'}
                        </h4>
                        <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed max-h-[180px] sm:max-h-[220px] overflow-y-auto pr-1">
                          {rightPage.content}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/40 border-t border-white/10 pt-3">
                        <span>VOLUME ARCHIVE</span>
                        <span>PAGE {rightPageIndex! + 1} OF {totalPages}</span>
                      </div>
                    </>
                  ) : (
                    /* Back Cover or Blank Endpaper */
                    <div className="my-auto text-center space-y-4 p-8">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-[var(--accent)]">
                        ⭐
                      </div>
                      <h4 className="text-lg font-bold text-white font-display">End of Edition Preview</h4>
                      <p className="text-xs text-white/60 font-sans">
                        Read full uncompressed PDF with complete spreads via the PDF Frame toggle or download raw copy.
                      </p>
                    </div>
                  )}
                </div>

                {/* Flip Page Animated Overlay on Turn */}
                {isFlipping && (
                  <motion.div
                    initial={{
                      rotateY: flipDirection === 'next' ? 0 : -180,
                      transformOrigin: flipDirection === 'next' ? 'left' : 'right',
                    }}
                    animate={{
                      rotateY: flipDirection === 'next' ? -180 : 0,
                    }}
                    transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute top-0 bottom-0 left-1/2 w-1/2 bg-[#121829] border border-white/20 shadow-2xl z-40 pointer-events-none hidden sm:block"
                  >
                    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-r from-black/30 via-transparent to-black/30">
                      <p className="text-xs font-mono text-[var(--accent)] animate-pulse">
                        Flipping page...
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3.5 border-t border-white/10 bg-[#050811] gap-3">
            {/* Page Indicator */}
            <div className="flex items-center gap-3">
              <button
                onClick={turnPrev}
                disabled={currentPage <= 0}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <span>←</span>
                <span>Previous</span>
              </button>

              <span className="text-xs font-mono text-white/70 font-semibold min-w-[90px] text-center">
                Pages {leftPageIndex + 1}{rightPageIndex ? `–${rightPageIndex + 1}` : ''} / {totalPages}
              </span>

              <button
                onClick={turnNext}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>

            {/* Jump Scrubber Slider */}
            <div className="hidden md:flex items-center gap-3 w-64">
              <span className="text-[10px] font-mono text-white/40">1</span>
              <input
                type="range"
                min="0"
                max={totalPages - 1}
                step="2"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
              />
              <span className="text-[10px] font-mono text-white/40">{totalPages}</span>
            </div>

            {/* Download Raw Copy & Direct External Drive Fallback */}
            <div className="flex items-center gap-2">
              <a
                href={activeEdition.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Open in Google Drive / Download PDF"
              >
                <span>Download / Drive</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
