"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  id: string;
  title: string;
  category: string;
  price: string;
  type: "acquisition" | "saas";
  imageUrl?: string;
  priority?: boolean;
}

export function ListingCard({ id, title, category, price, type, imageUrl, priority = false }: ListingCardProps) {
  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        whileHover={{ y: -10, rotateX: 5, rotateY: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="overflow-hidden bg-[#1C2333]/80 border-slate-800 backdrop-blur-md text-white">
          <div className="h-48 bg-slate-900 relative overflow-hidden">
            {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt={title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
                className="object-cover" 
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-emerald-900/40 mix-blend-overlay" />
            <Badge className="absolute top-4 right-4 bg-[#F5C842] text-black hover:bg-[#F5C842]/90">
              {type === "acquisition" ? "For Sale" : "SaaS License"}
            </Badge>
          </div>
          <CardContent className="p-6 pb-4">
            <p className="text-[#00FF85] text-xs font-mono uppercase tracking-wider mb-2">{category}</p>
            <h3 className="text-xl font-bold mb-2 font-display">{title}</h3>
            <p className="text-slate-400 text-sm line-clamp-2">
              A production-ready ecosystem that is fully scalable and ready for enterprise deployment.
            </p>
          </CardContent>
          <CardFooter className="px-6 py-5 flex justify-between items-center border-t border-slate-800/80 bg-slate-900/30">
            <div className="text-lg font-bold">{price}</div>
            <Link href={`/catalog/${id}`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-medium bg-white text-black px-4 py-2 rounded-md"
              >
                View Details
              </motion.button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
