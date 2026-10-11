"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  FolderLock, 
  Zap,
  Globe,
  Rocket,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Award,
  X,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AboutPage() {
  const [selectedLeader, setSelectedLeader] = useState<any>(null);
  const { toast } = useToast();

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && selectedLeader) {
      navigator.clipboard.writeText(`${window.location.origin}/about#${selectedLeader.name.replace(/\s+/g, '-').toLowerCase()}`);
      toast("Profile link copied to clipboard!", "success");
    }
  };

  const stats = [
    { value: "$12M+", label: "Capital Deployed", icon: <TrendingUp className="w-5 h-5" /> },
    { value: "350+", label: "Vested SaaS Buyouts", icon: <Globe className="w-5 h-5" /> },
    { value: "4.8/5", label: "Broker Satisfaction", icon: <Award className="w-5 h-5" /> },
    { value: "< 4 Hrs", label: "Avg Audit Time", icon: <Zap className="w-5 h-5" /> }
  ];

  const corePillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#00FF85]" />,
      title: "Ironclad Due Diligence",
      desc: "Every listing's repository goes through automated testing, static security scanning, and human architect review before mapping to the catalog."
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#0080FF]" />,
      title: "AI Valuation Multipliers",
      desc: "Our real-time broker engine runs comparative revenue calculations and multiples checks to ensure fair valuation that actually closes fast."
    },
    {
      icon: <FolderLock className="w-6 h-6 text-purple-500" />,
      title: "Secure Digital Escrow",
      desc: "All source files, databases, credentials, and payment details are loaded into an encrypted staging folder, transferring safely upon payout."
    }
  ];

  const leaders = [
    {
      name: "Hanson Peprah",
      role: "Co-Founder & CEO",
      bio: "Former M&A Director at a top-tier tech private equity firm. Hanson saw the friction in micro-SaaS acquisitions and built Digital Fortuna Computing to automate trust.",
      image: "/images/founder_1.jpg",
      details: [
        "Led over $400M in tech acquisitions before founding Digital Fortuna Computing.",
        "Passionate about democratizing exit opportunities for solo founders."
      ],
      academics: [
        { degree: "MBA", institution: "Stanford Graduate School of Business", year: "2019" },
        { degree: "BSc Computer Science", institution: "Ashesi University", year: "2014" }
      ],
      achievements: [
        { title: "Forbes 30 Under 30", category: "Finance" },
        { title: "$400M+ M&A Volume", category: "Transactions" }
      ],
      social: "linkedin.com/in/hansonpeprah"
    },
    {
      name: "Mei Lin",
      role: "Co-Founder & CTO",
      bio: "Ex-Stripe Staff Engineer. Mei architected our proprietary AI due-diligence engine and the cryptographically secure escrow vault.",
      image: "/images/founder_2.jpg",
      details: [
        "Core contributor to several major open-source infrastructure projects.",
        "Advocates for female engineers in high-performance computing."
      ],
      academics: [
        { degree: "MSc Computer Science", institution: "MIT", year: "2018" },
        { degree: "BSc Software Engineering", institution: "University of Waterloo", year: "2016" }
      ],
      achievements: [
        { title: "3 Patents", category: "Distributed Ledger Escrow" },
        { title: "Stripe Eng Excellence", category: "Engineering" }
      ],
      social: "twitter.com/meilin_code"
    }
  ];

  const currentIndex = selectedLeader ? leaders.findIndex(l => l.name === selectedLeader.name) : -1;
  
  const handlePrev = () => {
    if (currentIndex > -1) {
      setSelectedLeader(leaders[(currentIndex - 1 + leaders.length) % leaders.length]);
    }
  };

  const handleNext = () => {
    if (currentIndex > -1) {
      setSelectedLeader(leaders[(currentIndex + 1) % leaders.length]);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24 relative overflow-x-hidden">
      {/* Ambient background lighting */}
      <div className="fixed top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#00FF85]/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#0080FF]/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay z-0"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-32">
        
        {/* 1. HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto space-y-8 pt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-[#00FF85]/10 border border-[#00FF85]/30 text-[#00FF85] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mx-auto shadow-[0_0_15px_rgba(0,255,133,0.2)]"
          >
            <Sparkles className="w-4 h-4" /> Made for Creators, by Creators.
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold text-white font-display tracking-tight leading-[1.1]"
          >
            We are the Engine of the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] to-[#0080FF]">Creator Economy.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-slate-400 text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto"
          >
            Digital Fortuna Computing is the definitive global launchpad for tech entrepreneurship. We turn lines of code into life-changing acquisitions so you can focus on building the future.
          </motion.p>
        </section>

        {/* 2. THE GENESIS (Story) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display">The Genesis of Fortuna</h2>
            <div className="space-y-4 text-slate-400 text-lg leading-relaxed font-light">
              <p>
                In 2024, acquiring a SaaS business was completely broken. Founders were spending months trapped in diligence spreadsheets, arguing over multiples, and praying escrow transfers wouldn't fail. 
              </p>
              <p>
                Born out of the vibrant tech hub in <strong className="text-white font-semibold">Accra, Ghana</strong>, we saw an opportunity to build a bridge. We engineered a platform that removes the friction from M&A—injecting AI-driven valuation and military-grade escrow into the heart of every deal.
              </p>
              <p>
                Today, Digital Fortuna Computing is the premium trusted intermediary where elite codebases find elite capital.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 relative bg-[#131A2E]/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF85]/20 to-[#0080FF]/20 mix-blend-overlay z-10" />
              <Image 
                src="/images/premium_hero_bg.png" 
                alt="Digital Fortuna Computing Abstract Concept" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          </motion.div>
        </section>

        {/* 3. METRICS / STATS */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00FF85]/5 via-transparent to-[#0080FF]/5 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 border border-slate-800/80 rounded-3xl bg-[#131A2E]/40 backdrop-blur-md">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-6 text-center group"
              >
                <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#00FF85] group-hover:bg-[#00FF85]/10 transition-all duration-300 mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-extrabold text-white mb-2 font-display">{stat.value}</h3>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. FOUNDERS & LEADERSHIP */}
        <section className="space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white font-display">Leadership Team</h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              We are a collective of engineers, ex-founders, and M&A specialists dedicated to standardizing the acquisition of digital assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {leaders.map((leader, i) => (
              <motion.div 
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group relative"
              >
                <div 
                  className="aspect-[4/5] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 relative mb-6 shadow-2xl cursor-pointer group-hover:border-[#00FF85]/50 transition-colors"
                  onClick={() => setSelectedLeader(leader)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-transparent to-transparent opacity-80 z-10" />
                  <Image 
                    src={leader.image} 
                    alt={leader.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-semibold tracking-wide">View Profile</span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <h3 className="text-2xl font-bold text-white font-display">{leader.name}</h3>
                    <p className="text-[#00FF85] font-mono text-sm tracking-wide uppercase mt-1">{leader.role}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-base leading-relaxed px-2 font-light">
                  {leader.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. ECOSYSTEM PILLARS */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white font-display">Built Without Compromise</h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              We engineered a seamless, beautiful, and hyper-functional terminal for your technical assets. No spreadsheets, just smooth workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {corePillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-[#131A2E]/60 border border-slate-800 rounded-3xl p-8 md:p-10 backdrop-blur-md hover:bg-[#131A2E] hover:border-slate-700 transition-all duration-300 relative group overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                
                <div className="p-4 bg-[#0A0F1E] rounded-2xl inline-block mb-6 border border-slate-800 shadow-inner">
                  {pillar.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-4 font-display">
                  {pillar.title}
                </h3>
                
                <p className="text-base text-slate-400 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. CTA BANNER */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-br from-[#131A2E] to-[#0A0F1E] border border-[#00FF85]/20 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,255,133,0.1)]"
          >
            {/* Embedded glowing orbit */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#00FF85]/10 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#0080FF]/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <Rocket className="w-12 h-12 text-[#00FF85] mx-auto mb-6" />
              <h2 className="text-4xl md:text-6xl font-extrabold text-white font-display leading-tight">
                Ready to Join the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Revolution of Builders?</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                Whether you are listing a passion project or acquiring a scale-ready infrastructure, Digital Fortuna Computing is where the global creator class converges.
              </p>
              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = "/catalog"}
                  className="bg-[#00FF85] text-black hover:bg-[#00FF85]/80 px-10 py-6 rounded-2xl text-base font-bold tracking-wide transition-all shadow-lg shadow-[#00FF85]/20"
                >
                  BROWSE LIVE CATALOG
                </Button>
                <Button 
                  onClick={() => window.location.href = "/sell"}
                  variant="outline"
                  className="bg-transparent border-slate-700 text-white hover:bg-slate-800 px-10 py-6 rounded-2xl text-base font-bold tracking-wide transition-all"
                >
                  LIST YOUR STARTUP <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

      </div>

      <AnimatePresence>
        {selectedLeader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLeader(null)}
            data-lenis-prevent
            className="fixed inset-0 bg-[#0A0F1E]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#131A2E] to-[#0A0F1E] border border-slate-700/80 rounded-[2.5rem] max-w-6xl w-full h-[90vh] max-h-[800px] flex flex-col lg:flex-row relative shadow-[0_0_80px_rgba(0,255,133,0.15)] overflow-hidden"
            >
              <button 
                onClick={() => setSelectedLeader(null)}
                className="absolute top-6 right-6 z-30 w-12 h-12 bg-black/40 hover:bg-black rounded-full flex items-center justify-center text-white transition-all border border-slate-600/50 hover:border-white hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Left Side: Photo & Quick Stats (Fixed) */}
              <div className="w-full lg:w-2/5 h-[300px] lg:h-full relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#131A2E] via-transparent to-transparent z-10" />
                <Image src={selectedLeader.image} alt={selectedLeader.name} fill className="object-cover" />
                
                {/* Float Achievements overlay */}
                <div className="absolute bottom-8 left-8 right-8 z-20 flex gap-3 overflow-x-auto hide-scrollbar">
                  {selectedLeader.achievements?.map((ach: any, idx: number) => (
                    <div key={idx} className="bg-black/60 backdrop-blur-md border border-slate-600/50 rounded-2xl p-4 shrink-0 shadow-xl min-w-[140px]">
                      <p className="text-[#00FF85] font-mono text-[10px] tracking-widest uppercase mb-1">{ach.category}</p>
                      <h4 className="text-white font-bold text-sm">{ach.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Side: Detailed Info (Scrollable) */}
              <div className="w-full lg:w-3/5 p-8 md:p-14 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-[#0080FF]/10 border border-[#0080FF]/20 text-[#0080FF] rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedLeader.role}
                  </div>
                </div>
                
                <h3 className="text-4xl md:text-6xl font-extrabold text-white font-display mb-8 tracking-tight">{selectedLeader.name}</h3>
                
                <div className="space-y-10">
                  {/* Bio */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#F5C842]" /> Biography</h4>
                    <p className="text-slate-300 text-lg leading-relaxed font-light">
                      {selectedLeader.bio}
                    </p>
                  </div>

                  {/* Academics Grid */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-purple-400" /> Academic Background</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedLeader.academics?.map((acad: any, idx: number) => (
                        <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800/50 transition-colors">
                          <h5 className="text-white font-bold mb-1">{acad.degree}</h5>
                          <p className="text-slate-400 text-sm font-light">{acad.institution}</p>
                          <span className="inline-block mt-3 text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md">{acad.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional Details */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Rocket className="w-4 h-4 text-[#00FF85]" /> Key Focus</h4>
                    <div className="space-y-4">
                      {selectedLeader.details?.map((detail: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-800/30 to-transparent rounded-2xl border-l-2 border-[#0080FF]">
                          <p className="text-slate-300 font-light text-sm">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 flex items-center flex-wrap gap-4">
                  <Button 
                    className="bg-[#00FF85] text-black hover:bg-[#00FF85]/80 font-bold tracking-wide px-8 py-6 rounded-2xl"
                    onClick={() => window.open(`https://${selectedLeader.social}`, '_blank')}
                  >
                    Connect on Social <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCopyLink}
                    className="border-slate-700 bg-transparent text-slate-300 hover:text-white hover:bg-slate-800 px-8 py-6 rounded-2xl"
                  >
                    Copy Profile Link
                  </Button>
                  
                  <div className="flex-1 hidden sm:block" />
                  
                  <div className="flex gap-2 ml-auto w-full sm:w-auto mt-4 sm:mt-0 justify-end">
                    <button 
                      onClick={handlePrev} 
                      className="p-4 bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-full text-slate-300 hover:text-white transition-all shadow-md"
                      title="Previous Profile"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleNext} 
                      className="p-4 bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-full text-slate-300 hover:text-white transition-all shadow-md"
                      title="Next Profile"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
