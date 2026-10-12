"use client";

import { useEffect, useRef, useState } from "react";
import { ListingCard } from "@/components/listings/listing-card";
import { Pagination } from "@/components/ui/pagination";
import { getListings, type ListingQuery, type MarketplaceListing, type PageMeta } from "@/lib/api/listings";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/currency";

// Pill label -> API category enum value
const CATEGORIES: { label: string; value?: string }[] = [
  { label: "All" },
  { label: "AI & Agents", value: "ai" },
  { label: "SaaS", value: "saas" },
  { label: "POS", value: "pos" },
  { label: "Mobile", value: "mobile" },
  { label: "Fintech", value: "fintech" },
  { label: "Ecommerce", value: "ecommerce" },
  { label: "Web3", value: "blockchain" },
  { label: "Marketing", value: "marketing" },
];

const PAGE_SIZE = 6;
type SortOption = NonNullable<ListingQuery["sort"]>;

interface CatalogListing {
  id: string;
  title: string;
  category: string;
  priceUsd: number | null;
  priceSuffix: string;
  type: "saas" | "acquisition";
  imageUrl?: string;
  tagline: string;
  verified: boolean;
}

function formatListing(item: MarketplaceListing): CatalogListing {
  const acquisitionPrice = Number(item.acquisitionPrice || 0);
  const licensePrice = Number(item.monthlyLicensePrice || 0);
  return {
    id: item.slug || item.id,
    title: item.title,
    category: String(item.category || "other").replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase()),
    // Raw USD values — converted to the user's display currency at render time
    priceUsd: acquisitionPrice || licensePrice || null,
    priceSuffix: !acquisitionPrice && licensePrice ? "/mo" : "",
    type: (licensePrice && !acquisitionPrice ? "saas" : "acquisition") as "saas" | "acquisition",
    imageUrl: item.details?.assets?.screenshot || item.details?.images?.[0] || undefined,
    tagline: item.tagline || item.description || "",
    verified: Boolean(item.verified)
  };
}

export default function CatalogPage() {
  const [listings, setListings] = useState<CatalogListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PageMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const { format: formatPrice } = useCurrency();
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce the search input before hitting the API
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => { if (searchDebounce.current) clearTimeout(searchDebounce.current); };
  }, [searchQuery]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeCategory, sortBy]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setListingsError(null);
      try {
        const category = CATEGORIES.find((c) => c.label === activeCategory)?.value;
        const result = await getListings({
          page,
          limit: PAGE_SIZE,
          category,
          search: debouncedSearch || undefined,
          sort: sortBy,
        });

        setListings(result.data.map(formatListing));
        setMeta(result.meta);
      } catch (error) {
        console.warn("Failed to fetch live listings:", error);
        setListings([]);
        setListingsError("Live listings are temporarily unavailable. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [page, debouncedSearch, activeCategory, sortBy, reload]);

  const displayListings = listings;
  const displayMeta = meta;

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

          {listingsError && (
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-3.5 py-1.5 rounded-full font-mono">
              <RefreshCw className="w-3.5 h-3.5" /> Live catalog unavailable
            </div>
          )}
        </div>

        {/* Search, Filter & Sort Bar Layout */}
        <div className="bg-[#131A2E]/60 border border-slate-800 rounded-2xl p-4 md:p-6 mb-10 backdrop-blur-md flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Search Input */}
            <div className="lg:col-span-5 relative">
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
            <div data-lenis-prevent className="lg:col-span-5 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    activeCategory === cat.label
                      ? "bg-[#00FF85] border-[#00FF85] text-black shadow-lg shadow-[#00FF85]/10"
                      : "bg-[#0A0F1E] border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat.label}
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
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="mrr-desc">MRR: High to Low</option>
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
              {displayListings.length > 0 ? (
                displayListings.map((listing) => (
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
                      price={listing.priceUsd != null ? formatPrice(listing.priceUsd, { suffix: listing.priceSuffix }) : "Contact"}
                      type={listing.type}
                      imageUrl={listing.imageUrl}
                      tagline={listing.tagline}
                      verified={listing.verified}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-24 bg-[#131A2E]/30 rounded-3xl border border-slate-800"
                >
                  <p className="text-slate-500 text-lg font-light mb-4">
                    {listingsError || "No live ventures match your search and filters."}
                  </p>
                  {listingsError ? (
                    <Button
                      onClick={() => setReload((current) => current + 1)}
                      className="bg-[#00FF85] text-black font-semibold hover:bg-[#00FF85]/80 rounded-xl"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Retry
                    </Button>
                  ) : (
                    <Button
                      onClick={() => { setSearchQuery(""); setActiveCategory("All"); setPage(1); }}
                      className="bg-[#00FF85] text-black font-semibold hover:bg-[#00FF85]/80 rounded-xl"
                    >
                      Clear Filters
                    </Button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && displayListings.length > 0 && (
          <Pagination
            className="mt-12"
            page={displayMeta.page}
            totalPages={displayMeta.totalPages}
            total={displayMeta.total}
            limit={displayMeta.limit}
            onPageChange={setPage}
          />
        )}
      </div>
    </main>
  );
}
