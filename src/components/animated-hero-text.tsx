"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
  { prefix: "Acquire. Launch.", highlight: "Dominate." },
  { prefix: "Code. Deploy.", highlight: "Profit." },
  { prefix: "Build. Scale.", highlight: "Exit." },
];

export function AnimatedHeroText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center w-full min-h-[200px] md:min-h-[280px]">
      <AnimatePresence mode="wait">
        <motion.h1
          key={index}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-6xl md:text-8xl font-bold font-display text-white tracking-tight text-center w-full leading-[1.15]"
        >
          <span className="block">{phrases[index].prefix}</span>
          <span className="block text-[#00FF85]">{phrases[index].highlight}</span>
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
