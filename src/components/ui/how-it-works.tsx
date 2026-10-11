"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Rocket } from "lucide-react";

const steps = [
  {
    icon: <CheckCircle2 className="w-8 h-8 text-[#00FF85]" />,
    title: "Discover & Evaluate",
    description: "Browse our curated marketplace of production-ready startups and AI tools. Review metrics, tech stacks, and growth potential."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#F5C842]" />,
    title: "Secure Escrow & Transfer",
    description: "Our legal and technical team ensures a seamless code and asset transfer via a secure escrow service, protecting both buyer and seller."
  },
  {
    icon: <Rocket className="w-8 h-8 text-[#0080FF]" />,
    title: "Deploy & Dominate",
    description: "Take full ownership. Rebrand, launch, and scale your new digital business instantly with zero development time."
  }
];

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#0A0F1E] px-4 py-16 sm:py-20 md:px-8 md:py-24">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            From Purchase to Profit in <span className="text-[#00FF85]">Days</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Skip the costly and unpredictable development phase. Acquire a proven software product and go straight to market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[#13192B] border border-slate-800 rounded-2xl p-8 hover:bg-[#1C2333] transition-colors relative group"
            >
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-slate-800 z-0 group-hover:bg-[#00FF85]/50 transition-colors" />
              )}
              
              <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center mb-6 shadow-inner border border-white/5">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-display">
                <span className="text-slate-500 mr-2">0{index + 1}.</span> {step.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
