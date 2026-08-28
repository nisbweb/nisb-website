'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  name: string;
  role: string;
  category: 'core' | 'chapter' | 'tech';
  society: string;
  img: string;
  fallback: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Sagar Kumar Singh',
    role: 'Chairperson',
    category: 'core',
    society: 'Executive Board',
    img: '/assets/team/SagarSingh.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/SagarSingh.jpg',
  },
  {
    name: 'Abhay Hegde',
    role: 'Vice Chairperson & Secretary of Marketing and Publicity',
    category: 'core',
    society: 'Executive Board',
    img: '/assets/team/Abhay.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Abhay.jpg',
  },
  {
    name: 'Yogesh S',
    role: 'Treasurer',
    category: 'core',
    society: 'Executive Board',
    img: '/assets/team/Yogesh.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Yogesh.jpg',
  },
  {
    name: 'Sakleshwar Hubli',
    role: 'Secretary of Internal Affairs',
    category: 'core',
    society: 'Executive Board',
    img: '/assets/team/Saklesh.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Saklesh.jpg',
  },
  {
    name: 'K Anantha Krishna Rao',
    role: 'Secretary of Events',
    category: 'core',
    society: 'Event Operations',
    img: '/assets/team/Anantha.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Anantha.jpg',
  },
  {
    name: 'Shreya P V',
    role: 'Secretary of Events',
    category: 'core',
    society: 'Event Operations',
    img: '/assets/team/ShreyaPV.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Shreya%20P%20V.jpg',
  },
  {
    name: 'Aadya Sharma',
    role: 'Secretary of Marketing and Publicity',
    category: 'core',
    society: 'Member Public Relations',
    img: '/assets/team/Aadya.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Aadya.jpeg',
  },
  {
    name: 'Sagar N Mutalik',
    role: 'Secretary of membership development & SAC Coordinator',
    category: 'core',
    society: 'Member Development & SAC',
    img: '/assets/team/SagarNM.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/SagarNM.jpg',
  },
  {
    name: 'Pranav A Korlahalli',
    role: 'Technology Coordinator',
    category: 'tech',
    society: 'Tech Team',
    img: '/assets/team/Pranav.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Pranav.jpg',
  },
  {
    name: 'Aashish Vatwani',
    role: 'Technology Coordinator',
    category: 'tech',
    society: 'Tech Team',
    img: '/assets/team/Aashish.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Aashish.jpg',
  },
  {
    name: 'Rahul K',
    role: 'Editor-in-Chief',
    category: 'core',
    society: 'Editorial & Publications',
    img: '/assets/team/Rahul.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Rahul.jpeg',
  },
  {
    name: 'Shresth S Juptimath',
    role: 'Sponsorship Coordinator',
    category: 'core',
    society: 'Corporate Outreach',
    img: '/assets/team/Shresht.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Shresht.JPG',
  },
  {
    name: 'Priyanka Pramod Daivagna',
    role: 'CS Chairperson',
    category: 'chapter',
    society: 'Computer Society',
    img: '/assets/team/Priyanka.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Priyanka.jpeg',
  },
  {
    name: 'Prerika P',
    role: 'CS Secretary',
    category: 'chapter',
    society: 'Computer Society',
    img: '/assets/team/PrerikaP.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/PrerikaP.jpeg',
  },
  {
    name: 'Nikitha H S',
    role: 'CASS & RAS Chairperson',
    category: 'chapter',
    society: 'CASS & RAS Societies',
    img: '/assets/team/Nikitha.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Nikitha.jpeg',
  },
  {
    name: 'Suma Acharya',
    role: 'CASS Secretary',
    category: 'chapter',
    society: 'Circuits & Systems Society',
    img: '/assets/team/Suma.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Suma.jpg',
  },
  {
    name: 'Sanjana S Shetty',
    role: 'WIE Chairperson',
    category: 'chapter',
    society: 'Women in Engineering',
    img: '/assets/team/SanjanaS.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/SanjanaS.jpg',
  },
  {
    name: 'Panchami Urs S',
    role: 'WIE Secretary',
    category: 'chapter',
    society: 'Women in Engineering',
    img: '/assets/team/Panchami.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Panchami.jpg',
  },
  {
    name: 'Rachit Kulkarni',
    role: 'RAS Secretary',
    category: 'chapter',
    society: 'Robotics & Automation Society',
    img: '/assets/team/Rachit.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Rachit.jpeg',
  },
  {
    name: 'Mohammed Mansooruddin',
    role: 'GRSS Chairperson',
    category: 'chapter',
    society: 'Geoscience & Remote Sensing',
    img: '/assets/team/Mansoor.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Mansoor.jpg',
  },
  {
    name: 'Amol S',
    role: 'GRSS Secretary',
    category: 'chapter',
    society: 'Geoscience & Remote Sensing',
    img: '/assets/team/Amol.jpg?v=2',
    fallback: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Amol.jpg',
  },
];

function TeamGridCard({ member, isPriority = false }: { member: TeamMember; isPriority?: boolean }) {
  const [imgSrc, setImgSrc] = useState(member.img);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
          src={imgSrc}
          alt={member.name}
          loading={isPriority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (imgSrc !== member.fallback) setImgSrc(member.fallback);
          }}
          className={`w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-106 pointer-events-none ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />

        {/* Gradient Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02050c] via-[#02050c]/35 to-transparent opacity-95 group-hover:opacity-85 transition-opacity pointer-events-none" />

        {/* Member Name & Role at Bottom */}
        <div className="absolute bottom-4 left-4 right-4 z-10 space-y-0.5 pointer-events-none">
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-[var(--accent)] transition-colors leading-snug font-display">
            {member.name}
          </h3>
          <p className="text-xs font-mono text-white/70 font-semibold leading-tight">
            {member.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
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

          <p className="text-xs sm:text-sm font-sans text-[var(--text-muted)] max-w-xl mx-auto">
            Meet the dedicated core committee and coordinators steering Region 10’s premier IEEE student branch.
          </p>
        </div>

        {/* ── All 21 Team Members in Clean, High-Speed Responsive Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {TEAM_MEMBERS.map((member, idx) => (
              <TeamGridCard
                key={member.name}
                member={member}
                isPriority={idx < 8}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
