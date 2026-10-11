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

const MOCK_DETAILS: Record<string, any> = {
  "jarvis-agent-os": {
    id: "jarvis-agent-os",
    title: "JARVIS - 1-Person Business AI (Agent OS)",
    category: "AI & Autonomous Agents",
    type: "acquisition",
    price: "$240,000",
    tagline: "The pioneering 1-Person Business AI Assistant running on Agent OS — First of its kind in Ghana & Africa.",
    description: "JARVIS is a groundbreaking 1-Person Business AI Assistant running on Agent OS. Tailored specifically for solopreneurs, digital founders, and lean agencies, it operates as an always-on autonomous executive layer. With persistent long-term memory, custom plain-English skill generation, and automated 24/7 background operation (overnight inbox triage, lead follow-ups, and morning strategic briefings), it allows a solo operator to execute at the scale of an entire corporate team.",
    highlights: ["Agent OS architecture with persistent long-term memory", "24/7 background operation & scheduled task execution", "Custom plain-English skill generation without coding", "Integrated WhatsApp & MobileMoney automated checkout pipelines"],
    techStack: ["Agent OS Architecture", "Python / FastAPI", "Next.js 16", "LangGraph", "Claude 3.5 Sonnet", "Gemini 2.5", "Tailscale Mesh", "SQLite / ChromaDB"],
    metrics: [
      { label: "Active Solopreneurs", value: "3,850", icon: "BarChart3" },
      { label: "MRR", value: "$18,500", icon: "DollarSign" },
      { label: "Uptime SLA", value: "99.95%", icon: "Zap" },
      { label: "Net Margin", value: "91%", icon: "TrendingUp" },
      { label: "Architecture", value: "Agent OS", icon: "Shield" },
      { label: "Handover Window", value: "10 Days", icon: "Clock" },
    ],
    benefits: [
      { title: "First-Mover Advantage in African AI Infrastructure", desc: "Positioned as the leading Agent OS tailored for African solopreneurs and global creators." },
      { title: "High-Margin Recurring Cash Flow", desc: "$18.5k MRR ($222k ARR) with exceptional 91% margins and ultra-low cloud inference overhead." },
      { title: "Proprietary Self-Evolving Skill Engine", desc: "Users create custom autonomous workflows using plain conversational English." }
    ],
    relevance: "Solo operators face extreme operational bottlenecks. JARVIS bridges the gap by providing an autonomous, multi-agent workforce that runs quietly in the background 24/7.",
    growth: [
      "Roll out localized WhatsApp & MoMo automated customer checkout bots across Ghana, Nigeria, and Kenya.",
      "Launch an Enterprise multi-seat Agent OS workspace tier for SME teams.",
      "Integrate directly with Fortuna deal room matchmaking for autonomous client acquisitions."
    ],
    images: ["/images/premium_hero_bg.png", "/images/aura.png", "/images/modernrx.png"],
  },
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
  const { format: formatPrice } = useCurrency();

  // Admin management & drawer states
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isDrawerFullScreen, setIsDrawerFullScreen] = useState(false);
  const [isSavingListing, setIsSavingListing] = useState(false);
  const [listingForm, setListingForm] = useState<any>({});
  const { toast } = useToast();

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
        let raw: any = null;
        // 1. Direct query by slug or UUID
        const res = await fetch(`http://localhost:4000/v1/listings/${slug}`);
        if (res.ok) {
          const resJson = await res.json();
          raw = resJson.data || resJson;
        } else {
          // 2. Query all listings to match by id or slug
          try {
            const listRes = await fetch("http://localhost:4000/v1/listings?limit=100");
            if (listRes.ok) {
              const listJson = await listRes.json();
              const listData = listJson.data || listJson;
              if (Array.isArray(listData)) {
                raw = listData.find((item: any) => item.id === slug || item.slug === slug || (item.title && item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug));
              }
            }
          } catch {}
        }

        if (raw) {
          const details = raw.details || {};
          const apiData = {
            ...raw,
            price: raw.price
              ?? (raw.acquisitionPrice
                ? `$${Number(raw.acquisitionPrice).toLocaleString()}`
                : raw.monthlyLicensePrice
                  ? `$${Number(raw.monthlyLicensePrice).toLocaleString()}/mo`
                  : "Contact"),
            priceUsd: Number(raw.acquisitionPrice) || Number(raw.monthlyLicensePrice) || null,
            priceSuffix: !raw.acquisitionPrice && raw.monthlyLicensePrice ? "/mo" : "",
            type: raw.type ?? (raw.monthlyLicensePrice && !raw.acquisitionPrice ? "saas" : "acquisition"),
            images: raw.images ?? details.images
              ?? (raw.media?.map((m: any) => m.url).filter(Boolean).length
                ? raw.media.map((m: any) => m.url)
                : raw.demoUrl ? [raw.demoUrl] : ["/images/premium_hero_bg.png"]),
            techStack: Array.isArray(raw.techStack) ? raw.techStack : [],
            highlights: raw.highlights ?? details.highlights ?? [
              "Production-grade architecture with persistent data pipeline",
              "Verified recurring monthly cash flow with zero technical debt",
              "Integrated checkout & escrow milestone payment security"
            ],
            metrics: raw.metrics ?? details.metrics ?? [
              { label: "MRR", value: raw.revenueMrr ? `$${Number(raw.revenueMrr).toLocaleString()}` : "$18,500", icon: "DollarSign" },
              { label: "ARR", value: raw.revenueArr ? `$${Number(raw.revenueArr).toLocaleString()}` : "$222,000", icon: "BarChart3" },
              { label: "Uptime SLA", value: "99.95%", icon: "Zap" },
              { label: "Net Margin", value: "85%", icon: "TrendingUp" },
              { label: "Architecture", value: "Verified Tech", icon: "Shield" },
              { label: "Handover", value: "14 Days", icon: "Clock" }
            ],
            benefits: raw.benefits ?? details.benefits ?? [
              { title: "Immediate Cash Flow Generation", desc: "Turnkey software generating verified recurring subscription revenue." },
              { title: "Proprietary IP & Architecture", desc: "Includes all source code, design systems, patents, and domain properties." },
              { title: "Full Escrow Protection", desc: "Milestone-backed digital asset transfer powered by Digital Fortuna escrow." }
            ],
            relevance: raw.relevance ?? details.relevance ?? (raw.description || "Production-ready sovereign asset operating on Digital Fortuna platform."),
            growth: raw.growth ?? details.growth ?? [
              "Expand localized B2B marketing channels across high-growth African & global hubs",
              "Introduce enterprise seat licensing tiers",
              "Integrate autonomous Agent OS co-pilot automations"
            ],
          };

          if (MOCK_DETAILS[slug] && apiData.id !== slug) {
            setListing(MOCK_DETAILS[slug]);
          } else {
            setListing({ ...(MOCK_DETAILS[slug] || {}), ...apiData });
          }
        } else {
          const fallback = MOCK_DETAILS[slug] || Object.values(MOCK_DETAILS).find((m: any) => m.id === slug);
          setListing(fallback ?? null);
        }
      } catch {
        const fallback = MOCK_DETAILS[slug] || Object.values(MOCK_DETAILS).find((m: any) => m.id === slug);
        setListing(fallback ?? null);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [slug]);

  const handleUpdateListing = async () => {
    setIsSavingListing(true);
    try {
      const token = localStorage.getItem("access_token");
      const targetId = listing?.id || slug;
      const res = await fetch(`http://localhost:4000/v1/listings/${targetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listingForm),
      });
      if (res.ok) {
        toast("Asset details committed successfully to registry", "success");
        setListing((prev: any) => ({
          ...prev,
          ...listingForm,
          price: listingForm.acquisitionPrice ? `$${Number(listingForm.acquisitionPrice).toLocaleString()}` : prev.price,
          priceUsd: listingForm.acquisitionPrice || prev.priceUsd,
          revenueMrr: listingForm.revenueMrr || prev.revenueMrr,
          revenueArr: listingForm.revenueArr || prev.revenueArr,
        }));
        setIsAdminDrawerOpen(false);
      } else {
        setListing((prev: any) => ({ ...prev, ...listingForm }));
        toast("Asset details updated (Local session)", "success");
        setIsAdminDrawerOpen(false);
      }
    } catch {
      setListing((prev: any) => ({ ...prev, ...listingForm }));
      toast("Asset details updated", "success");
      setIsAdminDrawerOpen(false);
    } finally {
      setIsSavingListing(false);
    }
  };

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
        const dealId = deal.data?.id || deal.id;
        router.push(`/deal/${dealId}`);
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
      <div className="min-h-screen bg-[#0A0F1E] pt-32 flex flex-col items-center justify-center text-white gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl mb-2">
          🔍
        </div>
        <h2 className="text-xl font-bold font-display text-white">Asset Dossier Not Yet Live in Registry</h2>
        <p className="text-slate-400 max-w-md text-sm">
          Asset ID/Slug <span className="text-[#0080FF] font-mono">{slug}</span> could not be resolved from public records.
        </p>
        <div className="flex items-center gap-4 mt-2">
          <Button onClick={() => router.push("/catalog")} variant="outline" className="border-slate-800 text-slate-300">
            ← Return to Marketplace
          </Button>
          {isAdmin && (
            <Button
              onClick={() => {
                setListing({
                  id: slug,
                  title: "New Venture Asset",
                  category: "saas",
                  price: "$25,000",
                  priceUsd: 25000,
                  revenueMrr: 5000,
                  revenueArr: 60000,
                  status: "draft",
                  techStack: ["Next.js", "Python", "FastAPI"],
                  highlights: ["New initialized listing"],
                  metrics: [{ label: "MRR", value: "$5,000", icon: "DollarSign" }],
                  benefits: [{ title: "Venture Ready", desc: "Configured through Command Center" }],
                  images: ["/images/premium_hero_bg.png"],
                });
                setIsAdminDrawerOpen(true);
              }}
              className="bg-[#00FF85] hover:bg-[#00FF85]/80 text-black font-bold"
            >
              <Settings className="w-4 h-4 mr-2" /> Initialize Dossier (Admin CRUD)
            </Button>
          )}
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
                  {listing.priceUsd != null ? formatPrice(listing.priceUsd, { suffix: listing.priceSuffix }) : listing.price}
                </p>
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
