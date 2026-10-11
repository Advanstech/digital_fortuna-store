"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface ListingCardProps {
  id: string;
  title: string;
  category: string;
  price: string;
  type: "acquisition" | "saas";
  imageUrl?: string;
  tagline?: string;
  priority?: boolean;
}

export function ListingCard({ id, title, category, price, type, imageUrl, tagline, priority = false }: ListingCardProps) {
  return (
    <div style={{ perspective: 1000 }} className="group">
      <motion.div
        whileHover={{ y: -8, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        <Card className="overflow-hidden bg-[#131A2E]/80 border-slate-800/80 group-hover:border-[#00FF85]/40 backdrop-blur-xl text-white transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#00FF85]/10 rounded-2xl relative">
          <div className="h-52 bg-slate-900 relative overflow-hidden">
            {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt={title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/30 to-transparent" />
            
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-[#0A0F1E]/80 backdrop-blur-md border border-slate-700/60 text-[#00FF85] text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold uppercase">
                <ShieldCheck className="w-3 h-3 text-[#00FF85]" /> Escrow Verified
              </span>
            </div>

            <Badge className="absolute top-4 right-4 bg-[#F5C842] text-black font-semibold text-xs px-2.5 py-0.5 shadow-md">
              {type === "acquisition" ? "Full Acquisition" : "SaaS License"}
            </Badge>
          </div>

          <CardContent className="p-6 pb-4">
            <p className="text-[#00FF85] text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5 font-medium">
              <Zap className="w-3 h-3 text-[#00FF85]" /> {category}
            </p>
            <h3 className="text-xl font-bold mb-2 font-display text-white group-hover:text-[#00FF85] transition-colors">
              {title}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
              {tagline || "Vetted, production-ready infrastructure with audited code repositories, zero technical debt, and escrow protection."}
            </p>
          </CardContent>

          <CardFooter className="px-6 py-4 flex justify-between items-center border-t border-slate-800/80 bg-[#0A0F1E]/60">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Asking Price</span>
              <div className="text-lg font-bold font-display text-white">{price}</div>
            </div>
            <Link href={`/catalog/${id}`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs font-semibold bg-white text-black hover:bg-[#00FF85] px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
              >
                Inspect Deal <ArrowRight className="w-3 h-3" />
              </motion.button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
