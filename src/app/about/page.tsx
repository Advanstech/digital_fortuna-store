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
  TrendingUp,
  Award,
  X,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const [selectedLeader, setSelectedLeader] = useState<any>(null);

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
        "Stanford GSB Alumni.",
        "Passionate about democratizing exit opportunities for solo founders."
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
        "Holds 3 patents in distributed ledger escrow technologies.",
        "Advocates for female engineers in high-performance computing."
      ],
      social: "twitter.com/meilin_code"
    }
  ];

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
            className="fixed inset-0 bg-[#0A0F1E]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#131A2E] border border-slate-700 rounded-3xl max-w-5xl w-full flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(0,0,0,0.8)] my-8"
            >
              <button 
                onClick={() => setSelectedLeader(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black rounded-full flex items-center justify-center text-white transition-colors border border-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full md:w-2/5 h-[400px] md:h-auto relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#131A2E] via-transparent to-transparent z-10" />
                <Image src={selectedLeader.image} alt={selectedLeader.name} fill className="object-cover" />
              </div>
              
              <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center relative z-10">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white font-display mb-2 tracking-tight">{selectedLeader.name}</h3>
                <p className="text-[#00FF85] font-mono text-sm tracking-wide uppercase mb-8">{selectedLeader.role}</p>
                
                <p className="text-slate-300 text-lg leading-relaxed mb-10 font-light">
                  {selectedLeader.bio}
                </p>

                <div className="space-y-5 mb-10">
                  {selectedLeader.details?.map((detail: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="mt-2 w-2 h-2 rounded-full bg-[#0080FF] shrink-0 shadow-[0_0_10px_rgba(0,128,255,0.8)]" />
                      <p className="text-slate-400 font-light">{detail}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Button className="bg-[#00FF85] text-black hover:bg-[#00FF85]/80 font-bold tracking-wide">
                    Connect <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
