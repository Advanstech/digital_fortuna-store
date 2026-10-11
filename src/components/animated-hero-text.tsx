"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const phrases = [
  { prefix: "Acquire. Launch.", highlight: "Dominate." },
  { prefix: "Code. Deploy.", highlight: "Profit." },
  { prefix: "Build. Scale.", highlight: "Exit." },
];

export function AnimatedHeroText() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="flex min-h-[150px] w-full items-center justify-center sm:min-h-[180px] md:min-h-[260px]">
      <AnimatePresence mode="wait">
        <motion.h1
          key={index}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeInOut" }}
          className="w-full text-center text-[clamp(2.25rem,9vw,5.5rem)] font-bold font-display leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="block">{phrases[index].prefix}</span>
          <span className="block text-[#00FF85]">{phrases[index].highlight}</span>
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
