'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import BookFlipReaderModal, { PublicationEdition } from './BookFlipReaderModal';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 50, damping: 20 } },
};

interface PublicationItem {
  id: string;
  title: string;
  subtitle: string;
  currentEditionId: string;
  cover: string;
  desc: string;
  editions: PublicationEdition[];
}

const PUBLICATIONS_DATA: PublicationItem[] = [
  {
    id: 'manas',
    title: 'MANAS',
    subtitle: 'NISB Half-Yearly Newsletter',
    currentEditionId: 'manas-2026',
    cover: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/Manas%2026.png',
    desc: "A vibrant compilation of NISB's technical workshops, social initiatives, member achievements, and memorable moments from the first half of the year.",
    editions: [
      {
        id: 'manas-2026',
        title: 'MANAS',
        edition: '2025–26 Edition',
        subtitle: 'Vol. 14 • IEEE NISB Half-Yearly Newsletter',
        coverImage: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/Manas%2026.png',
        pdfUrl: 'https://drive.google.com/file/d/1IVuRX4ufSidQTY7JNqsXEw8h_bmfeoib/view',
        driveEmbedUrl: 'https://drive.google.com/file/d/1IVuRX4ufSidQTY7JNqsXEw8h_bmfeoib/preview',
        year: '2025–26',
        pages: [
          {
            pageNumber: 1,
            section: 'EDITORIAL ADDRESS',
            title: 'Welcome to MANAS 2025–26',
            content:
              'From hands-on technical symposiums to deep community outreach drives, the first half of this academic year has been defined by boundless volunteer energy. MANAS brings together the stories, the people, and the engineering breakthroughs that continue to build NISB’s 25-year legacy.',
          },
          {
            pageNumber: 2,
            section: 'BRANCH HIGHLIGHTS',
            title: 'Record Engineering Vitality',
            content:
              'Over 80+ dynamic workshops, bootcamps, and technical visits across ISRO URSC, NIGST, and IIST. Our student branch chapters under CS, CASS, RAS, GRSS, and WIE saw record participant turnout and impactful peer-to-peer mentorship across campus.',
          },
          {
            pageNumber: 3,
            section: 'STUDENT SPOTLIGHT',
            title: 'Laureates & Distinction',
            content:
              'Honouring our student leaders felicitated with regional and global IEEE honours, including Richard E. Merwin Scholarship laureates and IEEE Bangalore Section Student Scholarships.',
          },
          {
            pageNumber: 4,
            section: 'LOOKING AHEAD',
            title: 'Upcoming Fests & Symposia',
            content:
              'Gear up for Ankura, Adroit, Rubix, and Rosphere. New horizons in quantum computing, edge robotics, and satellite remote sensing await!',
          },
        ],
      },
      {
        id: 'manas-2025',
        title: 'MANAS',
        edition: '2024–25 Edition',
        subtitle: 'Vol. 13 • IEEE NISB Newsletter',
        coverImage: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/Manas%2026.png',
        pdfUrl: 'https://drive.google.com/file/d/1IVuRX4ufSidQTY7JNqsXEw8h_bmfeoib/view',
        driveEmbedUrl: 'https://drive.google.com/file/d/1IVuRX4ufSidQTY7JNqsXEw8h_bmfeoib/preview',
        year: '2024–25',
        pages: [
          {
            pageNumber: 1,
            section: 'CHAIRPERSON NOTE',
            title: 'MANAS 2024–25: Year of Innovation',
            content:
              'Celebrating large student branch excellence and the collaborative spirit of NISB. Over 400 active members and groundbreaking circuit design bootcamps.',
          },
          {
            pageNumber: 2,
            section: 'TECHNICAL VISITS',
            title: 'Exploring ISRO & NIGST',
            content:
              'Field reports from student delegations exploring satellite assembly, cleanroom environments, and earth observation technologies in Bengaluru and Hyderabad.',
          },
        ],
      },
      {
        id: 'manas-2024',
        title: 'MANAS',
        edition: '2023–24 Edition',
        subtitle: 'Vol. 12 • IEEE NISB Newsletter',
        coverImage: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/Manas%2026.png',
        pdfUrl: 'https://drive.google.com/file/d/1IVuRX4ufSidQTY7JNqsXEw8h_bmfeoib/view',
        driveEmbedUrl: 'https://drive.google.com/file/d/1IVuRX4ufSidQTY7JNqsXEw8h_bmfeoib/preview',
        year: '2023–24',
        pages: [
          {
            pageNumber: 1,
            section: 'ANNUAL CHRONICLE',
            title: 'MANAS 2023–24: Breaking Frontiers',
            content:
              'A retrospective look at technical symposia, blood donation drives, Vigyaan rural outreach, and hackathons conducted throughout the year.',
          },
        ],
      },
      {
        id: 'manas-2023',
        title: 'MANAS',
        edition: '2022–23 Edition',
        subtitle: 'Vol. 11 • Silver Jubilee Retrospective',
        coverImage: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/Manas%2026.png',
        pdfUrl: 'https://drive.google.com/file/d/1IVuRX4ufSidQTY7JNqsXEw8h_bmfeoib/view',
        driveEmbedUrl: 'https://drive.google.com/file/d/1IVuRX4ufSidQTY7JNqsXEw8h_bmfeoib/preview',
        year: '2022–23',
        pages: [
          {
            pageNumber: 1,
            section: 'LEGACY EDITION',
            title: '25 Years of Engineering Excellence',
            content:
              'Special commemorative edition profiling past chairpersons, alumni in leading global tech companies, and foundational branch milestones.',
          },
        ],
      },
    ],
  },
  {
    id: 'jijnasa',
    title: 'JIJNASA',
    subtitle: 'NISB Annual Flagship Magazine',
    currentEditionId: 'jijnasa-vol11',
    cover: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/JijnasaVol11frontcover.png',
    desc: 'The annual flagship magazine celebrating 25+ years of NISB engineering excellence, thought leadership, scientific research, and creative writing.',
    editions: [
      {
        id: 'jijnasa-vol11',
        title: 'JIJNASA',
        edition: 'Vol. 11 Flagship',
        subtitle: 'Annual Engineering & Science Anthology',
        coverImage: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/JijnasaVol11frontcover.png',
        pdfUrl: 'https://tinyurl.com/JIJNASA-2025',
        driveEmbedUrl: 'https://drive.google.com/file/d/1sB4l_n3mYqQ45_pY_18vjW_H37mF04K9/preview',
        year: 'Vol. 11 (2025)',
        pages: [
          {
            pageNumber: 1,
            section: 'FOREWORD',
            title: 'JIJNASA: The Spirit of Inquiry',
            content:
              'Jijnasa — the Sanskrit word for the desire to know and understand. Vol. 11 brings together exploratory research papers, student creative writing, technology deep-dives, and technical essays spanning generative AI, neuromorphic computing, and aerospace systems.',
          },
          {
            pageNumber: 2,
            section: 'TECH ANTHOLOGY',
            title: 'The Edge of Silicon & Space',
            content:
              'Featuring student articles on ISRO launch vehicle dynamics, open-source LLM architectures, modern VLSI physical design, and robotics in planetary exploration.',
          },
          {
            pageNumber: 3,
            section: 'FACULTY & ALUMNI INSIGHTS',
            title: 'Perspectives Across Decades',
            content:
              'Reflections and career insights from distinguished NISB alumni working across Google, Qualcomm, Apple, ISRO, and leading research universities worldwide.',
          },
          {
            pageNumber: 4,
            section: 'CREATIVE CORNER',
            title: 'Science, Art & Human Stories',
            content:
              'Poetry, technical illustrations, photo essays, and cultural chronicles created by NIE students across departments and societies.',
          },
        ],
      },
      {
        id: 'jijnasa-vol10',
        title: 'JIJNASA',
        edition: 'Vol. 10 (2024)',
        subtitle: 'Decade Commemorative Issue',
        coverImage: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/JijnasaVol11frontcover.png',
        pdfUrl: 'https://tinyurl.com/JIJNASA-2025',
        driveEmbedUrl: 'https://drive.google.com/file/d/1sB4l_n3mYqQ45_pY_18vjW_H37mF04K9/preview',
        year: 'Vol. 10 (2024)',
        pages: [
          {
            pageNumber: 1,
            section: 'VOLUME 10 SPECIAL',
            title: 'A Decade of Intellectual Curiosity',
            content:
              'Reviewing 10 editions of thought-provoking science and engineering literature authored by the vibrant students of NISB.',
          },
        ],
      },
      {
        id: 'jijnasa-vol9',
        title: 'JIJNASA',
        edition: 'Vol. 9 (2023)',
        subtitle: 'Pioneering Research Papers',
        coverImage: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/JijnasaVol11frontcover.png',
        pdfUrl: 'https://tinyurl.com/JIJNASA-2025',
        driveEmbedUrl: 'https://drive.google.com/file/d/1sB4l_n3mYqQ45_pY_18vjW_H37mF04K9/preview',
        year: 'Vol. 9 (2023)',
        pages: [
          {
            pageNumber: 1,
            section: 'PAPERS & PERSPECTIVES',
            title: 'Next-Gen Computing & Smart Grids',
            content:
              'Features student essays on sustainable power distribution, automated drone swarms, and natural language processing.',
          },
        ],
      },
      {
        id: 'jijnasa-vol8',
        title: 'JIJNASA',
        edition: 'Vol. 8 (2022)',
        subtitle: 'Emergence of Autonomous Systems',
        coverImage: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/images/JijnasaVol11frontcover.png',
        pdfUrl: 'https://tinyurl.com/JIJNASA-2025',
        driveEmbedUrl: 'https://drive.google.com/file/d/1sB4l_n3mYqQ45_pY_18vjW_H37mF04K9/preview',
        year: 'Vol. 8 (2022)',
        pages: [
          {
            pageNumber: 1,
            section: 'AUTONOMOUS FRONTIER',
            title: 'Vol. 8 Engineering Journal',
            content:
              'Dedicated to the emerging applications of robotics, computer vision, and machine intelligence in daily engineering practice.',
          },
        ],
      },
    ],
  },
];

export default function PublicationsSection() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeReaderPub, setActiveReaderPub] = useState<PublicationItem | null>(null);

  return (
    <>
      <motion.section
        id="publications"
        className="premium-section py-12 md:py-20"
        initial={isMobile ? false : 'hidden'}
        animate={isMobile ? 'show' : undefined}
        whileInView={isMobile ? undefined : 'show'}
        viewport={{ once: true, margin: '250px' }}
        variants={staggerContainer}
      >
        <motion.p className="section-tag-center" variants={fadeUp}>
          Knowledge Archives
        </motion.p>
        <motion.h2
          className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-center text-white mb-10 leading-tight font-display"
          variants={fadeUp}
        >
          Publications &amp; Magazines
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {PUBLICATIONS_DATA.map((pub) => (
            <motion.div
              key={pub.title}
              onClick={() => setActiveReaderPub(pub)}
              className="group relative rounded-3xl bg-[#09090d] border border-white/[0.08] hover:border-[var(--accent)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row cursor-pointer"
              variants={fadeUp}
            >
              {/* Magazine Cover Container */}
              <div className="relative w-full sm:w-1/2 aspect-[3/4] sm:aspect-auto overflow-hidden bg-black/60 p-6 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-white/5">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none" />

                <img
                  src={pub.cover}
                  alt={`${pub.title} Magazine Cover`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain rounded-xl shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Edition Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/90 font-bold">
                  {pub.editions[0].edition}
                </div>

                {/* In-built Reader Prompt Tag */}
                <div className="absolute bottom-4 inset-x-4 text-center py-1.5 px-3 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[10px] font-mono text-[var(--accent)] font-bold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  📖 Click to Open 3D Flip Reader
                </div>
              </div>

              {/* Publication Info */}
              <div className="w-full sm:w-1/2 p-6 md:p-8 flex flex-col justify-between relative z-10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] font-bold">
                    {pub.subtitle}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-1 group-hover:text-[var(--accent)] transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-3 leading-relaxed font-sans">
                    {pub.desc}
                  </p>

                  {/* Previous Editions Quick Pills */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest block">
                      ARCHIVE EDITIONS:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {pub.editions.map((ed) => (
                        <span
                          key={ed.id}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/80 group-hover:border-white/20"
                        >
                          {ed.year}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white group-hover:text-[var(--accent)] flex items-center gap-2 transition-colors">
                    Open 3D Flip Reader →
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/40 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black flex items-center justify-center transition-all duration-300">
                    <svg className="w-4 h-4 transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Interactive 3D Book Flip Reader Modal */}
      <BookFlipReaderModal
        isOpen={Boolean(activeReaderPub)}
        onClose={() => setActiveReaderPub(null)}
        publication={activeReaderPub}
      />
    </>
  );
}
