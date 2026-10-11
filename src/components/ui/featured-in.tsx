"use client";

import { motion } from "framer-motion";

const publications = [
  { name: "TechCrunch", weight: "font-bold" },
  { name: "WIRED", weight: "font-black tracking-tighter" },
  { name: "Forbes", weight: "font-serif font-bold italic" },
  { name: "FastCompany", weight: "font-bold tracking-tight" },
  { name: "Bloomberg", weight: "font-bold" },
];

export function FeaturedInSection() {
  return (
    <section className="py-12 border-y border-white/5 bg-[#050810] overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:gap-8 md:flex-row md:gap-16">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest whitespace-nowrap">
          Featured In
        </p>
        
        {/* Logo marquee container */}
        <div className="relative flex w-full min-w-0 overflow-x-hidden">
          {/* Gradient masks for smooth fading at the edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050810] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050810] to-transparent z-10" />
          
          <motion.div
            className="flex items-center gap-16 whitespace-nowrap px-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* Double the array for seamless infinite scrolling */}
            {[...publications, ...publications].map((pub, index) => (
              <span 
                key={index} 
                className={`text-2xl md:text-3xl text-slate-600 hover:text-slate-300 transition-colors cursor-default ${pub.weight}`}
              >
                {pub.name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
