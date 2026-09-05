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
    badge: 'STUDENT BRANCH FLAGSHIP FESTS',
    accent: '#38bdf8',
    festName: 'ANKURA & ADROIT',
    festTagline: 'Flagship Fests of NISB',
    description:
      'The flagship celebrations of NISB. Ankura and Adroit bring together students through technical learning, competitions, innovation, and a shared enthusiasm for technology. They represent the branch’s spirit of curiosity, collaboration, and building experiences beyond the classroom.',
    flagships: [
      {
        name: 'ANKURA',
        type: 'Odd Semester Flagship Fest',
        desc: 'One of NISB’s signature fests, bringing together students through a blend of technical and engaging activities!',
      },
      {
        name: 'ADROIT',
        type: 'Even Semester Flagship Fest',
        desc: 'One of NISB’s signature fests, creating a platform for students to explore technology, compete, learn, and connect!',
      },
    ],
    stats: [
      { label: 'Legacy', val: '25+ Years' },
      { label: 'Signature Fests', val: '2' },
      { label: 'Student Community', val: 'NISB' },
    ],
    bgGradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
  },


  {
    code: 'CS',
    society: 'Computer Society',
    badge: 'COMPUTER SOCIETY',
    accent: '#06b6d4',
    festName: 'RUBIX',
    festTagline: 'Code. Compete. Create.',
    description:
      'The Computer Society brings together students passionate about computing through hands-on workshops, weekly meetups, hackathons, coding competitions, technical talks, and project-driven learning. Its flagship fest, Rubix, brings that energy together in one place.',
    flagships: [
      {
        name: 'RUBIX',
        type: 'Flagship Tech Fest',
        desc: 'CS’s flagship event spanning multiple days of workshops, talks, hackathons, and technical activities.',
      },
      {
        name: 'CODEGEEKS',
        type: 'Coding Competition',
        desc: 'A coding competition designed to challenge programmers through problem-solving and competitive programming.',
      },
      {
        name: 'CODELABS',
        type: 'Workshop Series',
        desc: 'A dedicated workshop series exploring core technologies through focused sessions including C++, Python, and Java!',
      },
      {
        name: 'WEEKLY MEETUPS',
        type: 'Peer Learning',
        desc: 'Regular technical meetups where members strengthen their knowledge around focused topics and learn together!',
      },
    ],
    stats: [
      { label: 'Events', val: '80+' },
      { label: 'Workshops', val: '17' },
      { label: 'Weekly Meetups', val: '15' },
    ],
    bgGradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
  },


  {
    code: 'CASS',
    society: 'Circuits & Systems Society',
    badge: 'CIRCUITS & SYSTEMS',
    accent: '#f59e0b',
    festName: 'ILLUME',
    festTagline: 'Where Circuits Meet Creativity!',
    description:
      'CASS is where curiosity meets core electronics. Through workshops, technical events, and industry-oriented initiatives, the society gives students opportunities to explore circuits and systems beyond the textbook. Its flagship event, Illume, brings that spirit to life.',
    flagships: [
      {
        name: 'ILLUME',
        type: 'Flagship Electronics Fest',
        desc: 'CASS’s flagship event featuring workshops, competitions, and hands-on exploration of circuits and electronics.',
      },
      {
        name: 'I2I',
        type: 'Industry Interaction Forum',
        desc: 'A CASS initiative connecting students with industry experts through discussions around RTL design, Design Verification, DFT, STA, and analog design.',
      },
      {
        name: 'ELECTRONICS ESSENTIALS',
        type: 'Hands-on Workshop',
        desc: 'A practical electronics workshop covering analog and digital concepts, from resistor colour codes to building logic gates using universal gates.',
      },
    ],
    stats: [
      { label: 'CASS Events', val: '8' },
      { label: 'CASS Legacy', val: '5 Years' },
      { label: 'Funded Collaborations', val: '2' },
    ],
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
  },


  {
    code: 'RAS',
    society: 'Robotics & Automation Society',
    badge: 'ROBOTICS & AUTOMATION',
    accent: '#10b981',
    festName: 'ROSPHERE',
    festTagline: 'Robotics, Automation & Innovation in Motion',
    description:
      'RAS brings robotics and automation to life through learning, experimentation, and hands-on experiences. From exploring robotics to building confidence through technical activities, the society gives students a space to turn curiosity about machines into practical knowledge.',
    flagships: [
      {
        name: 'ROSPHERE',
        type: 'Robotics Event',
        desc: 'A multi-day RAS event designed to enhance students’ knowledge of robotics.',
      },
      {
        name: 'RAS TECHNICAL ACTIVITIES',
        type: 'Hands-on Learning',
        desc: 'Activities and learning experiences that encourage students to explore robotics, automation, and emerging technologies.',
      },
      {
        name: 'RAS INDUSTRIAL EXPOSURE',
        type: 'Technical Exposure',
        desc: 'Opportunities for students to connect classroom concepts with real-world engineering and technology.',
      },
    ],
    stats: [
      { label: 'Event Duration', val: '4 Days' },
      { label: 'Focus', val: 'Robotics' },
      { label: 'Chapter Support', val: 'RAS Bangalore' },
    ],
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  },


  {
    code: 'WIE',
    society: 'Women in Engineering',
    badge: 'WOMEN IN ENGINEERING',
    accent: '#ec4899',
    festName: 'INSPIRO',
    festTagline: 'Inspiring Ideas. Empowering Futures.',
    description:
      'WIE creates a space where technology, leadership, creativity, and representation come together. Through technical sessions, non-technical initiatives, humanitarian projects, and outreach, WIE encourages students to explore STEM while creating meaningful impact beyond campus.',
    flagships: [
      {
        name: 'INSPIRO',
        type: 'Annual Flagship Fest',
        desc: 'WIE’s annual fest bringing together technical, non-technical, and inspiring initiatives under one platform.',
      },
      {
        name: 'VIGYAAN',
        type: 'Rural Outreach STEM Initiative',
        desc: 'An outreach initiative engaging students from rural areas with STEM, encouraging curiosity and helping them explore possibilities in science and technology.',
      },
    ],
    stats: [
      { label: 'Core Focus', val: 'STEM' },
      { label: 'Outreach', val: 'Vigyaan' },
      { label: 'Flagship Fest', val: 'Inspiro' },
    ],
    bgGradient: 'from-pink-500/10 via-pink-500/5 to-transparent',
  },


  {
    code: 'GRSS',
    society: 'Geoscience & Remote Sensing Society',
    badge: 'GEOSCIENCE & REMOTE SENSING',
    accent: '#a855f7',
    festName: 'GRSS',
    festTagline: 'Exploring Earth From Above',
    description:
      'GRSS opens the door to Earth observation, remote sensing, spatial technologies, and the many ways technology helps us understand our planet. Through technical sessions, industry exposure, and research-oriented activities, students get to look at engineering from a wider perspective.',
    flagships: [
      {
        name: 'THE GRSS WINDOW',
        type: 'Technical Session',
        desc: 'An introductory session exploring GRSS, remote sensing, Earth observation, natural disaster mitigation, sensors, and data processing techniques.',
      },
      {
        name: 'GRSS INDUSTRIAL VISITS',
        type: 'Industrial Exposure',
        desc: 'Technical visits giving students closer exposure to real-world applications of geoscience, remote sensing, and spatial technologies.',
      },
      {
        name: 'SPACE APPLICATIONS VISIT',
        type: 'Technical Visit',
        desc: 'A visit to IIIT Hyderabad that provided students an opportunity to enhance their knowledge in space applications.',
      },
    ],
    stats: [
      { label: 'GRSS Members', val: '93+' },
      { label: 'Previous Members', val: '40' },
      { label: 'Chapter Awards', val: '2' },
    ],
    bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
  },


  {
    code: 'CEDA',
    society: 'Council on Electronic Design Automation',
    badge: 'ELECTRONIC DESIGN AUTOMATION',
    accent: '#3b82f6',
    festName: 'CEDA',
    festTagline: 'A New Chapter in Design Automation',
    description:
      'CEDA is the newest addition to the NISB community. Introduced as a newly formed council, it adds a fresh layer of structure and support to the branch’s growing technical ecosystem and ongoing initiatives.',
    flagships: [
      {
        name: 'CEDA',
        type: 'Newly Formed Council',
        desc: 'NISB’s newly formed Council on Electronic Design Automation, adding a new dimension to the branch’s technical community.',
      },
      {
        name: 'EMERGING INITIATIVES',
        type: 'Technical Community',
        desc: 'A growing space for students interested in electronic design automation and related areas to explore and build together.',
      },
    ],
    stats: [
      { label: 'Status', val: 'New Council' },
      { label: 'Community', val: 'NISB' },
      { label: 'Focus', val: 'EDA' },
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

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-[var(--star-white)] leading-tight">
              SOCIETY <span className="text-[var(--accent)]">FLAGSHIPS</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] max-w-sm">
            Explore the signature annual technical fests, championships, and flagship hosted across NISB societies.
          </p>
        </div>

        {/* Society Selector Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {SOCIETY_FESTS.map((soc) => (
            <button
              key={soc.code}
              onClick={() => setActiveCode(soc.code)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 ${activeCode === soc.code
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
