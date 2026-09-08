'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 50, damping: 20 } },
};

interface ActivityItem {
  id: string;
  title: string;
  image: string;
  tag: string;
  destinations: string;
  body: string;
  details: {
    heading: string;
    subheading: string;
    overview: string;
    highlights: { title: string; desc: string; tag?: string }[];
  };
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'focus-groups',
    title: 'Focus Groups',
    image: '/image copy 2.png',
    tag: 'SFG & HFG WORKSHOPS',
    destinations: 'SFG (Software) • HFG (Hardware)',
    body: 'Where curiosity meets code, circuits, and hands-on building. SFG and HFG bring students together to learn, experiment, and turn ideas into working technology.',
    details: {
      heading: 'Focus Groups: SFG & HFG',
      subheading: 'Learn Together. Build Together. Go Beyond.',
      overview:
        'NISB Focus Groups are where students move beyond simply learning technology and start creating with it. Through workshops, hands-on sessions, technical challenges, and project building, SFG and HFG give curious minds a space to explore, experiment, and grow!',
      highlights: [
        {
          title: 'SFG — Software Focus Group',
          desc: 'From writing your first lines of code to exploring emerging technologies, SFG gives students a space to dive into software development, programming, AI/ML, web technologies, and hands-on technical projects. Learn with peers, break things, fix them, and build something better.',
          tag: 'Code • AI/ML • Web • Algorithms',
        },
        {
          title: 'HFG — Hardware Focus Group',
          desc: 'If you like knowing what happens behind the screen, HFG is your playground. Dive into electronics, digital and analog systems, embedded development, microcontrollers, and hands-on hardware projects that turn theory into something you can actually build!',
          tag: 'Circuits • Embedded • Electronics • IoT',
        },
      ],
    },
  },

  {
    id: 'industrial-visits',
    title: 'Industrial Visits',
    image: '/WhatsApp Image 2026-08-08 at 22.33.54.jpeg',
    tag: 'INDUSTRY & R&D EXPOSURE',
    destinations: 'ISRO • IIST & VSSC • NIGST • IISc • NITK • IIIT-H • AT&S',
    body: 'We take learning beyond the classroom through technical visits that expose students to premier space ecosystems, research laboratories, electronics manufacturing, and supercomputing centers.',
    details: {
      heading: 'Industrial Visits',
      subheading: 'See Where Engineering Comes to Life.',
      overview:
        'NISB organizes immersive technical visits that connect students directly with premier national research facilities, space exploration centers, and leading industry environments across India.',
      highlights: [
        {
          title: 'IIST & VSSC, THIRUVANANTHAPURAM',
          desc: "A journey into India's space ecosystem showcasing launch vehicles, satellite technology, and landmark missions. Students explored VSSC's space heritage and IIST's research facilities, including remote sensing, satellite data processing, and CubeSat development.",
          tag: 'Space Applications • Launch Vehicles • Research',
        },
        {
          title: 'NITK, SURATHKAL',
          desc: 'A research-focused visit introducing students to cutting-edge engineering laboratories, academic research facilities, and innovation centers, offering insights into interdisciplinary projects and higher education in engineering.',
          tag: 'Research • Engineering • Innovation',
        },
        {
          title: 'IIIT HYDERABAD',
          desc: 'A visit to IIIT Hyderabad providing exposure to pioneering research in artificial intelligence, robotics, computer vision, data science, and intelligent systems, while showcasing its vibrant innovation and startup ecosystem.',
          tag: 'AI • Research • Innovation',
        },
        {
          title: 'NIGST, HYDERABAD',
          desc: 'An immersive visit focused on geospatial science and remote sensing, introducing students to satellite imagery analysis, GIS mapping, earth observation technologies, and their applications in environmental monitoring and resource management.',
          tag: 'Geospatial • Remote Sensing • Research',
        },
        {
          title: 'UR RAO SATELLITE CENTRE, BENGALURU',
          desc: "A technical visit to one of ISRO's premier satellite development centers, offering students an inside look at spacecraft engineering, satellite design, assembly, testing, and India's cutting-edge space missions.",
          tag: 'Space • Satellite Technology • Research',
        },
        {
          title: 'IISc BANGALORE',
          desc: "An opportunity for students to experience the research environment of one of India's premier institutions and explore interdisciplinary engineering, advanced laboratories, and innovation-driven research beyond the classroom.",
          tag: 'Research • Innovation • Technology',
        },
        {
          title: 'KSRSAC & KSNDMC, BANGALORE',
          desc: 'A technical visit offering practical exposure to geospatial technologies, satellite data, GIS, and remote sensing applications, along with insights into weather monitoring, disaster prediction, and early warning systems for effective disaster management.',
          tag: 'GIS • Remote Sensing • Disaster Management',
        },
        {
          title: 'AT&S INDUSTRIAL VISIT',
          desc: 'A visit to AT&S providing students with first-hand exposure to advanced electronics manufacturing, PCB production, industrial automation, quality control, and professional engineering workflows in a global manufacturing environment.',
          tag: 'Industry • Manufacturing • Engineering',
        },
      ],
    },
  },

  {
    id: 'weekly-meetups',
    title: 'Weekly Meetups',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    tag: 'PEER LEARNING & CODE SERIES',
    destinations: 'ML Series • DSA Series • Web Tech & Linux',
    body: 'Regular technical series where students learn together, explore technologies, code interactively, and build confidence from foundations to real-world workflows.',
    details: {
      heading: 'Technical Meetup Series',
      subheading: 'Hands-on. Interactive. Industry-Relevant.',
      overview:
        'Weekly meetups give NISB members a consistent space to explore technical topics, learn from peers, and strengthen their foundations through guided hands-on coding and problem-solving.',
      highlights: [
        {
          title: 'ML MEETUP SERIES (2026)',
          desc: 'A beginner-to-intermediate machine learning series covering Python for ML, data preprocessing, model building, and real-world AI workflows through interactive coding sessions.',
          tag: 'AI • Machine Learning • Hands-on',
        },
        {
          title: 'DSA MEETUP SERIES (2025)',
          desc: 'Weekly problem-solving sessions focused on strengthening algorithmic thinking, mastering fundamental data structures, and preparing students for coding interviews and contests.',
          tag: 'Data Structures • Algorithms • Problem Solving',
        },
        {
          title: 'WEB TECHNOLOGIES & LINUX SERIES (2024)',
          desc: 'A foundational series introducing students to HTML, CSS, JavaScript, Linux command-line workflows, Git, and essential open-source development practices through practical demonstrations.',
          tag: 'Web Development • Linux • Open Source',
        },
      ],
    },
  },

  {
    id: 'social-initiatives',
    title: 'Social Initiatives',
    image: '/image copy.png',
    tag: 'HUMANITARIAN & OUTREACH',
    destinations:
      'Vigyaan • Vatsalya • Little Joy • School to Satellites • Blood Drives',
    body: 'NISB steps beyond technology to create moments that matter — from rural STEM outreach and space education to spending companionship time with communities that deserve support and love.',
    details: {
      heading: 'Social Initiatives & Humanitarian Outreach',
      subheading: 'Advancing Technology for Humanity. Showing Up for Community.',
      overview:
        'For NISB, engineering is not only about what we build. It is also about the people we build for. Through rural school outreach, companionships at care homes, STEM awareness, and blood donation drives, NISB encourages students to contribute meaningfully beyond the campus.',
      highlights: [
        {
          title: 'VIGYAAN — Rural STEM Outreach',
          desc: 'A social initiative focused on rural outreach, engaging school students with STEM activities while encouraging curiosity and confidence in learning.',
          tag: 'Venue: Govt. High School, Lakshmipuram • Rural STEM',
        },
        {
          title: 'LITTLE JOY, PRERANA, AASHA & VATSALYA',
          desc: 'Community visits that took NISB members to spaces serving different communities, including orphanages and schools for differently abled students, creating opportunities for interaction, learning, and companionship.',
          tag: 'Venue: Shree Bharathi Vriddha Sevashrama • Care & Companionship',
        },
        {
          title: 'School to Satellites',
          desc: 'A two-phase outreach initiative designed to introduce school students to the fascinating world of space technology, beginning with the fundamentals of remote sensing and continuing with an educational visit to ISRO’s U R Rao Satellite Centre and the Jawaharlal Nehru Planetarium.',
          tag: 'Humanitarian & Space Outreach • ISRO URSC',
        },
        {
          title: 'Weekly Community Meetups & Blood Donation Camps',
          desc: 'NISB regularly organizes blood donation camps and weekly volunteer sessions, bringing students together for meaningful service, health awareness, and youth mentorship.',
          tag: 'Blood Donation Drives • Youth Mentorship • Social Impact',
        },
      ],
    },
  },
];

export default function ActivitiesBentoGrid() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.section
      id="activities"
      className="premium-section py-20 bg-[var(--void)] text-[var(--star-white)] relative overflow-hidden border-b border-[var(--border-main)]"
      initial={isMobile ? false : 'hidden'}
      animate={isMobile ? 'show' : undefined}
      whileInView={isMobile ? undefined : 'show'}
      viewport={{ once: true, margin: '250px' }}
      variants={staggerContainer}
    >
      <div className="max-w-[88rem] mx-auto space-y-12 px-4 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-main)]">
          <div>
            <motion.span className="text-xs font-mono uppercase tracking-[0.4em] text-[var(--accent)] font-bold block mb-1" variants={fadeUp}>
              BEYOND THE CLASSROOM
            </motion.span>
            <motion.h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-[var(--star-white)] leading-tight" variants={fadeUp}>
              ALL-ROUND <span className="text-[var(--accent)]">DEVELOPMENT</span>
            </motion.h2>
          </div>
          <motion.p className="text-xs font-mono text-[var(--text-muted)] max-w-sm" variants={fadeUp}>
            Empowering student engineers through industrial visits, technical workshops, weekly meetups and social initiatives.
          </motion.p>
        </div>

        {/* 4-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACTIVITIES.map((a) => (
            <motion.div
              key={a.id}
              onClick={() => setSelectedActivity(a)}
              whileHover={{
                y: -10,
                scale: 1.025,
                transition: { type: 'spring', stiffness: 350, damping: 22 },
              }}
              className="group relative rounded-3xl bg-[var(--card-bg)] border border-[var(--border-main)] hover:border-[var(--accent)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_45px_-10px_var(--accent-glow)] flex flex-col justify-between min-h-[380px] p-6 cursor-pointer"
              variants={fadeUp}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Background Image Container with Gradient Overlay */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-40 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/85 to-transparent" />
                {/* Dynamic Holographic Sheen on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-[var(--accent)]/15 to-transparent transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Top Tag & Corner HUD Marker */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[var(--accent)] px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                  {a.tag}
                </span>
                <span className="text-[10px] font-mono text-[var(--accent)]/40 group-hover:text-[var(--accent)] transition-colors">
                  [+]
                </span>
              </div>

              {/* Bottom Content Container */}
              <div className="space-y-2 relative z-10 pt-16">
                <h3 className="text-2xl font-black uppercase text-[var(--star-white)] tracking-tight group-hover:text-[var(--accent)] transition-colors font-display">
                  {a.title}
                </h3>
                <p className="text-xs font-sans text-[var(--text-muted)] leading-relaxed line-clamp-3">
                  {a.body}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[var(--accent)] font-bold">
                  <span>Click to Expand</span>
                  <span className="text-base group-hover:translate-x-1.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Expandable Modal / Drawer */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* High performance dark backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedActivity(null)}
              className="absolute inset-0 bg-[#000005]/88"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#090d16] border border-white/20 p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6 will-change-transform"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-mono transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Header */}
              <div className="space-y-2 border-b border-white/10 pb-4 pr-12">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--accent)] font-bold">
                  {selectedActivity.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white font-display">
                  {selectedActivity.details.heading}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-white/60">
                  {selectedActivity.details.subheading}
                </p>
              </div>

              {/* Overview */}
              <p className="text-sm font-sans text-white/80 leading-relaxed">
                {selectedActivity.details.overview}
              </p>

              {/* Highlights Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {selectedActivity.details.highlights.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-[var(--accent)]/50 transition-colors"
                  >
                    {h.tag && (
                      <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] px-2 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30">
                        {h.tag}
                      </span>
                    )}
                    <h4 className="text-base font-bold text-white uppercase font-display">
                      {h.title}
                    </h4>
                    <p className="text-xs font-sans text-white/70 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-[var(--accent)] text-white hover:text-black text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
