'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    tag: 'SFG & HFG LABS',
    destinations: 'SFG (Software) • HFG (Hardware)',
    body: 'Peer-to-peer technical circles where students build real-world firmware applications, neural networks, web platforms, and embedded prototypes.',
    details: {
      heading: 'Focus Groups: SFG & HFG',
      subheading: 'Specialized Peer-to-Peer Technical Research Circles',
      overview:
        'NISB Focus Groups operate as internal incubators where students gain hands-on mastery in both software and hardware domains through weekly guided tracks and end-to-end project building.',
      highlights: [
        {
          title: 'SFG — Software Focus Group',
          desc: 'Covers modern Full-Stack web engineering, Deep Learning & Computer Vision architectures, Cloud DevOps pipelines, and competitive algorithmic problem solving.',
          tag: 'Web • AI/ML • Cloud • Algorithms',
        },
        {
          title: 'HFG — Hardware Focus Group',
          desc: 'Hands-on embedded systems with AVR Atmega microcontrollers, Embedded C firmware, KiCAD PCB design, IoT sensor telemetry, and autonomous robotics prototyping.',
          tag: 'AVR Atmega • Embedded C • PCB • IoT',
        },
        {
          title: 'Capstone Project Sprints',
          desc: 'Interdisciplinary teams combine SFG software backends with HFG embedded sensors to deploy complete working IoT/AI prototypes for regional and national competitions.',
          tag: 'Hardware + Software Integration',
        },
      ],
    },
  },
  {
    id: 'industrial-visits',
    title: 'Industrial Visits',
    image: '/WhatsApp Image 2026-08-08 at 22.33.54.jpeg',
    tag: 'INDUSTRY EXPOSURE',
    destinations: 'ISRO • IISc Bangalore • NIGST • Cisco',
    body: 'We conduct regular technical tours exposing students to real-world engineering workflows, satellite manufacturing, and corporate R&D facilities.',
    details: {
      heading: 'Industrial Tours & R&D Visits',
      subheading: 'Direct Technical Exposure to Premier Research Facilities',
      overview:
        'NISB organizes exclusive technical tours providing students first-hand exposure to mission-critical infrastructure, satellite control telemetry, supercomputers, and corporate engineering hubs.',
      highlights: [
        {
          title: 'ISRO Master Control Facility (MCF)',
          desc: 'Exclusive walkthrough of satellite tracking antennae, mission control rooms, and real-time orbital telemetry management systems.',
          tag: 'Satellite Telemetry & Space Systems',
        },
        {
          title: 'IISc Bangalore Supercomputing & Nano Labs',
          desc: 'Deep-dive into high-performance computing clusters, clean rooms, and cutting-edge nano-materials research centers.',
          tag: 'Supercomputing & Nanotechnology',
        },
        {
          title: 'NIGST (National Institute of Geo-informatics)',
          desc: 'Hands-on exposure to Survey of India geospatial mapping facilities, aerial photogrammetry, and LiDAR data pipelines.',
          tag: 'GIS & Earth Observation',
        },
        {
          title: 'Cisco & Infosys R&D Campuses',
          desc: 'Corporate networking labs, enterprise cloud deployment centers, and interacting with principal software architects.',
          tag: 'Enterprise Cloud & Networking',
        },
      ],
    },
  },
  {
    id: 'social-initiatives',
    title: 'Social Initiatives',
    image: '/image copy.png',
    tag: 'COMMUNITY IMPACT',
    destinations: 'Divya Deepa • Ashram Drives • Tech Literacy',
    body: 'Annual outreach visits to ashrams and Divya Deepa, introducing local communities to digital literacy and the practical benefits of modern technology.',
    details: {
      heading: 'Social Initiatives & Outreach',
      subheading: 'WIE-Led Technology Literacy & Community Empowerment',
      overview:
        'Believing in advancing technology for humanity, NISB and IEEE WIE organize annual community outreach initiatives to provide digital literacy, STEM kits, and education drives to underprivileged students.',
      highlights: [
        {
          title: 'Divya Deepa Charitable Trust Visits',
          desc: 'Interactive computer science learning camps, logic puzzles, and digital literacy sessions for young scholars at Divya Deepa.',
          tag: 'WIE Education Outreach',
        },
        {
          title: 'Ashram STEM & Digital Literacy Drives',
          desc: 'Hands-on basic computer navigation, internet safety, and interactive science experiments conducted for community children.',
          tag: 'Community Empowerment',
        },
        {
          title: 'Women in STEM Mentorship Programs',
          desc: 'Dedicated mentorship and career guidance sessions for young girls, inspiring them to pursue engineering and technical sciences.',
          tag: 'Diversity & Inclusion',
        },
      ],
    },
  },
  {
    id: 'weekly-meetups',
    title: 'Weekly Meetups',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    tag: 'PEER LEARNING',
    destinations: 'Tech Syncs • Code Reviews • Project Demos',
    body: 'Weekly collaborative meetups where students brainstorm hackathon ideas, debug code, review research papers, and mentor junior members.',
    details: {
      heading: 'Weekly Technical Meetups',
      subheading: 'Collaborative Problem Solving & Peer Mentorship',
      overview:
        'Every week, NISB members assemble for informal yet intensive technical syncs where ideas transform into competitive hackathon prototypes and collaborative open-source projects.',
      highlights: [
        {
          title: 'Weekly Code Reviews & Debugging Jams',
          desc: 'Peer-to-peer code reviews helping members optimize algorithms, refactor architectures, and troubleshoot tricky bugs together.',
          tag: 'Code Review & Pair Programming',
        },
        {
          title: 'Hackathon Ideation & Pitch Sprints',
          desc: 'Brainstorming competitive problem statements, creating system architecture diagrams, and forming cross-functional hackathon teams.',
          tag: 'Hackathon Preparation',
        },
        {
          title: 'Senior-Junior Mentorship Circles',
          desc: 'Direct guidance from final-year leads on placement preparation, research paper writing, resume building, and open-source contributions.',
          tag: 'Career & Research Guidance',
        },
      ],
    },
  },
];

export default function ActivitiesBentoGrid() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  return (
    <motion.section
      id="activities"
      className="premium-section py-20 bg-[var(--void)] text-[var(--star-white)] relative overflow-hidden border-b border-[var(--border-main)]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
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
            Empowering student engineers through industrial tours, focus research labs, weekly meetups, and social impact drives.
          </motion.p>
        </div>

        {/* 4-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACTIVITIES.map((a) => (
            <motion.div
              key={a.id}
              onClick={() => setSelectedActivity(a)}
              className="group relative rounded-3xl bg-[var(--card-bg)] border border-[var(--border-main)] hover:border-[var(--accent)] overflow-hidden transition-all duration-500 hover:shadow-2xl flex flex-col justify-between min-h-[380px] p-6 cursor-pointer"
              variants={fadeUp}
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
              </div>

              {/* Top Tag */}
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[var(--accent)] px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                  {a.tag}
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
                  <span className="text-base group-hover:translate-x-1 transition-transform">↗</span>
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#090d16] border border-white/20 p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6"
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
