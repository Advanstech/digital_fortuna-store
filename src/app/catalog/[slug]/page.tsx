"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft
} from "lucide-react";

const MOCK_DETAILS: Record<string, any> = {
  "mock-1": {
    id: "mock-1",
    title: "ModernRx POS",
    category: "Healthcare & Pharmacy",
    type: "acquisition",
    price: "$15,000",
    tagline: "The future-proof pharmacy management platform trusted by independent pharmacies.",
    description: "ModernRx POS is a full-featured point-of-sale and pharmacy management system built for independent and chain pharmacies. It streamlines prescription processing, inventory management, insurance billing, and patient records into one seamless workflow. Leveraging real-time data sync and a modern UI, it cuts checkout times by 60% and dramatically reduces billing errors.",
    highlights: ["Automated insurance claim processing", "Real-time inventory & expiry tracking", "HIPAA-compliant patient data management", "Multi-location support with central dashboard"],
    techStack: ["Next.js", "Fastify", "PostgreSQL", "Redis", "Docker", "Twilio"],
    metrics: [
      { label: "Active Pharmacies", value: "38", icon: "BarChart3" },
      { label: "MRR", value: "$3,200", icon: "DollarSign" },
      { label: "Uptime SLA", value: "99.9%", icon: "Zap" },
      { label: "Profit Margin", value: "71%", icon: "TrendingUp" },
      { label: "Compliance", value: "HIPAA", icon: "Shield" },
      { label: "Handover", value: "14 Days", icon: "Clock" },
    ],
    benefits: [
      { title: "Mission Critical Software", desc: "Pharmacies cannot operate without a POS. Once integrated, churn is functionally zero." },
      { title: "Immediate Cash Flow", desc: "Consistent $3.2k MRR with 71% net margins and minimal server overhead." },
      { title: "High Switching Costs", desc: "Patient data migration and staff training create a massive moat against competitors." }
    ],
    relevance: "Independent pharmacies are being squeezed by PBMs and need modern software to reduce overhead. ModernRx provides an enterprise-grade solution at a fraction of the cost of legacy on-premise systems.",
    growth: [
      "Upsell telemedicine and patient scheduling modules to existing clients.",
      "Launch an embedded capital/lending product for pharmacies.",
      "Expand sales motion to small chain pharmacies (5-20 locations)."
    ],
    images: ["/images/modernrx.png", "/images/aura.png", "/images/premium_hero_bg.png"],
  },
  "mock-2": {
    id: "mock-2",
    title: "FortunaEats POS",
    category: "Food & Restaurant",
    type: "acquisition",
    price: "$8,500",
    tagline: "A next-gen restaurant OS that turns tables faster and keeps kitchens humming.",
    description: "FortunaEats POS is a comprehensive restaurant management platform combining tableside ordering, kitchen display systems, delivery integrations, and real-time analytics. Built mobile-first for speed, it reduces average order-to-kitchen time by 45% and integrates natively with Uber Eats, DoorDash, and Grubhub. Perfect for restaurants serious about operational excellence.",
    highlights: ["Tableside & kiosk ordering", "Live kitchen display system", "3rd-party delivery integrations", "Daily revenue & performance analytics"],
    techStack: ["React Native", "Node.js", "MongoDB", "Socket.IO", "Stripe", "Expo"],
    metrics: [
      { label: "Active Restaurants", value: "24", icon: "BarChart3" },
      { label: "MRR", value: "$1,800", icon: "DollarSign" },
      { label: "Uptime SLA", value: "99.7%", icon: "Zap" },
      { label: "Profit Margin", value: "63%", icon: "TrendingUp" },
      { label: "Integrations", value: "5 Platforms", icon: "Shield" },
      { label: "Handover", value: "7 Days", icon: "Clock" },
    ],
    benefits: [
      { title: "Hardware Agnostic", desc: "Runs on any iPad or Android tablet, drastically reducing onboarding friction." },
      { title: "Proven PMF", desc: "Currently powering 24 active restaurants processing $2M+ in annualized GMV." },
      { title: "Turnkey Setup", desc: "Fully automated onboarding flow allows restaurants to go live in under 48 hours." }
    ],
    relevance: "Restaurants are suffering from app fatigue and high 3rd-party delivery fees. FortunaEats consolidates the stack, offering a unified hub that directly impacts their bottom line.",
    growth: [
      "Implement a per-transaction processing fee via Stripe Connect.",
      "White-label the platform for ghost kitchens and virtual brands.",
      "Build a native consumer-facing loyalty app integration."
    ],
    images: ["/images/fortunaeats.png", "/images/modernrx.png", "/images/openclaw.png"],
  },
  "mock-3": {
    id: "mock-3",
    title: "OpenCLAW Operations",
    category: "Office & Operations",
    type: "saas",
    price: "$99/mo",
    tagline: "Intelligent operations automation for lean teams that want to move fast.",
    description: "OpenCLAW is an AI-powered operations hub that automates recurring workflows, manages team tasks, tracks KPIs, and surfaces actionable insights — all in one place. It connects with Slack, Notion, Jira, and Google Workspace out of the box. Teams using OpenCLAW report a 3x improvement in cross-functional execution speed within the first 30 days.",
    highlights: ["Workflow automation engine", "AI-generated weekly ops reports", "KPI tracking & alerting", "Native Slack, Notion, Jira integrations"],
    techStack: ["SvelteKit", "NestJS", "DynamoDB", "OpenAI GPT-4", "BullMQ", "AWS Lambda"],
    metrics: [
      { label: "Active Teams", value: "110", icon: "BarChart3" },
      { label: "MRR", value: "$10,890", icon: "DollarSign" },
      { label: "Churn Rate", value: "1.8%", icon: "TrendingUp" },
      { label: "NPS Score", value: "72", icon: "Shield" },
      { label: "AI Workflows/mo", value: "50K+", icon: "Zap" },
      { label: "Plan Type", value: "SaaS", icon: "Clock" },
    ],
    benefits: [
      { title: "Highly Scalable", desc: "Serverless architecture handles 50K+ workflows seamlessly with near-zero devops." },
      { title: "Sticky Product", desc: "Once a team builds their core workflows in OpenCLAW, churn drops to 1.8%." },
      { title: "B2B Cashflow", desc: "Consistent five-figure MRR from reliable business clients." }
    ],
    relevance: "Ops teams are cutting bloated, expensive SaaS tools. OpenCLAW acts as a lightweight, AI-first automation layer that unifies disjointed systems without the enterprise price tag.",
    growth: [
      "Launch a community 'recipe' marketplace for sharing automations.",
      "Introduce an Enterprise tier with SSO and dedicated VPCs.",
      "Expand native integrations to Salesforce and Workday."
    ],
    images: ["/images/openclaw.png", "/images/aura.png", "/images/fortunaeats.png"],
  },
  "mock-4": {
    id: "mock-4",
    title: "Aura AI CRM",
    category: "Sales & Marketing",
    type: "acquisition",
    price: "$25,000",
    tagline: "An AI-native CRM that qualifies leads, drafts emails, and closes deals autonomously.",
    description: "Aura AI CRM redefines pipeline management by embedding GPT-4 directly into every step of the sales workflow. It auto-scores inbound leads, generates personalized outreach sequences, summarizes call recordings, and forecasts deal close probability in real time. Designed for high-velocity sales teams who want to spend time selling — not updating spreadsheets.",
    highlights: ["AI lead scoring & qualification", "Automated personalized email sequences", "Call transcription & AI summaries", "Pipeline forecast with confidence scores"],
    techStack: ["Python", "FastAPI", "Supabase", "Tailwind", "OpenAI", "Twilio", "Resend"],
    metrics: [
      { label: "Active Seats", value: "215", icon: "BarChart3" },
      { label: "MRR", value: "$18,500", icon: "DollarSign" },
      { label: "Churn Rate", value: "2.1%", icon: "TrendingUp" },
      { label: "AI Actions/mo", value: "120K+", icon: "Zap" },
      { label: "Integrations", value: "12+", icon: "Shield" },
      { label: "Handover", value: "21 Days", icon: "Clock" },
    ],
    benefits: [
      { title: "Disruptive Technology", desc: "First-mover advantage in the AI-native CRM space, heavily outperforming legacy tools." },
      { title: "High ACV Potential", desc: "Sales teams are willing to pay a premium for software that demonstrably increases close rates." },
      { title: "Rich Proprietary Data", desc: "Access to millions of sales interactions used to fine-tune bespoke models." }
    ],
    relevance: "The CRM market is vast but stagnant. Aura AI captures the budget shift from manual BDRs to AI-augmented sales intelligence, offering a 10x ROI for mid-market sales teams.",
    growth: [
      "Develop a voice-AI agent for automated cold-calling.",
      "Build deep, bi-directional sync with Salesforce and HubSpot to act as a co-pilot.",
      "Target agencies and brokerages with customized vertical models."
    ],
    images: ["/images/aura.png", "/images/openclaw.png", "/images/premium_hero_bg.png"],
  },
  "mock-5": {
    id: "mock-5",
    title: "Nova Ledger Web3",
    category: "Web3 & Blockchain",
    type: "acquisition",
    price: "$45,000",
    tagline: "A battle-tested DeFi accounting protocol with multi-chain treasury management.",
    description: "Nova Ledger is a Web3-native financial platform providing real-time on-chain accounting, treasury management, and audit-ready reporting for DAOs, protocols, and crypto-native companies. It supports 8 EVM chains, auto-reconciles wallet activity, and generates GAAP-compliant reports. An essential layer for any serious Web3 operation.",
    highlights: ["Multi-chain treasury dashboard", "Auto-reconciled wallet accounting", "GAAP-compliant audit reports", "DAO governance & multisig integration"],
    techStack: ["Solidity", "Next.js", "Hardhat", "The Graph", "ethers.js", "Prisma", "PostgreSQL"],
    metrics: [
      { label: "DAOs Onboarded", value: "47", icon: "BarChart3" },
      { label: "TVL Tracked", value: "$120M+", icon: "DollarSign" },
      { label: "Chains Supported", value: "8", icon: "Zap" },
      { label: "Audit Reports/mo", value: "340", icon: "TrendingUp" },
      { label: "Security Audits", value: "3 Passed", icon: "Shield" },
      { label: "Handover", value: "30 Days", icon: "Clock" },
    ],
    benefits: [
      { title: "Deep Technical Moat", desc: "Complex on-chain indexers and reconciliation engines that take years to replicate." },
      { title: "Blue Ocean Market", desc: "Few competitors can provide true GAAP compliance for multi-chain crypto treasuries." },
      { title: "High-Ticket Enterprise", desc: "DAOs and crypto foundations sign $50k+ annual contracts for this level of auditing." }
    ],
    relevance: "As regulatory scrutiny increases, crypto companies and DAOs are desperate for institutional-grade accounting. Nova Ledger solves an existential pain point for Web3 treasuries.",
    growth: [
      "Launch a native governance token to decentralize the indexing protocol.",
      "Integrate fiat off-ramps and TradFi bank APIs for complete reconciliation.",
      "Expand support to non-EVM chains like Solana and Cosmos."
    ],
    images: ["/images/premium_hero_bg.png", "/images/aura.png", "/images/openclaw.png"],
  },
  "mock-6": {
    id: "mock-6",
    title: "ChatCraft Prompt Hub",
    category: "AI Tool / Generator",
    type: "saas",
    price: "$29/mo",
    tagline: "The definitive prompt engineering platform for teams building with LLMs.",
    description: "ChatCraft Prompt Hub is a collaborative prompt management and testing platform for AI-forward teams. It provides a structured library for versioning prompts, an A/B testing framework for comparing outputs, team access controls, and an API for injecting prompts into production apps. It sits between your team and the LLM, ensuring quality and consistency at scale.",
    highlights: ["Versioned prompt library with diff view", "A/B testing framework for LLM outputs", "API-first for production injection", "Team roles & shared workspaces"],
    techStack: ["OpenAI GPT-4", "Next.js", "Redis", "Prisma", "PostgreSQL", "Vercel AI SDK"],
    metrics: [
      { label: "Active Teams", value: "320", icon: "BarChart3" },
      { label: "MRR", value: "$9,280", icon: "DollarSign" },
      { label: "Churn Rate", value: "1.2%", icon: "TrendingUp" },
      { label: "Prompts Stored", value: "500K+", icon: "Zap" },
      { label: "Plan Type", value: "SaaS", icon: "Clock" },
    ],
    benefits: [
      { title: "Immediate Cash Flow", desc: "Generating nearly $10k MRR with highly sticky enterprise clients and exceptionally low churn." },
      { title: "Defensible Moat", desc: "Proprietary prompt-diffing engine and built-in A/B testing infrastructure that took 14 months to engineer." },
      { title: "Turnkey Operations", desc: "Fully automated billing via Stripe and self-serve onboarding. Requires less than 5 hours of maintenance a week." },
      { title: "High-Margin Infrastructure", desc: "Optimized serverless architecture costing less than $200/mo, maintaining a 90%+ profit margin." }
    ],
    relevance: "The Generative AI market is exploding, but enterprise teams are struggling with 'prompt drift' and inconsistent LLM outputs in production. ChatCraft solves this by providing a unified Git-like version control system for prompts. It is highly relevant to any B2B SaaS company, AI agency, or enterprise engineering team currently building features on top of OpenAI, Anthropic, or open-source models.",
    growth: [
      "Enterprise Sales Motion: Move upmarket by introducing SOC2 compliance and SSO, increasing ACV from $29/mo to $499/mo per team.",
      "Marketplace Integration: Launch a public prompt marketplace where creators can sell specialized prompts, taking a 20% platform fee.",
      "SDK Expansion: Release native SDKs for Python and Go (currently only TS/JS) to capture backend engineering teams."
    ],
    images: ["/images/modernrx.png", "/images/premium_hero_bg.png", "/images/fortunaeats.png"],
  },
};

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
  const [activeImage, setActiveImage] = useState(0);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`http://localhost:4000/v1/listings/${slug}`);
        if (res.ok) {
          const resJson = await res.json();
          const apiData = resJson.data || resJson;
          
          // If the backend returns a generic placeholder (like mock-1) instead of the actual slug, use the high-fidelity frontend mock.
          if (MOCK_DETAILS[slug] && apiData.id !== slug) {
            setListing(MOCK_DETAILS[slug]);
          } else {
            // Merge with local MOCK_DETAILS to ensure images, metrics, and highlights are populated even if API omits them
            setListing({ ...(MOCK_DETAILS[slug] || {}), ...apiData });
          }
        } else {
          setListing(MOCK_DETAILS[slug] ?? null);
        }
      } catch {
        setListing(MOCK_DETAILS[slug] ?? null);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [slug]);

  const handleEnterDealRoom = async () => {
    setEntering(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      if (!token) {
        router.push("/auth");
        return;
      }
      const res = await fetch("http://localhost:4000/v1/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId: listing.id }),
      });
      if (res.ok) {
        const deal = await res.json();
        router.push(`/deal/${deal.id}`);
      } else {
        router.push(`/deal/${listing.id}`);
      }
    } catch {
      router.push(`/deal/${listing?.id ?? slug}`);
    } finally {
      setEntering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-10 h-10 text-[#00FF85] animate-spin" />
        <p className="font-mono text-xs tracking-widest uppercase text-slate-500">Retrieving asset dossier…</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] pt-32 flex flex-col items-center justify-center text-white gap-4">
        <p className="text-slate-400">Asset not found in registry.</p>
        <button onClick={() => router.back()} className="text-[#00FF85] text-sm underline">← Back to Catalog</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white">
      {/* Ambient glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#0080FF]/6 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#00FF85]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-24 relative z-10">

        {/* Back nav */}
        <button
          onClick={() => router.push("/catalog")}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </button>

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── LEFT: scrollable content ── */}
          <div className="flex-1 min-w-0 space-y-12">

            {/* Category pill + title + tagline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block text-[#00FF85] text-xs font-mono uppercase tracking-widest mb-4 border border-[#00FF85]/30 bg-[#00FF85]/8 px-3 py-1 rounded-full">
                {listing.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4 font-display">
                {listing.title}
              </h1>
              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
                {listing.tagline}
              </p>
            </motion.div>

            {/* Image gallery */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[16/9]">
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
                      src={listing.images?.[activeImage] ?? listing.imageUrl ?? "/images/premium_hero_bg.png"}
                      alt={listing.title || "Listing Cover Image"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

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
                      <Image src={img} alt="Thumbnail" fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Overview */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 className="text-2xl font-bold mb-4 font-display">Overview</h2>
              <p className="text-slate-300 text-lg leading-relaxed">{listing.description}</p>
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

            {/* Metrics grid (mobile — hidden on lg) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="lg:hidden"
            >
              <h2 className="text-2xl font-bold mb-5 font-display">Asset Metrics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {listing.metrics?.map((m: any, i: number) => {
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

          </div>

          {/* ── RIGHT: sticky sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 lg:sticky lg:top-28"
          >
            <div className="bg-[#131A2E]/90 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">

              {/* Price header */}
              <div className="px-7 pt-7 pb-5 border-b border-slate-800">
                <p className="text-slate-500 text-xs uppercase tracking-widest font-mono mb-1">Asking Price</p>
                <p className="text-4xl font-extrabold text-white font-display">{listing.price}</p>
                <span className="inline-block mt-2 text-xs bg-[#00FF85]/10 border border-[#00FF85]/30 text-[#00FF85] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  {listing.type === "saas" ? "SaaS License" : "Full Acquisition"}
                </span>
              </div>

              {/* Metrics */}
              <div className="px-7 py-5 space-y-3 border-b border-slate-800">
                {listing.metrics?.map((m: any, i: number) => {
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
                  End-to-end encrypted · Escrow-protected
                </div>
              </div>
            </div>
          </motion.aside>

        </div>
      </div>
    </main>
  );
}
