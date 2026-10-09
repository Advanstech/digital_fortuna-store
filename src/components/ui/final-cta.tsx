"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-32 px-4 md:px-8 bg-[#0A0F1E] relative overflow-hidden border-t border-white/5">
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
            <Link href="/catalog" passHref>
              <Button className="bg-[#00FF85] text-black hover:bg-[#00FF85]/90 px-10 py-7 text-lg rounded-full font-bold group transition-all">
                Explore the Catalog
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sell" passHref>
              <Button variant="outline" className="px-10 py-7 text-lg rounded-full font-semibold border-slate-700 bg-[#1C2333]/80 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-colors">
                Sell Your Startup
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
