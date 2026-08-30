'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocietyFest {
  code: string;
  society: string;
  badge: string;
  accent: string;
  festName: string;
  festTagline: string;
  description: string;
  flagships: {
    name: string;
    type: string;
    desc: string;
  }[];
  stats: { label: string; val: string }[];
  bgGradient: string;
}

const SOCIETY_FESTS: SocietyFest[] = [
  {
    code: 'NISB',
    society: 'NIE IEEE Student Branch',
    badge: 'STUDENT BRANCH FLAGSHIPS',
    accent: '#38bdf8',
    festName: 'ANKURA & ADROIT',
    festTagline: 'State-Level Techno-Cultural Fest & National Technical Symposium',
    description:
      'The crown jewels of NISB. Ankura brings hundreds of students across Karnataka for vibrant technical innovation and cultural expression, while Adroit stands as our flagship national technical symposium featuring high-stakes competitive hackathons, paper presentations, and robotics tracks.',
    flagships: [
      { name: 'ANKURA', type: 'Annual Flagship Fest', desc: 'Premier state-level techno-cultural extravaganza with 20+ diverse technical and creative events.' },
      { name: 'ADROIT', type: 'National Tech Symposium', desc: 'Flagship symposium featuring algorithmic challenges, robotics combat, and research presentations.' },
      { name: 'IPL (IEEE Programming League)', type: 'Competitive Coding', desc: 'High-intensity multi-round coding league bringing top student developers together.' },
    ],
    stats: [
      { label: 'Participants', val: '2,500+' },
      { label: 'Colleges', val: '40+' },
      { label: 'Prize Pool', val: '₹1.5L+' },
    ],
    bgGradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
  },
  {
    code: 'CS',
    society: 'Computer Society',
    badge: 'COMPUTER SOCIETY',
    accent: '#06b6d4',
    festName: 'TURING CUP & CODEWARS',
    festTagline: 'Algorithmic Mastery, Open-Source & AI Bootcamps',
    description:
      'IEEE CS NISB drives software innovation with competitive programming leagues, production-grade MLOps bootcamps, and hackathons pushing the frontiers of artificial intelligence, cloud architectures, and web technologies.',
    flagships: [
      { name: 'Turing Cup', type: 'Championship', desc: 'Annual algorithmic programming championship testing data structures, dynamic programming, and logic.' },
      { name: 'MLOps & AI Sprint', type: 'Hands-on Bootcamp', desc: 'Deep learning pipeline workshop from model training to production cloud deployments.' },
      { name: 'Code Wars', type: 'Speed Hackathon', desc: 'Time-pressured competitive problem-solving sprint testing full-stack agility.' },
    ],
    stats: [
      { label: 'Developers', val: '800+' },
      { label: 'Repositories', val: '120+' },
      { label: 'Workshops', val: '15+' },
    ],
    bgGradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
  },
  {
    code: 'CASS',
    society: 'Circuits & Systems Society',
    badge: 'CIRCUITS & SYSTEMS',
    accent: '#f59e0b',
    festName: 'ELECTRONIKA',
    festTagline: 'Hardware Design, Analog Synthesis & Embedded Systems',
    description:
      'CASS NISB champions analog and digital hardware design. Electronika stands as our premier electronics symposium where students design custom PCBs, optimize logic circuits, and build real-time microcontroller prototypes.',
    flagships: [
      { name: 'Electronika', type: 'Annual Hardware Fest', desc: 'Hardware design championship featuring schematic capture, debugging, and live breadboard prototyping.' },
      { name: 'PCB Design Bootcamp', type: 'Fabrication Track', desc: 'Hands-on training in KiCAD, high-speed routing, and multi-layer board fabrication.' },
      { name: 'Embedded Circuit Hunt', type: 'Diagnostic Challenge', desc: 'Fast-paced circuit debugging and oscilloscope fault detection competition.' },
    ],
    stats: [
      { label: 'Circuits Built', val: '350+' },
      { label: 'Hardware Labs', val: '10+' },
      { label: 'Components', val: '5,000+' },
    ],
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
  },
  {
    code: 'RAS',
    society: 'Robotics & Automation Society',
    badge: 'ROBOTICS & AUTOMATION',
    accent: '#10b981',
    festName: 'ROBOLYMPICS',
    festTagline: 'Autonomous Navigation, Drone Racing & Combat Robotics',
    description:
      'IEEE RAS NISB brings engineering to life with autonomous ground vehicles, computer vision-guided drones, robotic manipulators, and intense combat arenas.',
    flagships: [
      { name: 'Robolympics', type: 'Robotics Arena', desc: 'Flagship arena with autonomous line-followers, maze navigators, and battle bot showdowns.' },
      { name: 'Autonomous Rover Hack', type: 'SLAM & ROS2', desc: 'Building ROS-powered rovers with LiDAR mapping and real-time obstacle avoidance.' },
      { name: 'Drone Aerial Challenge', type: 'Flight Dynamics', desc: 'Quadcopter flight controllers, PID tuning, and aerial photography competition.' },
    ],
    stats: [
      { label: 'Bots Deployed', val: '150+' },
      { label: 'Sensors Used', val: '800+' },
      { label: 'Arena Battles', val: '60+' },
    ],
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  },
  {
    code: 'WIE',
    society: 'Women in Engineering',
    badge: 'WOMEN IN ENGINEERING',
    accent: '#ec4899',
    festName: 'CASCADE SPRINT',
    festTagline: 'Empowering Women Technologists, Leadership & Innovation',
    description:
      'WIE NISB fosters diversity and technical leadership through fast-paced ideathons, UI/UX sprints, social community literacy drives, and women-in-tech leadership symposiums.',
    flagships: [
      { name: 'Cascade Sprint', type: 'Innovation Hackathon', desc: 'High-energy coding and problem-solving sprint tailored for aspiring women engineers.' },
      { name: 'Tech & Leadership Conclave', type: 'Keynote Panel', desc: 'Distinguished panel of women leaders in engineering and academic research.' },
      { name: 'Rural Digital Outreach', type: 'Social Drive', desc: 'Annual technology literacy camps at Divya Deepa and local underserved communities.' },
    ],
    stats: [
      { label: 'Women Led', val: '100%' },
      { label: 'Scholars', val: '450+' },
      { label: 'Outreach Camps', val: '12+' },
    ],
    bgGradient: 'from-pink-500/10 via-pink-500/5 to-transparent',
  },
  {
    code: 'GRSS',
    society: 'Geoscience & Remote Sensing Society',
    badge: 'GEOSCIENCE & REMOTE SENSING',
    accent: '#a855f7',
    festName: 'GEOSIGHT',
    festTagline: 'Satellite Earth Observation, GIS & Planetary Analytics',
    description:
      'GRSS NISB explores satellite data analytics, drone photogrammetry, synthetic aperture radar (SAR), and climate modeling in collaboration with national research bodies.',
    flagships: [
      { name: 'GeoSight', type: 'Geospatial Symposium', desc: 'Satellite imagery analysis, GIS terrain classification, and remote sensing datathons.' },
      { name: 'ISRO Technical Tour', type: 'Industrial Visit', desc: 'Exclusive access and technical walkthrough of satellite tracking and telemetry facilities.' },
      { name: 'SAR & Climate Modeling', type: 'Research Workshop', desc: 'Hands-on analysis of multi-spectral satellite datasets for environmental tracking.' },
    ],
    stats: [
      { label: 'Datasets Analyzed', val: '50GB+' },
      { label: 'Satellite Passes', val: '200+' },
      { label: 'Award Honours', val: '2025 Top' },
    ],
    bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
  },
  {
    code: 'CEDA',
    society: 'Council on Electronic Design Automation',
    badge: 'ELECTRONIC DESIGN AUTOMATION',
    accent: '#3b82f6',
    festName: 'CHIPDESIGN SUMMIT',
    festTagline: 'Semiconductor Architecture, EDA & VLSI Synthesis',
    description:
      'CEDA NISB focuses on the heart of semiconductor design: HDL synthesis, logic verification, physical place-and-route, and microarchitecture exploration.',
    flagships: [
      { name: 'ChipDesign Summit', type: 'VLSI Symposium', desc: 'Comprehensive symposium on modern EDA workflows, Verilog HDL, and ASIC design flows.' },
      { name: 'RTL to GDSII Workshop', type: 'Silicon Pipeline', desc: 'Open-source silicon flow walkthrough from behavioral code to layout mask files.' },
      { name: 'Logic Synthesis Sprint', type: 'HDL Challenge', desc: 'Optimizing circuit area, power, and timing in FPGA implementations.' },
    ],
    stats: [
      { label: 'RTL Cores', val: '40+' },
      { label: 'FPGA Deploys', val: '100+' },
      { label: 'Toolchains', val: '8+' },
    ],
    bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
  },
];

export default function SocietyFestsSection() {
  const [activeCode, setActiveCode] = useState<string>('NISB');

  const current = SOCIETY_FESTS.find((f) => f.code === activeCode) || SOCIETY_FESTS[0];

  return (
    <section
      id="flagships"
      className="premium-section py-20 bg-[var(--void)] text-[var(--star-white)] relative overflow-hidden border-b border-[var(--border-main)]"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: current.accent }}
      />

      <div className="max-w-[88rem] mx-auto space-y-12 px-4 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-main)]">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-[var(--accent)] font-bold block mb-1">
              SIGNATURE SYMPOSIA &amp; FESTS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-[var(--star-white)] leading-tight">
              SOCIETY <span className="text-[var(--accent)]">FLAGSHIPS</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] max-w-sm">
            Explore the signature annual technical fests, championships, and flagship symposiums hosted across NISB societies.
          </p>
        </div>

        {/* Society Selector Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {SOCIETY_FESTS.map((soc) => (
            <button
              key={soc.code}
              onClick={() => setActiveCode(soc.code)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 ${
                activeCode === soc.code
                  ? 'bg-[var(--star-white)] text-[var(--void)] shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {soc.code} • {soc.festName.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* Active Fest Spotlight Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-3xl border border-white/15 bg-gradient-to-br ${current.bgGradient} backdrop-blur-xl p-6 sm:p-8 md:p-12 shadow-2xl space-y-10 relative overflow-hidden`}
          >
            {/* Top Bar: Society name + Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span
                  className="inline-block text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full border mb-2"
                  style={{
                    borderColor: `${current.accent}50`,
                    color: current.accent,
                    backgroundColor: `${current.accent}15`,
                  }}
                >
                  {current.badge}
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-display text-white tracking-tight">
                  {current.festName}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-[var(--accent)] font-semibold mt-1">
                  {current.festTagline}
                </p>
              </div>

              {/* Stat Chips */}
              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                {current.stats.map((s, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md text-center min-w-[90px]"
                  >
                    <p className="text-lg sm:text-xl font-black text-white font-display leading-none">{s.val}</p>
                    <p className="text-[9px] font-mono text-white/60 uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: Description */}
            <p className="text-sm sm:text-base leading-relaxed text-white/80 max-w-4xl font-sans">
              {current.description}
            </p>

            {/* Bottom 3-Column Flagship Tracks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {current.flagships.map((f, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between gap-4 group"
                >
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/50 block mb-1">
                      {f.type}
                    </span>
                    <h4 className="text-lg font-bold text-white uppercase font-display tracking-tight group-hover:text-[var(--accent)] transition-colors">
                      {f.name}
                    </h4>
                    <p className="text-xs font-sans text-white/70 mt-2 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[var(--accent)] font-bold">
                    <span>Explore Track</span>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
