'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; query: string }[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: "Hello engineer! 👋 I'm **NISBot**, your interactive AI guide to NIE IEEE Student Branch (NISB). How can I assist your journey today?",
    timestamp: 'Just now',
    quickActions: [
      { label: '🏆 Merwin Winners', query: 'Who won the Richard E. Merwin Scholarship?' },
      { label: '🚀 Industrial Visits', query: 'What industrial visits does NISB organize?' },
      { label: '🎉 Fests & Flagships', query: 'Tell me about Ankura and Adroit' },
      { label: '📚 Read Jijnasa & Manas', query: 'Where can I read Jijnasa and Manas?' },
      { label: '🤝 How to Join NISB', query: 'How can I become an IEEE NISB member?' },
    ],
  },
];

// Knowledge base matcher for NISBot
function getBotResponse(query: string): { text: string; actions?: { label: string; query: string }[] } {
  const q = query.toLowerCase();

  if (q.includes('merwin') || q.includes('rem') || q.includes('laureate')) {
    return {
      text: "🏆 **Richard E. Merwin Scholarship (REM) Laureates:**\n\nThe Richard E. Merwin Scholarship is the IEEE Computer Society's premier global student honour! NISB is proud of our 5 distinguished winners:\n\n• **Sriharsha M** — CS Chairperson (2018–19)\n• **Varun Bheemiah** — CS Chairperson (2019–20)\n• **Pranav B** — CS Chairperson (2020–21)\n• **Shreesh Kulkarni** — CS Chairperson (2021–22)\n• **Prerika P** — CS Secretary (2025–26)\n\nAdditionally, **Madhusudan Joshi** (Chairperson 2021–22) was felicitated with the prestigious **IEEE Bangalore Section Student Scholarship**!",
      actions: [
        { label: '🎖️ View Awards Section', query: 'Show me awards' },
        { label: '💻 Computer Society', query: 'Tell me about Computer Society' },
      ],
    };
  }

  if (q.includes('visit') || q.includes('isro') || q.includes('vssc') || q.includes('iisc') || q.includes('nigst')) {
    return {
      text: "🚀 **NISB Industrial & Research Visits:**\n\nNISB organizes immersive technical visits to premier national laboratories and high-tech centers:\n\n1. **IIST & VSSC, Thiruvananthapuram** — Launch vehicles, satellite technology & space heritage.\n2. **UR Rao Satellite Centre (ISRO), Bengaluru** — Satellite assembly, cleanrooms & interplanetary probes.\n3. **IISc Bangalore** — Frontier academic labs and interdisciplinary engineering research.\n4. **NIGST, Hyderabad** — Geospatial analytics, satellite imaging & remote sensing.\n5. **IIIT Hyderabad** — AI, robotics, computer vision & startup innovation.\n6. **NITK, Surathkal** — Advanced engineering labs & higher education insights.\n7. **KSRSAC & KSNDMC, Bangalore** — Geospatial data, GIS & disaster prediction systems.\n8. **AT&S Industrial Visit** — High-end PCB manufacturing and global electronics engineering workflows.",
      actions: [
        { label: '🌐 All-Round Development', query: 'What activities does NISB organize?' },
        { label: '🛰️ School to Satellites', query: 'What is School to Satellites?' },
      ],
    };
  }

  if (q.includes('ankura') || q.includes('adroit') || q.includes('fest') || q.includes('rubix') || q.includes('illume') || q.includes('rosphere')) {
    return {
      text: "🎉 **Signature Flagship Fests of NISB:**\n\n• **ANKURA & ADROIT (NISB)**: Our odd and even semester student branch flagship fests featuring technical hackathons, design challenges, and student networking!\n• **RUBIX (CS)**: Multi-day tech fest with coding sprints, web challenges & open-source leagues.\n• **ILLUME (CASS)**: Premier circuits and electronics fest diving into VLSI and embedded systems.\n• **ROSPHERE (RAS)**: High-octane robotics, automation, and intelligent hardware arena.",
      actions: [
        { label: '🗓️ Upcoming Events', query: 'What are upcoming events?' },
        { label: '🤝 How to Join', query: 'How can I become an IEEE NISB member?' },
      ],
    };
  }

  if (q.includes('jijnasa') || q.includes('manas') || q.includes('magazine') || q.includes('publication') || q.includes('flip')) {
    return {
      text: "📚 **Publications & 3D Flipbook Reader:**\n\n• **MANAS**: NISB's half-yearly newsletter chronicling branch milestones, social outreach, and member achievements (2022–26 archives).\n• **JIJNASA**: Annual flagship magazine celebrating 25+ years of engineering thought leadership, technical papers, and creative writing (Vol. 8 to Vol. 11).\n\n💡 *Tip: Scroll to the Publications section and click any magazine card to open our built-in 3D Book Flip Reader without leaving the website!*",
      actions: [
        { label: '📖 Open Publications', query: 'Show me publications' },
        { label: '🎙️ Tech N Tales Podcast', query: 'What podcasts does NISB have?' },
      ],
    };
  }

  if (q.includes('join') || q.includes('member') || q.includes('register') || q.includes('fee')) {
    return {
      text: "🤝 **Joining IEEE NISB:**\n\nBecoming an IEEE member unlocks:\n• Access to global IEEE digital libraries and conferences.\n• Direct participation in NISB Focus Groups (SFG for software, HFG for hardware).\n• Subsidized entry to national industrial tours (ISRO, IISc, NIGST).\n• Leadership opportunities across CS, CASS, RAS, GRSS, and WIE chapters.\n• Eligibility for global scholarships including Richard E. Merwin!\n\n👉 Check out the 'Join NISB' button in the navbar to fill the current membership drive form!",
      actions: [
        { label: '💼 Core Team', query: 'Who is on the team?' },
        { label: '🎙️ Tech N Tales', query: 'What podcasts does NISB have?' },
      ],
    };
  }

  if (q.includes('society') || q.includes('chapter') || q.includes('cass') || q.includes('cs') || q.includes('ras') || q.includes('grss') || q.includes('wie')) {
    return {
      text: "⚡ **The 5 IEEE NISB Societies & Affinity Groups:**\n\n1. **Computer Society (CS)**: Algorithmic leagues, web dev, and the Rubix fest.\n2. **Circuits & Systems Society (CASS)**: Core electronics, PCB design, and Illume.\n3. **Robotics & Automation Society (RAS)**: Autonomous machines and Rosphere.\n4. **Geoscience & Remote Sensing (GRSS)**: Satellite observation and ISRO visits.\n5. **Women in Engineering (WIE)**: Empowerment, leadership, and AVR meetups.",
      actions: [
        { label: '🎉 Society Fests', query: 'Tell me about Ankura and Adroit' },
        { label: '🚀 Industrial Visits', query: 'What industrial visits does NISB organize?' },
      ],
    };
  }

  if (q.includes('podcast') || q.includes('video') || q.includes('youtube') || q.includes('nisbit') || q.includes('blog')) {
    return {
      text: "🎙️ **Podcasts, Videos & Publications:**\n\n• **Tech N Tales**: NISB's official podcast series on YouTube covering technology journeys and candid student stories.\n• **NISBits Playlist**: High-energy video shorts and event recaps on YouTube!\n• **NISBlogs on Substack**: Weekly deep-dives into distributed databases, sports tech, AI ethics, and engineering wisdom (`nisb.substack.com`).",
      actions: [
        { label: '▶️ Watch on YouTube', query: 'Where is YouTube link?' },
        { label: '📰 Read Substack', query: 'Where are the blogs?' },
      ],
    };
  }

  // Default fallback answer
  return {
    text: "That's an interesting question! NISB has been leading engineering curiosity for over 25 years. You can explore our events feed, check out the 3D magazine flip reader, review our 8 industrial tours, or ask me about our societies and scholarships!",
    actions: [
      { label: '🏆 Merwin Winners', query: 'Who won the Richard E. Merwin Scholarship?' },
      { label: '🚀 Industrial Visits', query: 'What industrial visits does NISB organize?' },
      { label: '🎉 Fests', query: 'Tell me about Ankura and Adroit' },
    ],
  };
}

export default function NISBotCornerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [speechBubbleText, setSpeechBubbleText] = useState("Hey! I'm NISBot 🤖 Ask me anything!");
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Periodic speech bubble reminder
  useEffect(() => {
    const hints = [
      "Hey! I'm NISBot 🤖 Ask me anything!",
      'Curious about ISRO & VSSC visits?',
      'Ask me who won the Merwin Scholarship! 🏆',
      'Need info on Ankura & Adroit fests? 🎉',
      'Read Jijnasa & Manas in 3D flipbook! 📖',
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % hints.length;
      setSpeechBubbleText(hints[idx]);
      setShowSpeechBubble(true);
    }, 18000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate intelligent bot typing response
    setTimeout(() => {
      const resp = getBotResponse(query);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: resp.text,
        timestamp: 'Just now',
        quickActions: resp.actions,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99998] flex flex-col items-end pointer-events-auto">
      {/* ── INTERACTIVE CHATBOT WINDOW ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="w-[92vw] sm:w-[380px] md:w-[410px] h-[540px] max-h-[82vh] bg-[#070b16]/95 border border-white/20 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col overflow-hidden mb-3"
          >
            {/* Header with Official NISB Logo */}
            <div className="px-5 py-3.5 border-b border-white/10 bg-[#050811] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* NISB Logo + Glowing Status Beacon */}
                <div className="relative">
                  <img
                    src="/nisb-logo-white.png"
                    alt="NISB"
                    className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_var(--accent-glow)]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#050811] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-white font-display flex items-center gap-1.5">
                    <span>NISBot</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/40">
                      AI 2.0
                    </span>
                  </h3>
                  <p className="text-[10px] font-mono text-white/50">Online • Branch Knowledge Core</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMessages(INITIAL_MESSAGES)}
                  title="Reset Conversation"
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center text-xs transition-colors"
                >
                  ↺
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize Chat"
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center text-xs transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-sans text-xs" style={{ scrollbarWidth: 'thin' }}>
              {messages.map((m) => {
                const isBot = m.sender === 'bot';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-md ${
                        isBot
                          ? 'bg-white/[0.07] border border-white/10 text-white/90 rounded-tl-sm'
                          : 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-medium rounded-tr-sm'
                      }`}
                    >
                      {/* Markdown-styled bold & line breaks rendering */}
                      <div className="space-y-1 whitespace-pre-line">
                        {m.text.split('**').map((chunk, idx) =>
                          idx % 2 === 1 ? (
                            <strong key={idx} className="text-white font-bold">
                              {chunk}
                            </strong>
                          ) : (
                            chunk
                          )
                        )}
                      </div>
                    </div>

                    {/* Quick action buttons if available */}
                    {isBot && m.quickActions && m.quickActions.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-1 max-w-[95%]">
                        {m.quickActions.map((qa, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSendMessage(qa.query)}
                            className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 hover:bg-[var(--accent)] hover:text-black border border-white/15 text-white/80 transition-all active:scale-95"
                          >
                            {qa.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-mono bg-white/5 px-3 py-2 rounded-2xl w-fit border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                  <span>NISBot is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-white/10 bg-[#050811] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about events, visits, Merwin, join..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-xl bg-[var(--accent)] hover:bg-sky-400 disabled:opacity-40 text-black flex items-center justify-center font-bold transition-transform active:scale-95 shrink-0"
              >
                ➔
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BIG HOVERING NISBOT WITH FLOATING PHYSICS ── */}
      <div className="relative flex items-center">
        {/* Floating Speech Bubble Hint */}
        <AnimatePresence>
          {!isOpen && showSpeechBubble && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.9 }}
              className="absolute right-20 bottom-3 hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#090e1c] border border-[var(--accent)]/50 text-white text-xs font-mono shadow-2xl whitespace-nowrap"
            >
              <span>{speechBubbleText}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeechBubble(false);
                }}
                className="text-white/40 hover:text-white text-[10px] ml-1"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Big Interactive Hovering NISBot Button */}
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasUnread(false);
            setShowSpeechBubble(false);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative group p-1 focus:outline-none"
          aria-label="Open NISBot AI Chat"
        >
          {/* Cyber Thruster Ambient Particle Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/30 via-cyan-500/30 to-blue-500/30 blur-lg group-hover:blur-xl transition-all animate-pulse" />

          {/* NISBot Chassis Shell */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-br from-[#0c1426] to-[#040710] border-2 border-[var(--accent)] shadow-[0_10px_35px_rgba(6,182,212,0.45)] flex flex-col items-center justify-center overflow-hidden">
            {/* Holographic Visor Reflection */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

            {/* Robot Antenna with Blinking LED */}
            <div className="absolute -top-0.5 w-1 h-2 bg-white/40 rounded-full flex items-start justify-center">
              <span className="w-2 h-2 -mt-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-ping" />
            </div>

            {/* Glowing Cybernetic Visor Face */}
            <div className="w-10 h-5.5 rounded-xl bg-black/80 border border-cyan-400/60 flex items-center justify-around px-1.5 shadow-inner">
              {/* Left Eye */}
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_#38bdf8] group-hover:scale-115 transition-transform" />
              {/* Right Eye */}
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_#38bdf8] group-hover:scale-115 transition-transform" />
            </div>

            {/* NISB Mini Chest Badge */}
            <span className="text-[8px] font-mono font-black text-white/80 tracking-widest mt-1">
              NISB
            </span>

            {/* Ionization Thruster Glow Base */}
            <div className="absolute bottom-0 inset-x-2 h-1 bg-cyan-400/80 rounded-full blur-[2px]" />
          </div>

          {/* Unread Alert Dot */}
          {hasUnread && !isOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-black animate-bounce shadow-md" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
