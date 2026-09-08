'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface TeamMember {
  name: string;
  role: string;
  category: 'core' | 'chapter' | 'tech';
  society: string;
  img: string;
  fallback: string;
  linkedin?: string;
  instagram?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Sagar Kumar Singh',
    role: 'Chairperson',
    category: 'core',
    society: 'Executive Board',
    img: '/assets/team/SagarSingh.webp',
    fallback: '/assets/team/SagarSingh.jpg',
  },
  {
    name: 'Abhay Hegde',
    role: 'Vice Chairperson & Secretary of Marketing and Publicity',
    category: 'core',
    society: 'Executive Board',
    img: '/assets/team/Abhay.webp',
    fallback: '/assets/team/Abhay.jpg',
  },
  {
    name: 'Yogesh S',
    role: 'Treasurer',
    category: 'core',
    society: 'Executive Board',
    img: '/assets/team/Yogesh.webp',
    fallback: '/assets/team/Yogesh.jpg',
  },
  {
    name: 'Sakleshwar Hubli',
    role: 'Secretary of Internal Affairs',
    category: 'core',
    society: 'Executive Board',
    img: '/assets/team/Saklesh.webp',
    fallback: '/assets/team/Saklesh.jpg',
  },
  {
    name: 'K Anantha Krishna Rao',
    role: 'Secretary of Events',
    category: 'core',
    society: 'Event Operations',
    img: '/assets/team/Anantha.webp',
    fallback: '/assets/team/Anantha.jpg',
  },
  {
    name: 'Shreya P V',
    role: 'Secretary of Events',
    category: 'core',
    society: 'Event Operations',
    img: '/assets/team/ShreyaPV.webp',
    fallback: '/assets/team/ShreyaPV.jpg',
  },
  {
    name: 'Aadya Sharma',
    role: 'Secretary of Marketing and Publicity',
    category: 'core',
    society: 'Member Public Relations',
    img: '/assets/team/Aadya.webp',
    fallback: '/assets/team/Aadya.jpg',
    linkedin: 'https://www.linkedin.com/in/aadya-sharma-272059231',
  },
  {
    name: 'Sagar N Mutalik',
    role: 'Secretary of membership development & SAC Coordinator',
    category: 'core',
    society: 'Member Development & SAC',
    img: '/assets/team/SagarNM.webp',
    fallback: '/assets/team/SagarNM.jpg',
  },
  {
    name: 'Pranav A Korlahalli',
    role: 'Technology Coordinator',
    category: 'tech',
    society: 'Tech Team',
    img: '/assets/team/Pranav.webp',
    fallback: '/assets/team/Pranav.jpg',
    linkedin: 'https://www.linkedin.com/in/pranav-a-korlahalli',
  },
  {
    name: 'Aashish Vatwani',
    role: 'Technology Coordinator',
    category: 'tech',
    society: 'Tech Team',
    img: '/assets/team/Aashish.webp',
    fallback: '/assets/team/Aashish.jpg',
  },
  {
    name: 'Rahul K',
    role: 'Editor-in-Chief',
    category: 'core',
    society: 'Editorial & Publications',
    img: '/assets/team/Rahul.webp',
    fallback: '/assets/team/Rahul.jpg',
  },
  {
    name: 'Shresth S Juptimath',
    role: 'Sponsorship Coordinator',
    category: 'core',
    society: 'Corporate Outreach',
    img: '/assets/team/Shresht.webp',
    fallback: '/assets/team/Shresht.jpg',
  },
  {
    name: 'Priyanka Pramod Daivagna',
    role: 'CS Chairperson',
    category: 'chapter',
    society: 'Computer Society',
    img: '/assets/team/Priyanka.webp',
    fallback: '/assets/team/Priyanka.jpg',
  },
  {
    name: 'Prerika P',
    role: 'CS Secretary',
    category: 'chapter',
    society: 'Computer Society',
    img: '/assets/team/PrerikaP.webp',
    fallback: '/assets/team/PrerikaP.jpg',
    linkedin: 'https://www.linkedin.com/in/prerika-p-ba267225a/',
  },
  {
    name: 'Nikitha H S',
    role: 'CASS & RAS Chairperson',
    category: 'chapter',
    society: 'CASS & RAS Societies',
    img: '/assets/team/Nikitha.webp',
    fallback: '/assets/team/Nikitha.jpg',
  },
  {
    name: 'Suma Acharya',
    role: 'CASS Secretary',
    category: 'chapter',
    society: 'Circuits & Systems Society',
    img: '/assets/team/Suma.jpg',
    fallback: '/assets/team/Suma.webp',
  },
  {
    name: 'Sanjana S Shetty',
    role: 'WIE Chairperson',
    category: 'chapter',
    society: 'Women in Engineering',
    img: '/assets/team/SanjanaS.webp',
    fallback: '/assets/team/SanjanaS.jpg',
  },
  {
    name: 'Panchami Urs S',
    role: 'WIE Secretary',
    category: 'chapter',
    society: 'Women in Engineering',
    img: '/assets/team/Panchami.webp',
    fallback: '/assets/team/Panchami.jpg',
  },
  {
    name: 'Rachit Kulkarni',
    role: 'RAS Secretary',
    category: 'chapter',
    society: 'Robotics & Automation Society',
    img: '/assets/team/Rachit.webp',
    fallback: '/assets/team/Rachit.jpg',
  },
  {
    name: 'Mohammed Mansooruddin',
    role: 'GRSS Chairperson',
    category: 'chapter',
    society: 'Geoscience & Remote Sensing',
    img: '/assets/team/Mansoor.webp',
    fallback: '/assets/team/Mansoor.jpg',
    linkedin: 'https://www.linkedin.com/in/mohammedmansooruddin',
    instagram: 'https://www.instagram.com/m_mansoorrr?stkn=ZTJ6aHdyYm9ncHQ=',
  },
  {
    name: 'Amol S',
    role: 'GRSS Secretary',
    category: 'chapter',
    society: 'Geoscience & Remote Sensing',
    img: '/assets/team/Amol.webp',
    fallback: '/assets/team/Amol.jpg',
  },
];

function TeamGridCard({
  member,
  isPriority = false,
  isMobile = false,
}: {
  member: TeamMember;
  isPriority?: boolean;
  isMobile?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(member.img);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [imgSrc]);

  return (
    <motion.div
      layout={!isMobile}
      initial={isMobile ? false : { opacity: 0, y: 24, scale: 0.96 }}
      whileInView={isMobile ? undefined : { opacity: 1, y: 0, scale: 1 }}
      animate={isMobile ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, margin: '300px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-[38px] border-[2.5px] border-white/15 hover:border-[var(--accent)] bg-gradient-to-b from-[#101726] to-[#070b14] p-2.5 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_var(--accent-glow)] hover:-translate-y-1.5 will-change-transform"
    >
      {/* Specular Edge Glow on Hover */}
      <div className="absolute inset-0 rounded-[38px] bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* OLED Screen Container */}
      <div className="relative aspect-[4/5] rounded-[30px] overflow-hidden bg-[#03060e] border border-white/10">
        {/* Soft Shimmer Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03] animate-pulse" />
        )}

        <img
          ref={imgRef}
          src={imgSrc}
          alt={member.name}
          width={600}
          height={750}
          loading={isPriority ? 'eager' : 'lazy'}
          decoding="async"
          // @ts-ignore
          fetchPriority={isPriority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (imgSrc !== member.fallback) {
              setImgSrc(member.fallback);
            }
          }}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-106 pointer-events-none"
        />

        {/* Gradient Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02050c] via-[#02050c]/35 to-transparent opacity-95 group-hover:opacity-85 transition-opacity pointer-events-none" />

        {/* Member Name & Role at Bottom with Socials */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-2">
          <div className="space-y-0.5 pointer-events-none">
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-[var(--accent)] transition-colors leading-snug font-display">
              {member.name}
            </h3>
            <p className="text-xs font-mono text-white/70 font-semibold leading-tight">
              {member.role}
            </p>
          </div>

          {(member.linkedin || member.instagram) && (
            <div className="flex items-center gap-1.5 shrink-0 z-20">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  className="w-7 h-7 rounded-full bg-black/60 hover:bg-[#0A66C2] border border-white/20 text-white flex items-center justify-center text-xs transition-all hover:scale-110 shadow-md"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              )}
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} Instagram`}
                  className="w-7 h-7 rounded-full bg-black/60 hover:bg-[#E1306C] border border-white/20 text-white flex items-center justify-center text-xs transition-all hover:scale-110 shadow-md"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section
      id="team"
      className="premium-section py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-[var(--void)] text-[var(--star-white)] relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-sky-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[88rem] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase font-display tracking-tight text-[var(--star-white)] leading-tight">
            CORE TEAM <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-[var(--accent)] drop-shadow-[0_0_25px_var(--accent-glow)]">
              2025–26
            </span>
          </h2>
        </div>

        {/* ── All 21 Team Members in Clean, High-Speed Responsive Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {TEAM_MEMBERS.map((member, idx) => (
              <TeamGridCard
                key={member.name}
                member={member}
                isPriority={idx < 8}
                isMobile={isMobile}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
