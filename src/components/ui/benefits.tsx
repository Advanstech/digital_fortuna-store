"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  Cpu, 
  Key, 
  Database,
  GitBranch,
  Terminal,
  Activity,
  ArrowUpRight
} from "lucide-react";

export function BenefitsSection() {
  // Mock live metrics for Code Scanner Visual
  const [scanPulse, setScanPulse] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setScanPulse(prev => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const mockFiles = [
    { name: "auth_gateway.ts", status: "PASSED", size: "4.2 KB", type: "Security" },
    { name: "stripe_webhook.ts", status: "PASSED", size: "12.8 KB", type: "Payments" },
    { name: "db_schema.prisma", status: "SECURE", size: "8.5 KB", type: "Database" },
    { name: "main_controller.ts", status: "A+ COMPILING", size: "15.1 KB", type: "Backend" },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-[#050810] relative overflow-hidden border-t border-white/5">
      {/* Radial atmospheric design highlights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00FF85]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#0080FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="mb-16 md:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#0080FF]/10 border border-[#0080FF]/20 text-[#0080FF] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Cpu className="w-3.5 h-3.5" /> Acquisition Advantages
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white mb-6 leading-tight">
            Why build from scratch? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">Buy a pre-vetted foundation instead.</span>
          </h2>
          <p className="text-slate-400 text-lg font-light max-w-xl">
            Building software takes months of engineering, debugging, and recruiting risk. Buying production-ready codebases lets you skip straight to product-market fit.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[250px] md:auto-rows-[270px]">
          
          {/* BENTO ITEM 1: Zero Development Time (Large 4x2 Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 md:row-span-2 bg-[#131A2E]/50 rounded-3xl p-8 border border-slate-800/80 relative overflow-hidden group flex flex-col justify-between backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-all duration-300" />
            
            {/* Visual Gantt Comparison Widget */}
            <div className="w-full bg-[#0A0F1E]/80 border border-slate-800 rounded-2xl p-5 mb-6 space-y-4 shadow-2xl relative z-10">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#00FF85]" /> Acquisition vs. Dev Lifecycle
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium font-mono">99% Faster</span>
              </div>

              {/* Dev track */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Build from Scratch (Recruiting + Sprint Cycles)</span>
                  <span className="font-bold text-red-400">9 - 12 Months</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Fortuna track */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-[#00FF85]" /> Acquire on Digital Fortuna Computing</span>
                  <span className="font-extrabold text-[#00FF85]">3 Days</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#00FF85] to-[#0080FF] rounded-full" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                Zero Development Overhead <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              </h3>
              <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed max-w-2xl">
                Skip 6-12 months of core engineering, specification scope creep, and engineering management. Purchase pre-written frameworks built cleanly by expert tech teams.
              </p>
            </div>
          </motion.div>

          {/* BENTO ITEM 2: Vetted Quality (Medium 2x2 Card - Live Code Audit Visual) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="md:col-span-2 md:row-span-2 bg-[#131A2E]/50 rounded-3xl p-8 border border-slate-800/80 relative overflow-hidden group flex flex-col justify-between backdrop-blur-sm"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-all duration-300" />

            {/* Simulated Live Repository Audit UI */}
            <div className="w-full bg-[#0A0F1E] border border-slate-800/90 rounded-2xl p-4 mb-6 shadow-2xl relative z-10 font-mono text-[10px] space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                  <GitBranch className="w-3.5 h-3.5 text-[#0080FF]" /> Repo Audit scanner
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#00FF85] animate-ping" />
              </div>

              <div className="space-y-1.5">
                {mockFiles.map((file, i) => (
                  <div 
                    key={file.name} 
                    className={`flex items-center justify-between p-1.5 rounded transition-all duration-300 ${
                      scanPulse === i ? 'bg-slate-800/60 border border-slate-700/50' : 'bg-transparent border border-transparent'
                    }`}
                  >
                    <span className="text-slate-300 truncate max-w-[120px]">{file.name}</span>
                    <span className="text-[9px] text-[#00FF85] bg-[#00FF85]/10 px-1.5 py-0.5 rounded border border-[#00FF85]/20 font-bold">{file.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-bold text-white font-display">100% Vetted Code Quality</h3>
              <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">
                No messy spaghetti code. Our tech architects audit structure, database indexing, and test coverages to guarantee compliance before accepting.
              </p>
            </div>
          </motion.div>

          {/* BENTO ITEM 3: Full Ownership (Small 3x1 Card - Cryptographic License Block) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="md:col-span-3 bg-emerald-950/20 rounded-3xl p-8 border border-emerald-900/30 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-[#00FF85]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Visual Token Stamp */}
            <div className="w-24 h-24 rounded-full border border-[#00FF85]/20 bg-emerald-500/10 flex items-center justify-center flex-shrink-0 relative group-hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full border border-dashed border-[#00FF85]/30 flex items-center justify-center text-[#00FF85]">
                <Key className="w-8 h-8" />
              </div>
              {/* Spinning circular dash ring */}
              <div className="absolute inset-2 border border-[#00FF85]/20 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
            </div>

            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-bold text-white font-display">Complete IP Security</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Legal asset deeds, trademarks, database schema keys, and server ownership transfers mapped cleanly via our audited digital escrow.
              </p>
            </div>
          </motion.div>

          {/* BENTO ITEM 4: Instant Scale (Small 3x1 Card - Simulated Load Balancer Charts) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="md:col-span-3 bg-[#131A2E]/50 rounded-3xl p-8 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-[#0080FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Visual Simulated traffic load balancer */}
            <div className="w-24 h-20 flex items-end justify-center gap-1.5 flex-shrink-0">
              <div className="w-3.5 h-1/4 bg-slate-800 rounded-t group-hover:bg-[#0080FF] transition-all group-hover:h-3/4 duration-500 animate-pulse" />
              <div className="w-3.5 h-2/4 bg-slate-800 rounded-t group-hover:bg-[#0080FF] transition-all group-hover:h-2/5 duration-500 delay-75 animate-bounce" />
              <div className="w-3.5 h-3/4 bg-slate-800 rounded-t group-hover:bg-[#0080FF] transition-all group-hover:h-5/6 duration-500 delay-100" />
              <div className="w-3.5 h-2/5 bg-slate-800 rounded-t group-hover:bg-[#00FF85] transition-all group-hover:h-full duration-500 delay-150 animate-pulse" />
            </div>

            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-bold text-white font-display">Built to Dominate Scale</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Every listed app utilizes modern frameworks (Next.js, Fastify, Serverless) configured for containerized load-balancing right from boot.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
