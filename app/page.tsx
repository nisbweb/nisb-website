'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/landing/SmoothScroll';
import Navbar from '@/components/landing/Navbar';
import HeroCinematicHero from '@/components/landing/HeroCinematicHero';
import LegacyScrollSection from '@/components/landing/LegacyScrollSection';
import AwardsSection from '@/components/landing/AwardsSection';
import CinematicEventsSection from '@/components/landing/CinematicEventsSection';
import SocietyFestsSection from '@/components/landing/SocietyFestsSection';
import ActivitiesBentoGrid from '@/components/landing/ActivitiesBentoGrid';
import PublicationsSection from '@/components/landing/PublicationsSection';
import BlogsAndPodcastSection from '@/components/landing/BlogsAndPodcastSection';
import TeamSection from '@/components/landing/TeamSection';
import ChaptersSection from '@/components/landing/ChaptersSection';
import SiteFooter from '@/components/landing/SiteFooter';

// Client-only canvas & interactive widgets
const RadialThemeDial = dynamic(() => import('@/components/landing/RadialThemeDial'), { ssr: false });
const RobotWalkingDivider = dynamic(() => import('@/components/landing/RobotWalkingDivider'), { ssr: false });

// Heavy / SSR-unsafe components loaded dynamically
const IntroSequence = dynamic(() => import('@/components/intro/IntroSequence'), {
  ssr: false,
  loading: () => null,
});

const LandingCanvas = dynamic(() => import('@/components/landing/LandingCanvas'), { ssr: false });

export default function HomePage() {
  const [introUnmounted, setIntroUnmounted] = useState(false);
  const [landingVisible, setLandingVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // On mobile screens, immediately reveal landing page at 0ms with zero wait
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setLandingVisible(true);
      setIntroUnmounted(true);
      window.dispatchEvent(new Event('nisb:landingReady'));
    }
  }, []);

  const handleIntroComplete = () => {
    // 1. Immediately cross-fade in the landing page
    setLandingVisible(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nisb:landingReady'));
    }

    // 2. Unmount the intro overlay ONLY after the smooth crossfade finishes (800ms)
    setTimeout(() => {
      setIntroUnmounted(true);
    }, 800);
  };


  return (
    <SmoothScroll>
      <main>
        {/* ── Seamless Cross-fade Intro Sequence ── */}
        {!introUnmounted && (
          <div
            className="intro-overlay-container"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              pointerEvents: landingVisible ? 'none' : 'auto',
              opacity: landingVisible ? 0 : 1,
              transition: 'opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <IntroSequence onComplete={handleIntroComplete} />
          </div>
        )}

        {/* ── Landing Page ── */}
        <div
          ref={overlayRef}
          className="landing-wrapper"
          style={{
            opacity:    landingVisible ? 1 : 0,
            transition: 'opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1)',
            visibility: landingVisible ? 'visible' : 'hidden',
          }}
          aria-hidden={!landingVisible}
        >
          {/* Global ambient starfield */}
          {landingVisible && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} aria-hidden="true">
              <LandingCanvas />
            </div>
          )}

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* 1 ── Navigation */}
            <Navbar />

            {/* 2 ── Full-screen cinematic hero */}
            <HeroCinematicHero />

            {/* ── Astro-Bot Divider: Right to Left ── */}
            <RobotWalkingDivider direction="right-to-left" speed={1.0} />

            {/* 3 ── Scroll-pinned word-reveal legacy story */}
            <LegacyScrollSection />

            {/* 4 ── Awards & Honours */}
            <AwardsSection />

            {/* 5 ── Live Google Sheets Events Feed */}
            <CinematicEventsSection />

            {/* 6 ── Society Fests & Flagships */}
            <SocietyFestsSection />

            {/* ── Astro-Bot Divider: Left to Right ── */}
            <RobotWalkingDivider direction="left-to-right" speed={1.05} />

            {/* 7 ── All-round development bento grid with expandable focus groups */}
            <ActivitiesBentoGrid />

            {/* 8 ── Publications */}
            <PublicationsSection />

            {/* ── Astro-Bot Divider: Right to Left ── */}
            <RobotWalkingDivider direction="right-to-left" speed={0.95} />

            {/* 9 ── NISB Blogs & Tech and Tales Podcast */}
            <BlogsAndPodcastSection />

            {/* 10 ── Executive Committee / Team */}
            <TeamSection />

            {/* ── Astro-Bot Divider: Left to Right ── */}
            <RobotWalkingDivider direction="left-to-right" speed={1.1} />

            {/* 11 ── IEEE Chapters / Societies */}
            <ChaptersSection />

            {/* 12 ── Footer */}
            <SiteFooter />
          </div>
        </div>

        {/* ── 180° Semicircular Chromatic Reactor Theme Dial ── */}
        {landingVisible && <RadialThemeDial />}
      </main>
    </SmoothScroll>
  );
}
