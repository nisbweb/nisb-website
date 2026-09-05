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
    tag: 'SFG & HFG Workshops',
    destinations: 'SFG (Software) • HFG (Hardware)',
    body: 'Where curiosity meets code, circuits, and a whole lot of building. SFG and HFG bring students together to learn, experiment, and turn ideas into working technology!',
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
        {
          title: 'From Ideas to Prototypes',
          desc: 'Focus Groups encourage students to collaborate, experiment across domains, and take their ideas from a sketch or concept to something that actually works!',
          tag: 'Build • Experiment • Collaborate',
        },
      ],
    },
  },

  {
    id: 'industrial-visits',
    title: 'Industrial Visits',
    image: '/WhatsApp Image 2026-08-08 at 22.33.54.jpeg',
    tag: 'INDUSTRY EXPOSURE',
    destinations: 'ISRO • IISc Bangalore • NIGST • AT&S • IIIT Hyderabad',
    body: 'We take learning beyond the classroom through technical visits that expose students to real-world engineering, research, manufacturing, and emerging technologies.',
    details: {
      heading: 'Industrial Tours & R&D Visits',
      subheading: 'See Where Engineering Comes to Life.',
      overview:
        'NISB organizes technical visits that give students first-hand exposure to research institutions, engineering facilities, and industry environments. From space applications and geoscience to advanced research and manufacturing, these experiences help connect classroom concepts with the real world.',
      highlights: [
        {
          title: 'ISRO',
          desc: 'Technical exposure to one of India’s leading space and research organizations, giving students a closer look at engineering in the space domain.',
          tag: 'Space • Engineering • Research',
        },
        {
          title: 'IISc Bangalore',
          desc: 'An opportunity for students to experience the research environment of one of India’s premier institutions and explore engineering beyond the classroom.',
          tag: 'Research • Innovation • Technology',
        },
        {
          title: 'NIGST',
          desc: 'Exposure to geospatial technologies, remote sensing, and the applications of engineering in understanding and mapping our world.',
          tag: 'GIS • Remote Sensing • Geospatial',
        },
        {
          title: 'AT&S & Industry Visits',
          desc: 'Visits to industry environments that help students understand how engineering concepts translate into real-world products, processes, and professional workflows.',
          tag: 'Industry • Manufacturing • Engineering',
        },
        {
          title: 'IIIT Hyderabad',
          desc: 'A technical visit that provided students an opportunity to enhance their knowledge in space applications and explore research-oriented learning.',
          tag: 'Space Applications • Research',
        },
      ],
    },
  },

  {
    id: 'technical-workshops',
    title: 'Workshops & Tech Talks',
    image: '/image copy 3.png',
    tag: 'TECHNICAL LEARNING',
    destinations: 'Workshops • Tech Talks • Skill Building',
    body: 'From Go and MATLAB to cryptography and cybersecurity, NISB creates spaces to pick up technologies, explore new ideas, and learn from people who know their stuff!',
    details: {
      heading: 'Workshops, Talks & Technical Sessions',
      subheading: 'Learn Something New. Then Build With It.',
      overview:
        'NISB’s technical sessions cover a wide range of technologies and ideas, giving students opportunities to step outside their regular coursework and explore tools, concepts, and domains that spark their curiosity.',
      highlights: [
        {
          title: 'Hands-on Technology Workshops',
          desc: 'Workshops exploring Golang, MATLAB, MicroPython, Streamlit, cryptography, and other practical technologies give students an opportunity to learn by doing.',
          tag: 'Golang • MATLAB • MicroPython • Streamlit',
        },
        {
          title: 'Tech Talks',
          desc: 'Expert-led and peer-driven sessions introduce students to evolving areas of technology, including blockchain and cybersecurity.',
          tag: 'Blockchain • Cybersecurity • Emerging Tech',
        },
        {
          title: 'Engineers COVID Paradigm',
          desc: 'An online webinar that brought students together for conversations and learning during the changing landscape created by the COVID-19 pandemic.',
          tag: 'Webinar • Engineering • Community',
        },
        {
          title: 'Debate Competitions',
          desc: 'Debate competitions conducted as part of Inspiro ’20 and Inspiro ’22 created a platform for students to think critically, articulate ideas, and engage with different perspectives.',
          tag: 'Inspiro • Debate • Critical Thinking',
        },
      ],
    },
  },

  {
    id: 'weekly-meetups',
    title: 'Weekly Meetups',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    tag: 'PEER LEARNING',
    destinations: 'Python • AVR Programming • Technical Discussions',
    body: 'Regular meetups where students learn together, explore technologies, discuss ideas, and build confidence one session at a time.',
    details: {
      heading: 'Weekly Technical Meetups',
      subheading: 'Small Sessions. Big Learning.',
      overview:
        'Weekly meetups give NISB members a consistent space to explore technical topics, learn from peers, and strengthen their foundations. From programming basics to embedded systems, the sessions encourage curiosity through regular, accessible learning.',
      highlights: [
        {
          title: 'Python Weekly Meetups',
          desc: 'Regular Python-focused sessions helping students build programming foundations and gradually become more comfortable solving problems with code.',
          tag: 'Python • Programming • Foundations',
        },
        {
          title: 'Introduction to Python',
          desc: 'Beginner-friendly sessions introducing students to Python concepts and giving them a starting point for their programming journey.',
          tag: 'Python • Beginners • Coding',
        },
        {
          title: 'WIE Weekly Meetup — AVR Programming',
          desc: 'A WIE weekly meetup introducing students to AVR programming and giving them an opportunity to explore embedded systems through hands-on learning.',
          tag: 'WIE • AVR • Embedded Systems',
        },
      ],
    },
  },

  {
    id: 'social-initiatives',
    title: 'Humanitarian Activities',
    image: '/image copy.png',
    tag: 'COMMUNITY IMPACT',
    destinations:
      'Vigyaan • Dhriti • Blood Donation • Vatsalya • Community Visits',
    body: 'NISB steps beyond technology to create moments that matter — from STEM outreach and blood donation drives to spending time with communities that deserve to be heard, supported, and remembered.',
    details: {
      heading: 'Humanitarian Activities & Outreach',
      subheading: 'Advancing Technology for Humanity. Showing Up for Community.',
      overview:
        'For NISB, engineering is not only about what we build. It is also about the people we build for. Through outreach initiatives, social visits, STEM education, blood donation drives, and moments of companionship, NISB encourages students to contribute beyond the campus and create meaningful human connections.',
      highlights: [
        {
          title: 'VIGYAAN — Rural STEM Outreach',
          desc: 'A social initiative focused on rural outreach, engaging school students with science, technology, and STEM activities while encouraging curiosity and confidence in learning.',
          tag: 'Rural Outreach • STEM • Education',
        },
        {
          title: 'DHRITI — Social Initiative',
          desc: 'A community-focused initiative similar in spirit to Vigyaan, creating opportunities for students to step outside the classroom and engage meaningfully with the wider community.',
          tag: 'Community • Outreach • Impact',
        },
        {
          title: 'Blood Donation Camps',
          desc: 'NISB has organized blood donation camps in 2021, 2022, and 2024, bringing students together for a simple act of service that can make a very real difference.',
          tag: '2021 • 2022 • 2024 • Social Service',
        },
        {
          title: 'LITTLE JOY, PRERANA & AASHA',
          desc: 'Community visits that took NISB members to spaces serving different communities, including orphanages, schools for differently abled students, and Samarthanam, creating opportunities for interaction, learning, and companionship.',
          tag: 'Community Visits • Inclusion • Companionship',
        },
        {
          title: 'VATSALYA',
          desc: 'A social initiative centered around spending meaningful time with residents of an old age home — not simply as visitors, but as companions, sharing conversations, presence, and a little warmth.',
          tag: 'Old Age Home • Companionship • Community',
        },
        {
          title: 'WIE & STEM Outreach',
          desc: 'Through WIE-led initiatives, NISB creates opportunities for young students to discover STEM, ask questions, and imagine possibilities for their futures.',
          tag: 'WIE • STEM • Empowerment',
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
