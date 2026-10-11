"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#0A0F1E] px-4 py-20 sm:py-24 md:px-8 md:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-[#00FF85]/5 rounded-[100%] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF85]/50 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold font-display text-white mb-6 tracking-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] to-[#0080FF]">dominate</span> your market?
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join the exclusive network of founders acquiring world-class, production-ready software.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/catalog" className="w-full sm:w-auto">
              <Button className="w-full rounded-full bg-[#00FF85] px-7 py-6 text-base font-bold text-black transition-all hover:bg-[#00FF85]/90 group sm:w-auto sm:px-10 sm:py-7 sm:text-lg">
                Explore the Catalog
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sell" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full rounded-full border-slate-700 bg-[#1C2333]/80 px-7 py-6 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black sm:w-auto sm:px-10 sm:py-7 sm:text-lg">
                Sell Your Startup
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
