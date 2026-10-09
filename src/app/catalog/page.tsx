"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/listings/listing-card";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Premium high-fidelity curated mock listings for fallback representation
const MOCK_LISTINGS = [
  {
    id: "mock-1",
    title: "ModernRx POS",
    category: "Healthcare & Pharmacy",
    price: "$15,000",
    type: "acquisition" as const,
    imageUrl: "/images/modernrx.png",
    techStack: "Next.js, Fastify, PostgreSQL"
  },
  {
    id: "mock-2",
    title: "FortunaEats POS",
    category: "Food & Restaurant",
    price: "$8,500",
    type: "acquisition" as const,
    imageUrl: "/images/fortunaeats.png",
    techStack: "React Native, Node.js, MongoDB"
  },
  {
    id: "mock-3",
    title: "OpenCLAW Operations",
    category: "Office & Operations",
    price: "$99/mo",
    type: "saas" as const,
    imageUrl: "/images/openclaw.png",
    techStack: "SvelteKit, NestJS, DynamoDB"
  },
  {
    id: "mock-4",
    title: "Aura AI CRM",
    category: "Sales & Marketing",
    price: "$25,000",
    type: "acquisition" as const,
    imageUrl: "/images/aura.png",
    techStack: "Python, FastAPI, Supabase, Tailwind"
  },
  {
    id: "mock-5",
    title: "Nova Ledger Web3",
    category: "Web3 & Blockchain",
    price: "$45,000",
    type: "acquisition" as const,
    imageUrl: "/images/premium_hero_bg.png",
    techStack: "Solidity, Next.js, Hardhat"
  },
  {
    id: "mock-6",
    title: "ChatCraft Prompt Hub",
    category: "AI Tool / Generator",
    price: "$29/mo",
    type: "saas" as const,
    imageUrl: "/images/modernrx.png",
    techStack: "OpenAI GPT-4, Next.js, Redis"
  }
];

const CATEGORIES = ["All", "SaaS", "POS", "Healthcare", "AI Tool", "Web3"];

export default function CatalogPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // newest, price-asc, price-desc
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Connect to versioned NestJS API
      const response = await fetch("http://localhost:4000/v1/listings");
      if (response.ok) {
        const resJson = await response.json();
        const apiData = resJson.data || resJson;
        
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          // Format payload from backend structure
          const formatted = apiData.map((item: any) => ({
            id: item.id || `db-${Math.random()}`,
            title: item.title,
            category: item.category || "General",
            price: `$${parseFloat(item.acquisitionPrice || "0").toLocaleString()}`,
            type: (item.status === "saas" ? "saas" : "acquisition") as "saas" | "acquisition",
            imageUrl: item.demoUrl || "/images/modernrx.png"
          }));
          
          // Merge with high-fidelity mocks to ensure the catalog looks rich and populated
          const mergedListings = [...formatted];
          for (const mock of MOCK_LISTINGS) {
             if (!mergedListings.find(l => l.id === mock.id)) {
               mergedListings.push(mock);
             }
          }
          
          setListings(mergedListings);
          setIsUsingFallback(false);
        } else {
          // Fallback if DB is empty
          setListings(MOCK_LISTINGS);
          setIsUsingFallback(true);
        }
      } else {
        setListings(MOCK_LISTINGS);
        setIsUsingFallback(true);
      }
    } catch (error) {
      console.error("Failed to fetch listings. Activating high-fidelity fallback nodes:", error);
      setListings(MOCK_LISTINGS);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter and Sort Logic
  const filteredListings = listings
    .filter((listing) => {
      const matchesSearch = 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        activeCategory === "All" ||
        listing.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        (activeCategory === "POS" && listing.title.toLowerCase().includes("pos"));

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const getNum = (priceStr: string) => {
        return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
      };

      if (sortBy === "price-asc") {
        return getNum(a.price) - getNum(b.price);
      }
      if (sortBy === "price-desc") {
        return getNum(b.price) - getNum(a.price);
      }
      return 0; // Default: chronological order
    });

  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 px-4 md:px-8 pb-24 relative overflow-hidden">
      {/* Background glow animations */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0080FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#00FF85]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-display tracking-tight leading-none">
              Acquire Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] to-[#0080FF]">Venture</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl font-light">
              Browse our curated marketplace of production-ready businesses, micro-SaaS, and restaurateur POS systems. Built by professionals, vetted by architects.
            </p>
          </div>

          {isUsingFallback && (
            <div className="inline-flex items-center gap-2 bg-[#F5C842]/10 border border-[#F5C842]/20 text-[#F5C842] text-xs px-3.5 py-1.5 rounded-full font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Live Sync Offline (Showing Fallbacks)
            </div>
          )}
        </div>

        {/* Search, Filter & Sort Bar Layout */}
        <div className="bg-[#131A2E]/60 border border-slate-800 rounded-2xl p-4 md:p-6 mb-10 backdrop-blur-md flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="lg:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search by brand name, tech stack, or category..."
                className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl py-4 pl-12 pr-4 text-slate-200 placeholder-slate-600 outline-none transition-all text-sm font-light"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter Desktop pills */}
            <div className="lg:col-span-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    activeCategory === cat 
                      ? "bg-[#00FF85] border-[#00FF85] text-black shadow-lg shadow-[#00FF85]/10" 
                      : "bg-[#0A0F1E] border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-2 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <ArrowUpDown className="w-4 h-4" />
              </div>
              <select
                className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl py-4 pl-11 pr-4 text-slate-300 outline-none transition-all text-xs cursor-pointer appearance-none font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          /* SKELETON LOADER FEED */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#1C2333]/50 border border-slate-800/80 rounded-2xl h-[420px] animate-pulse p-6 flex flex-col justify-between">
                <div className="h-44 bg-slate-800/60 rounded-xl mb-4" />
                <div className="space-y-3">
                  <div className="w-1/3 h-4 bg-slate-800/60 rounded" />
                  <div className="w-3/4 h-6 bg-slate-800/60 rounded" />
                  <div className="w-full h-12 bg-slate-800/60 rounded" />
                </div>
                <div className="flex justify-between items-center mt-6">
                  <div className="w-1/4 h-6 bg-slate-800/60 rounded" />
                  <div className="w-1/4 h-8 bg-slate-800/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListingCard 
                      id={listing.id}
                      title={listing.title} 
                      category={listing.category} 
                      price={listing.price} 
                      type={listing.type}
                      imageUrl={listing.imageUrl}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-24 bg-[#131A2E]/30 rounded-3xl border border-slate-800"
                >
                  <p className="text-slate-500 text-lg font-light mb-4">No active ventures match your filtration query.</p>
                  <Button 
                    onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                    className="bg-[#00FF85] text-black font-semibold hover:bg-[#00FF85]/80 rounded-xl"
                  >
                    Clear Filter Locks
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
