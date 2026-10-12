"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/currency";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Code2,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  BarChart3,
  CheckCircle2,
  Lock,
  Star,
  Target,
  Rocket,
  ChevronLeft,
  Settings,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Check,
  RefreshCw,
  Trash2,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/components/ui/toast";



const IconMap: Record<string, any> = {
  BarChart3,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Clock,
};

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [listingError, setListingError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [entering, setEntering] = useState(false);
  const { format: formatPrice } = useCurrency();

  // Admin management & drawer states
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isDrawerFullScreen, setIsDrawerFullScreen] = useState(false);
  const [isSavingListing, setIsSavingListing] = useState(false);
  const [listingForm, setListingForm] = useState<any>({});
  const { toast } = useToast();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const payloadBase64 = token.split(".")[1];
          const payload = JSON.parse(atob(payloadBase64));
          const role = (payload.role || "").toLowerCase();
          const email = (payload.email || "").toLowerCase();
          if (["admin", "superadmin", "super_admin", "root"].includes(role) || email === "hanson.pepra@gmail.com") {
            setIsAdmin(true);
          }
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (listing) {
      setListingForm({
        title: listing.title || "",
        category: listing.category || "saas",
        status: listing.status || "live",
        acquisitionPrice: listing.priceUsd || listing.acquisitionPrice || 0,
        monthlyLicensePrice: listing.monthlyLicensePrice || 0,
        revenueMrr: listing.revenueMrr || 0,
        revenueArr: listing.revenueArr || (listing.revenueMrr ? listing.revenueMrr * 12 : 0),
      });
    }
  }, [listing]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/listings/${encodeURIComponent(slug)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          setListing(null);
          setListingError(res.status === 404
            ? "This listing is not currently live or is no longer available."
            : "The listing service could not load this dossier. Please retry.");
          return;
        }

        const json = await res.json();
        setListingError(null);
        setActiveImage(0);
        const raw = json.data || json;
        const details = raw.details && typeof raw.details === "object" ? raw.details : {};
        const mediaImages = Array.isArray(raw.media)
          ? raw.media.map((item: any) => item.url).filter(Boolean)
          : [];
        const images = mediaImages.length
          ? mediaImages
          : Array.isArray(details.images) && details.images.length
            ? details.images
            : [details.assets?.screenshot, details.assets?.logo].filter(Boolean);
        const metrics = Array.isArray(details.metrics) ? [...details.metrics] : [];
        const addMetric = (label: string, value: number | null | undefined, icon: string, suffix = "") => {
          if (value == null || metrics.some((metric: any) => metric.label?.toLowerCase() === label.toLowerCase())) return;
          metrics.push({ label, value: `${formatPrice(Number(value), { suffix })}`, icon });
        };

        addMetric("MRR", raw.revenueMrr, "DollarSign", "/mo");
        addMetric("ARR", raw.revenueArr, "BarChart3", "/yr");
        addMetric("Monthly Profit", raw.monthlyProfit, "TrendingUp", "/mo");
        if (raw.profitMargin != null && !metrics.some((metric: any) => metric.label?.toLowerCase() === "profit margin")) {
          metrics.push({ label: "Profit Margin", value: `${raw.profitMargin}%`, icon: "TrendingUp" });
        }
        if (raw.customerCount != null && !metrics.some((metric: any) => metric.label?.toLowerCase() === "customers")) {
          metrics.push({ label: "Customers", value: Number(raw.customerCount).toLocaleString(), icon: "BarChart3" });
        }
        if (raw.churnRate != null && !metrics.some((metric: any) => metric.label?.toLowerCase() === "monthly churn")) {
          metrics.push({ label: "Monthly Churn", value: `${(Number(raw.churnRate) / 100).toFixed(2)}%`, icon: "TrendingUp" });
        }

        setListing({
          ...raw,
          price: raw.acquisitionPrice != null || raw.monthlyLicensePrice != null ? undefined : "Contact seller",
          priceUsd: raw.acquisitionPrice ?? raw.monthlyLicensePrice ?? null,
          priceSuffix: raw.acquisitionPrice == null && raw.monthlyLicensePrice != null ? "/mo" : "",
          type: raw.monthlyLicensePrice != null && raw.acquisitionPrice == null ? "saas" : "acquisition",
          images,
          techStack: Array.isArray(raw.techStack)
            ? raw.techStack
            : raw.techStack && typeof raw.techStack === "object"
              ? Object.values(raw.techStack).flat().filter((value: any) => typeof value === "string")
              : [],
          highlights: Array.isArray(details.highlights) ? details.highlights : [],
          metrics,
          benefits: Array.isArray(details.benefits) ? details.benefits : [],
          relevance: typeof details.relevance === "string" ? details.relevance : "",
          growth: Array.isArray(details.growth) ? details.growth : [],
        });
      } catch (error) {
        console.warn("Failed to load listing dossier:", error);
        setListing(null);
        setListingError("Unable to connect to the listing service. Check your connection and retry.");
      } finally {
        setLoading(false);
        setLoadedSlug(slug);
      }
    };
    fetchListing();
  }, [slug, formatPrice, loadAttempt]);

  const handleUpdateListing = async () => {
    setIsSavingListing(true);
    try {
      const token = localStorage.getItem("access_token");
      const targetId = listing?.id || slug;
      const res = await fetch(`${API_BASE}/listings/${targetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listingForm),
      });
      if (res.ok) {
        const json = await res.json();
        const updated = json.data || json;
        setListing((prev: any) => ({ ...prev, ...updated }));
        toast("Asset details saved", "success");
        setIsAdminDrawerOpen(false);
      } else {
        const error = await res.json().catch(() => ({}));
        toast(error.message || "Unable to save asset details", "error");
      }
    } catch {
      toast("Unable to save asset details. Check your connection and try again.", "error");
    } finally {
      setIsSavingListing(false);
    }
  };

  const handleEnterDealRoom = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push(`/auth?next=${encodeURIComponent(`/catalog/${slug}`)}`);
      return;
    }

    setEntering(true);
    try {
      const res = await fetch(`${API_BASE}/deals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId: listing.id }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push(`/auth?next=${encodeURIComponent(`/catalog/${slug}`)}`);
        return;
      }
      if (!res.ok) {
        const message = Array.isArray(json.message) ? json.message.join(", ") : json.message;
        toast(message || "Unable to open this deal room. Verify your account and try again.", "error");
        return;
      }

      const deal = json.data || json;
      if (!deal.id) {
        toast("The deal service did not return a room ID. Please try again.", "error");
        return;
      }
      router.push(`/deal/${deal.id}`);
    } catch {
      toast("Unable to reach the deal service. Please try again.", "error");
    } finally {
      setEntering(false);
    }
  };

  if (loading || loadedSlug !== slug) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-10 h-10 text-[#00FF85] animate-spin" />
        <p className="font-mono text-xs tracking-widest uppercase text-slate-500">Retrieving asset dossier…</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] pt-32 flex flex-col items-center justify-center text-white gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl mb-2">
          🔍
        </div>
        <h2 className="text-xl font-bold font-display text-white">Listing Details Unavailable</h2>
        <p className="text-slate-400 max-w-md text-sm">{listingError || "This listing could not be found in the live marketplace."}</p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          {listingError?.includes("retry") || listingError?.includes("connect") ? (
            <Button onClick={() => setLoadAttempt((attempt) => attempt + 1)} className="bg-[#00FF85] text-black hover:bg-[#00FF85]/80">
              Retry
            </Button>
          ) : null}
          <Button onClick={() => router.push("/catalog")} variant="outline" className="border-slate-800 text-slate-300">
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white">
      {/* Ambient glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#0080FF]/6 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#00FF85]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-24 relative z-10">

        {/* Top Navigation & Admin Command Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => router.push("/catalog")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </button>

          {/* Admin Command Banner */}
          {isAdmin && (
            <div className="flex items-center gap-3 bg-[#131A2E]/80 border border-[#0080FF]/30 px-4 py-2 rounded-xl shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" />
              <span className="text-xs font-mono font-bold text-white tracking-wide">
                ADMIN COMMAND ACTIVE
              </span>
              <Button
                size="sm"
                onClick={() => setIsAdminDrawerOpen(true)}
                className="bg-[#0080FF] hover:bg-[#0080FF]/80 text-white font-semibold text-xs h-7 px-3 rounded-lg flex items-center gap-1.5 shadow-md"
              >
                <Settings className="w-3.5 h-3.5" />
                Manage Asset (Side Drawer / Full-Page)
              </Button>
            </div>
          )}
        </div>

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── LEFT: scrollable content ── */}
          <div className="flex-1 min-w-0 space-y-12">

            {/* Category pill + title + tagline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block text-[#00FF85] text-xs font-mono uppercase tracking-widest mb-4 border border-[#00FF85]/30 bg-[#00FF85]/8 px-3 py-1 rounded-full">
                {String(listing.category || "other").replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase())}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4 font-display">
                {listing.title}
              </h1>
              {listing.tagline && (
                <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">{listing.tagline}</p>
              )}
              {!listing.isVerifiedRevenue && (
                <p className="mt-3 text-xs text-amber-300/80">Financial figures are seller-provided and have not been independently verified.</p>
              )}
            </motion.div>

            {/* Image gallery */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-[#111a2c] to-slate-950 aspect-[16/9]">
                {listing.images?.length ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={listing.images[activeImage]}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        unoptimized={listing.images[activeImage].startsWith("http") || listing.images[activeImage].startsWith("//")}
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
                    <Briefcase className="h-10 w-10 opacity-60" />
                    <span className="text-xs">The seller has not supplied listing images.</span>
                  </div>
                )}

                {/* Image dots */}
                {listing.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {listing.images.map((_: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          activeImage === i ? "bg-[#00FF85] scale-125" : "bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Prev / Next arrows */}
                {listing.images?.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((p) => (p - 1 + listing.images.length) % listing.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImage((p) => (p + 1) % listing.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {listing.images?.length > 1 && (
                <div className="flex gap-3 mt-3">
                  {listing.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImage === i ? "border-[#00FF85]" : "border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill sizes="80px" unoptimized={img.startsWith("http")} className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Overview */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 className="text-2xl font-bold mb-4 font-display">Overview</h2>
              {listing.description && <p className="text-slate-300 text-lg leading-relaxed">{listing.description}</p>}
            </motion.div>

            {/* Key highlights */}
            {listing.highlights?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                <h2 className="text-2xl font-bold mb-5 font-display">Key Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.highlights.map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-[#131A2E] border border-slate-800 rounded-xl p-4">
                      <CheckCircle2 className="w-5 h-5 text-[#00FF85] flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tech stack */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h2 className="text-2xl font-bold mb-5 font-display">Technical Architecture</h2>
              <div className="flex flex-wrap gap-3">
                {listing.techStack?.map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-[#1C2333] border border-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-mono"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[#0080FF]" />
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Acquisition Rationale / Benefits */}
            {listing.benefits?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.31 }}>
                <h2 className="text-2xl font-bold mb-5 font-display flex items-center gap-3">
                  <Star className="w-6 h-6 text-[#00FF85]" /> Why Acquire This Asset?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.benefits.map((b: any, i: number) => (
                    <div key={i} className="flex flex-col gap-2 bg-[#131A2E]/50 border border-[#00FF85]/20 rounded-xl p-5 hover:bg-[#131A2E] hover:border-[#00FF85]/40 transition-all shadow-lg shadow-black/20">
                      <span className="text-white font-bold">{b.title}</span>
                      <span className="text-slate-400 text-sm leading-relaxed">{b.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Target Market / Relevance */}
            {listing.relevance && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}>
                <h2 className="text-2xl font-bold mb-5 font-display flex items-center gap-3">
                  <Target className="w-6 h-6 text-[#0080FF]" /> Market Relevance & Fit
                </h2>
                <div className="bg-gradient-to-br from-[#1C2333]/80 to-[#131A2E]/80 border border-[#0080FF]/20 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#0080FF]/10 blur-3xl rounded-full" />
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed relative z-10">{listing.relevance}</p>
                </div>
              </motion.div>
            )}

            {/* Growth & Scale Opportunities */}
            {listing.growth?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.33 }}>
                <h2 className="text-2xl font-bold mb-5 font-display flex items-center gap-3">
                  <Rocket className="w-6 h-6 text-purple-500" /> Growth & Scale Playbook
                </h2>
                <div className="space-y-4">
                  {listing.growth.map((g: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 bg-[#131A2E]/50 border border-slate-800 rounded-xl p-5 hover:border-purple-500/30 transition-colors shadow-lg shadow-black/20 group">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold font-mono text-sm shrink-0 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                        0{i + 1}
                      </div>
                      <span className="text-slate-300 leading-relaxed mt-1 text-sm sm:text-base">{g}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {listing.metrics?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="lg:hidden"
              >
                <h2 className="text-2xl font-bold mb-5 font-display">Seller-Reported Metrics</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {listing.metrics.map((m: any, i: number) => {
                    const Icon = typeof m.icon === 'string' ? IconMap[m.icon] : m.icon;
                    return (
                      <div key={i} className="bg-[#131A2E] border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
                        {Icon && <Icon className="w-5 h-5 text-[#00FF85] mb-1" />}
                        <p className="text-white font-bold text-xl">{m.value}</p>
                        <p className="text-slate-500 text-xs">{m.label}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </div>

          {/* ── RIGHT: sticky sidebar ── */}
          <aside className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 self-start lg:sticky lg:top-24 z-20">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-[#131A2E]/90 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar"
            >

              {/* Price header */}
              <div className="px-7 pt-7 pb-5 border-b border-slate-800">
                <p className="text-slate-500 text-xs uppercase tracking-widest font-mono mb-1">Asking Price</p>
                <p className="text-4xl font-extrabold text-white font-display">
                  {listing.priceUsd != null ? formatPrice(listing.priceUsd, { suffix: listing.priceSuffix }) : "Contact seller"}
                </p>
                <span className="inline-block mt-2 text-xs bg-[#00FF85]/10 border border-[#00FF85]/30 text-[#00FF85] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  {listing.type === "saas" ? "SaaS License" : "Full Acquisition"}
                </span>
              </div>

              {listing.metrics?.length > 0 && (
                <div className="px-7 py-5 space-y-3 border-b border-slate-800">
                  {listing.metrics.map((m: any, i: number) => {
                    const Icon = typeof m.icon === 'string' ? IconMap[m.icon] : m.icon;
                    return (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          {Icon && <Icon className="w-4 h-4 text-[#00FF85]" />}
                          {m.label}
                        </span>
                        <span className="text-white font-semibold">{m.value}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CTA */}
              <div className="px-7 py-6 space-y-3">
                <Button
                  onClick={handleEnterDealRoom}
                  disabled={entering}
                  className="w-full bg-gradient-to-r from-[#00FF85] to-[#00C8FF] text-black font-bold text-base py-5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#00FF85]/20 disabled:opacity-60"
                >
                  {entering ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Enter Deal Room <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs pt-1">
                  <Lock className="w-3.5 h-3.5" />
                  Private deal room · KYC required
                </div>
              </div>
            </motion.div>
          </aside>

        </div>
      </div>

      {/* RIGHT-SIDE COMMAND DRAWER FOR ASSET MANAGEMENT (WITH FULL-PAGE OPTION) */}
      <AnimatePresence>
        {isAdminDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 h-full bg-[#0A0F1E] border-l border-slate-800 z-50 flex flex-col shadow-2xl transition-all duration-300 ${
                isDrawerFullScreen ? "w-full sm:w-[92vw]" : "w-full sm:w-[540px]"
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/80 bg-[#131A2E]/60 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0080FF]/10 p-2 rounded-lg border border-[#0080FF]/20">
                    <Briefcase className="w-5 h-5 text-[#0080FF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">Asset Dossier: {listingForm.title || listing.title}</h3>
                    <p className="text-slate-500 text-xs font-mono">{listing.id || slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 mr-2 bg-[#1C2333] px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">Live CRUD</span>
                  </div>
                  <button
                    onClick={() => setIsDrawerFullScreen(!isDrawerFullScreen)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent rounded-xl transition-all"
                    title={isDrawerFullScreen ? "Collapse Width" : "Expand Full Width"}
                  >
                    {isDrawerFullScreen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsAdminDrawerOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-hidden flex flex-col sm:flex-row bg-[#0A0F1E]">
                {/* Left Nav in Full-Page Mode */}
                {isDrawerFullScreen && (
                  <div className="w-64 border-r border-slate-800 bg-[#131A2E]/30 p-6 flex flex-col gap-1 overflow-y-auto shrink-0 hidden sm:flex">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">Management Modules</div>
                    <button className="flex items-center gap-3 text-left px-3 py-2.5 bg-[#0080FF]/10 text-[#0080FF] rounded-xl text-sm font-semibold transition-colors">
                      <Briefcase className="w-4 h-4" /> General Parameters
                    </button>
                    <button className="flex items-center gap-3 text-left px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-colors">
                      <TrendingUp className="w-4 h-4" /> Financials & MRR
                    </button>
                    <button className="flex items-center gap-3 text-left px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-colors">
                      <ShieldCheck className="w-4 h-4" /> Compliance & Registry
                    </button>
                  </div>
                )}

                {/* Form Fields */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                  <div className={`space-y-8 ${isDrawerFullScreen ? "max-w-4xl mx-auto" : ""}`}>
                    
                    {/* General Details Module */}
                    <div className="bg-[#131A2E]/50 rounded-2xl border border-slate-800/80 p-6 shadow-lg">
                      <h4 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                        <Briefcase className="w-4 h-4 text-purple-400" /> General Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Asset Title</label>
                          <input 
                            type="text" 
                            value={listingForm.title || ""} 
                            onChange={e => setListingForm({ ...listingForm, title: e.target.value })}
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0080FF] transition-all"
                            placeholder="e.g. Aura AI CRM"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Category</label>
                          <select
                            value={listingForm.category || "saas"}
                            onChange={e => setListingForm({ ...listingForm, category: e.target.value })}
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0080FF]"
                          >
                            <option value="saas">SaaS</option>
                            <option value="pos">POS</option>
                            <option value="mobile">Mobile App</option>
                            <option value="blockchain">Blockchain</option>
                            <option value="marketing">Marketing</option>
                            <option value="fintech">Fintech</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Market Status</label>
                          <select
                            value={listingForm.status || "live"}
                            onChange={e => setListingForm({ ...listingForm, status: e.target.value })}
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0080FF] font-semibold"
                          >
                            <option value="draft">Draft (Hidden)</option>
                            <option value="review">Under Review</option>
                            <option value="live">Live on Market</option>
                            <option value="sold">Sold / Closed</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Financials & Valuations Module */}
                    <div className="bg-[#131A2E]/50 rounded-2xl border border-slate-800/80 p-6 shadow-lg">
                      <h4 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Financials & Valuations
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex justify-between">
                            <span>Acquisition Price</span>
                            <span className="text-emerald-500 font-mono">USD</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                            <input 
                              type="number" 
                              value={listingForm.acquisitionPrice || ""} 
                              onChange={e => setListingForm({ ...listingForm, acquisitionPrice: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl pl-8 pr-4 py-3 text-lg text-white font-mono outline-none focus:border-emerald-500 transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex justify-between">
                            <span>Monthly License Price</span>
                            <span className="text-emerald-500 font-mono">USD</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                            <input 
                              type="number" 
                              value={listingForm.monthlyLicensePrice || ""} 
                              onChange={e => setListingForm({ ...listingForm, monthlyLicensePrice: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl pl-8 pr-4 py-3 text-lg text-white font-mono outline-none focus:border-emerald-500 transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Revenue MRR ($)</label>
                          <input 
                            type="number" 
                            value={listingForm.revenueMrr || ""} 
                            onChange={e => setListingForm({ ...listingForm, revenueMrr: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#0080FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Revenue ARR ($)</label>
                          <input 
                            type="number" 
                            value={listingForm.revenueArr || ""} 
                            onChange={e => setListingForm({ ...listingForm, revenueArr: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#0080FF]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Financial Insights Preview */}
                    <div className="bg-gradient-to-tr from-[#1C2333]/80 to-[#131A2E] border border-[#0080FF]/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <TrendingUp className="w-24 h-24 text-[#0080FF]" />
                      </div>
                      <h4 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#0080FF]" /> Financial Insights (Live Calculated)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#0A0F1E]/80 backdrop-blur-md p-4 rounded-xl border border-slate-800">
                          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Annual Run Rate</div>
                          <div className="text-emerald-400 font-mono font-bold text-xl">
                            ${(listingForm.revenueArr || (listingForm.revenueMrr * 12) || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-[#0A0F1E]/80 backdrop-blur-md p-4 rounded-xl border border-slate-800">
                          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Valuation Multiple</div>
                          <div className="text-white font-mono font-bold text-xl">
                            {(listingForm.acquisitionPrice && (listingForm.revenueArr || listingForm.revenueMrr * 12)) 
                              ? (listingForm.acquisitionPrice / (listingForm.revenueArr || listingForm.revenueMrr * 12)).toFixed(2) + "x" 
                              : "N/A"}
                          </div>
                        </div>
                        <div className="bg-[#0A0F1E]/80 backdrop-blur-md p-4 rounded-xl border border-slate-800">
                          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">MoM Growth</div>
                          <div className="text-[#0080FF] font-mono font-bold text-xl">N/A</div>
                        </div>
                        <div className="bg-[#0A0F1E]/80 backdrop-blur-md p-4 rounded-xl border border-slate-800">
                          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Profit Margin</div>
                          <div className="text-white font-mono font-bold text-xl">~85%</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-[#131A2E] flex items-center justify-between gap-4 shrink-0 shadow-2xl z-20">
                <Button
                  variant="outline"
                  onClick={() => setIsAdminDrawerOpen(false)}
                  className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-11 px-6 rounded-xl font-bold transition-all"
                >
                  Discard Changes
                </Button>
                <Button
                  onClick={handleUpdateListing}
                  disabled={isSavingListing}
                  className="bg-gradient-to-r from-[#0080FF] to-[#0066CC] hover:from-[#0066CC] hover:to-[#0055AA] text-white font-bold h-11 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-[#0080FF]/30 transition-all active:scale-95 border border-[#0080FF]/50"
                >
                  {isSavingListing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  {isSavingListing ? "Committing..." : "Commit & Save Asset"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
