'use client';

import { motion } from 'framer-motion';

interface AwardItem {
  year: string;
  category: string;
  title: string;
  issuer: string;
  description: string;
  highlight?: boolean;
}

const AWARDS: AwardItem[] = [
  {
    year: '2024–25',
    category: 'GLOBAL DISTINCTION',
    title: 'Region 10 Best Student Chapter',
    issuer: 'IEEE Region 10 (Asia-Pacific)',
    description:
      'Awarded to NIE IEEE Student Branch for exceptional operational vitality, high-impact technical symposiums, and leadership excellence across Asia-Pacific.',
    highlight: true,
  },
  {
    year: '2025',
    category: 'CHAPTER EXCELLENCE',
    title: 'Outstanding Chapter Award',
    issuer: 'IEEE GRSS & CS Societies',
    description:
      'Recognized for pioneering high-level remote sensing workshops, MLOps bootcamps, and global technical symposium engagements.',
    highlight: true,
  },
  {
    year: '2023',
    category: 'SECTION HONOUR',
    title: 'Outstanding Student Branch',
    issuer: 'IEEE Bangalore Section',
    description:
      'Honored for hosting over 70+ technical activities, national symposiums, and fostering exceptional student membership growth.',
  },
  {
    year: '2021',
    category: 'COMMUNITY IMPACT',
    title: 'Darrel Chong Student Activity Award',
    issuer: 'IEEE Member and Geographic Activities (MGA)',
    description:
      'Recognized internationally for impactful student activities, educational outreach, and peer mentorship initiatives.',
  },
  {
    year: '2018',
    category: 'SECTION HONOUR',
    title: 'Exemplary Student Branch Award',
    issuer: 'IEEE Bangalore Section',
    description:
      'Awarded for premier technical fests, robust focus group labs, and consistent contributions to the regional IEEE ecosystem.',
  },
  {
    year: '1999–2026',
    category: 'HISTORIC MILESTONE',
    title: '25+ Years of Engineering Legacy',
    issuer: 'National Institute of Engineering',
    description:
      'Over a quarter century of raw engineering heritage, student innovation, alumni leadership, and transformative technological achievements.',
  },
];

export default function AwardsSection() {
  return (
    <section
      id="awards"
      className="premium-section py-20 bg-[var(--void)] text-[var(--star-white)] relative overflow-hidden border-b border-[var(--border-main)]"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[88rem] mx-auto space-y-12 px-4 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-main)]">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-[var(--accent)] font-bold block mb-1">
              RECOGNITION &amp; DISTINCTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-[var(--star-white)] leading-tight">
              AWARDS &amp; <span className="text-[var(--accent)]">ACHIEVEMENTS</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] max-w-sm">
            Celebrating regional, national, and global accolades earned by NIE IEEE Student Branch over 25+ years of excellence.
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AWARDS.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
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
                <h3 className="text-2xl font-black uppercase font-display tracking-tight text-white group-hover:text-[var(--accent)] transition-colors leading-tight">
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
      </div>
    </section>
  );
}
