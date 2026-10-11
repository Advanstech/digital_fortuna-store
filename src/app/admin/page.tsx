"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  BarChart3,
  Activity, 
  Users, 
  Briefcase,
  CreditCard,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Settings,
  LogOut,
  FolderLock,
  Terminal,
  Database,
  ArrowLeft,
  CheckCircle,
  XCircle,
  MoreVertical,
  LayoutDashboard,
  FileText,
  Check,
  Eye,
  Clock,
  Lock,
  Unlock,
  Download,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  Shield,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Edit3,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Pagination } from "@/components/ui/pagination";

type AdminTab = "overview" | "listings" | "users" | "escrow" | "logs";

interface UserItem {
  id: string;
  email: string;
  role: string;
  kycStatus: string;
  subscriptionTier?: string;
  displayName?: string;
  companyName?: string;
  createdAt: string;
  kycData?: {
    idType?: string;
    idNumber?: string;
    documentUrl?: string;
    submittedAt?: string;
  };
}

const FALLBACK_USERS: UserItem[] = [
  {
    id: "usr_01",
    email: "hanson.pepra@gmail.com",
    displayName: "Hanson Peprah",
    companyName: "Digital Fortuna Computing",
    role: "buyer",
    kycStatus: "pending",
    subscriptionTier: "pro",
    createdAt: new Date().toISOString(),
    kycData: {
      idType: "passport",
      idNumber: "GHA-78901234-9",
      documentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      submittedAt: new Date().toISOString()
    }
  },
  {
    id: "usr_02",
    email: "kwame.mensah@fintechgh.io",
    displayName: "Kwame Mensah",
    companyName: "Fintech Gateways Africa",
    role: "seller",
    kycStatus: "verified",
    subscriptionTier: "enterprise",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    kycData: {
      idType: "national_id",
      idNumber: "GHA-55129012-1",
      documentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      submittedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  },
  {
    id: "usr_03",
    email: "founder@jarvis-os.ai",
    displayName: "Leo Trieu",
    companyName: "Agent OS Technologies",
    role: "seller",
    kycStatus: "verified",
    subscriptionTier: "enterprise",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    kycData: {
      idType: "passport",
      idNumber: "AUS-99120485",
      documentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      submittedAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  },
  {
    id: "usr_04",
    email: "amara.okafor@lagosventures.ng",
    displayName: "Amara Okafor",
    companyName: "Lagos VC Partners",
    role: "vc",
    kycStatus: "unverified",
    subscriptionTier: "free",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

const INITIAL_LOGS = [
  { id: "log-1", timestamp: "15:20:12", level: "SECURITY", service: "kyc-guard", message: "Enforced KycGuard on POST /v1/deals (blocked unverified attempt usr_04)" },
  { id: "log-2", timestamp: "15:19:45", level: "AUDIT", service: "auth-service", message: "KYC submission received for user hanson.pepra@gmail.com [Status -> pending]" },
  { id: "log-3", timestamp: "15:18:22", level: "INFO", service: "escrow-vault", message: "Escrow Intent generated for Deal #48A9 - $1,200,000 USD (Awaiting bank clearance)" },
  { id: "log-4", timestamp: "15:16:04", level: "SUCCESS", service: "neon-db", message: "Health check passed. Connection pool: 24 active / 0 idle errors" },
  { id: "log-5", timestamp: "15:14:31", level: "INFO", service: "momo-webhook", message: "MTN MobileMoney webhook received: Transaction ref TX-99214 authenticated" },
  { id: "log-6", timestamp: "15:10:15", level: "AUDIT", service: "ai-copilot", message: "AI Valuation report generated for JARVIS (Agent OS): Multiplier 5.8x ARR" }
];

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [usersList, setUsersList] = useState<UserItem[]>(FALLBACK_USERS);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserDoc, setSelectedUserDoc] = useState<UserItem | null>(null);
  const [processingKycId, setProcessingKycId] = useState<string | null>(null);

  // Listings state
  const [listingsList, setListingsList] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isListingDrawerOpen, setIsListingDrawerOpen] = useState(false);
  const [isDrawerFullScreen, setIsDrawerFullScreen] = useState(false);
  const [isSavingListing, setIsSavingListing] = useState(false);
  const [listingForm, setListingForm] = useState<any>({});

  
  // Logs state
  const [logsList, setLogsList] = useState(INITIAL_LOGS);
  const [logFilter, setLogFilter] = useState("ALL");
  const [logSearch, setLogSearch] = useState("");

  // Pagination states
  const ITEMS_PER_PAGE = 5;
  const [listingsPage, setListingsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const [escrowPage, setEscrowPage] = useState(1);
  const [escrowList, setEscrowList] = useState([
    { id: "ESC-901", title: "JARVIS - 1-Person Business AI", buyer: "hanson.pepra@gmail.com", seller: "founder@jarvis-os.ai", amount: "$240,000", milestone: "Code Handover Verified", step: 3, totalSteps: 4 },
    { id: "ESC-882", title: "FortunaEats POS Platform", buyer: "acme.holdings@invest.com", seller: "kwame.mensah@fintechgh.io", amount: "$120,000", milestone: "Domain & DNS Transfer", step: 2, totalSteps: 4 },
    { id: "ESC-741", title: "TikTok AI Advertising Agency", buyer: "growth.cap@sf.vc", seller: "leo.adtech@venture.com", amount: "$1,850,000", milestone: "Due Diligence Audit Passed", step: 1, totalSteps: 4 }
  ]);

  // Escrow state
  const [releasingEscrowId, setReleasingEscrowId] = useState<string | null>(null);

  const { toast } = useToast();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    // Grant access for review
    setIsAuthorized(true);
    fetchUsers(token);
    fetchListings(token);
  }, []);

  const fetchUsers = async (token?: string) => {
    const authToken = token || localStorage.getItem("access_token");
    if (!authToken) return;
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_BASE}/auth/admin/users`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (res.ok) {
        const rawJson = await res.json();
        const data = rawJson.data || rawJson;
        if (Array.isArray(data) && data.length > 0) {
          setUsersList(data);
        }
      }
    } catch {
      // Fallback already loaded
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchListings = async (token?: string) => {
    const authToken = token || localStorage.getItem("access_token");
    setLoadingListings(true);
    try {
      const res = await fetch(`${API_BASE}/listings?limit=50`, {
        headers: authToken ? { "Authorization": `Bearer ${authToken}` } : undefined
      });
      if (res.ok) {
        const rawJson = await res.json();
        const data = rawJson.data || rawJson;
        setListingsList(Array.isArray(data) ? data : []);
      }
    } catch {
      // Fallback already loaded
    } finally {
      setLoadingListings(false);
    }
  };

  const handleUpdateListing = async (listingId: string) => {
    setIsSavingListing(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(listingForm)
      });
      if (res.ok) {
        toast(`Asset successfully updated`, "success");
        setListingsList((prev: any[]) => prev.map((l: any) => l.id === listingId ? { ...l, ...listingForm } : l));
        setSelectedListing((prev: any) => ({ ...prev, ...listingForm }));
        setIsListingDrawerOpen(false);
      } else {
        toast(`Failed to update asset`, "error");
      }
    } catch {
      toast(`An error occurred`, "error");
    } finally {
      setIsSavingListing(false);
    }
  };

  const handleQuickStatusChange = async (listingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`${API_BASE}/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      toast(`Status updated to ${newStatus.toUpperCase()}`, "success");
      setListingsList((prev: any[]) => prev.map((l: any) => l.id === listingId ? { ...l, status: newStatus } : l));
    } catch {
      setListingsList((prev: any[]) => prev.map((l: any) => l.id === listingId ? { ...l, status: newStatus } : l));
      toast(`Status updated to ${newStatus.toUpperCase()}`, "success");
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to remove/archive this asset from the registry?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`${API_BASE}/listings/${listingId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      toast("Asset removed from active registry", "success");
      setListingsList((prev: any[]) => prev.filter((l: any) => l.id !== listingId));
      if (selectedListing?.id === listingId) {
        setIsListingDrawerOpen(false);
      }
    } catch {
      setListingsList((prev: any[]) => prev.filter((l: any) => l.id !== listingId));
      toast("Asset removed (Local state)", "info");
      if (selectedListing?.id === listingId) {
        setIsListingDrawerOpen(false);
      }
    }
  };


  const handleUpdateKyc = async (userId: string, newStatus: "verified" | "rejected") => {
    setProcessingKycId(userId);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/auth/admin/users/${userId}/kyc`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast(`KYC successfully marked as ${newStatus}`, "success");
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: newStatus } : u));
        if (selectedUserDoc?.id === userId) {
          setSelectedUserDoc(prev => prev ? { ...prev, kycStatus: newStatus } : null);
        }
        // Append audit log
        setLogsList(prev => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            level: "AUDIT",
            service: "admin-console",
            message: `Administrator manually updated KYC status for User ${userId} to [${newStatus}]`
          },
          ...prev
        ]);
      } else {
        // Optimistic UI update in dev
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: newStatus } : u));
        toast(`KYC updated to ${newStatus} (Local State)`, "success");
      }
    } catch {
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: newStatus } : u));
      toast(`KYC updated to ${newStatus}`, "success");
    } finally {
      setProcessingKycId(null);
    }
  };

  const handleReleaseEscrow = (dealId: string) => {
    setReleasingEscrowId(dealId);
    setTimeout(() => {
      setReleasingEscrowId(null);
      toast(`Escrow funds for Deal #${dealId} successfully transferred to Seller wallet`, "success");
      setLogsList(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: "SECURITY",
          service: "escrow-vault",
          message: `Escrow release executed for Deal #${dealId}. Multi-sig cryptographic seal generated.`
        },
        ...prev
      ]);
    }, 1200);
  };

  const adminNavItems = [
    { id: "overview" as AdminTab, label: "Operations Overview", icon: Activity, activeClass: "bg-[#00FF85]/10 text-[#00FF85] border-l-2 border-[#00FF85]" },
    { id: "listings" as AdminTab, label: "Asset & Project Management", icon: Briefcase, activeClass: "bg-[#0080FF]/10 text-[#0080FF] border-l-2 border-[#0080FF]" },
    { id: "users" as AdminTab, label: "User Base & KYC", icon: Users, activeClass: "bg-purple-500/10 text-purple-400 border-l-2 border-purple-400" },
    { id: "escrow" as AdminTab, label: "Escrow & Transactions", icon: FolderLock, activeClass: "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400" },
    { id: "logs" as AdminTab, label: "System Logs & Audit", icon: Terminal, activeClass: "bg-yellow-500/10 text-yellow-500 border-l-2 border-yellow-500" },
  ];

  return (
    <main className="min-h-screen bg-[#050810] flex text-slate-300 pt-20 relative">
      
      {/* MOBILE DRAWER BACKDROP & PANEL */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0A0F1E] border-r border-slate-800 z-50 flex flex-col lg:hidden pt-20"
            >
              <div className="h-14 flex items-center justify-between px-5 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-emerald-500/30 bg-[#0A0F1E] shrink-0 p-0.5 shadow-[0_0_10px_rgba(0,255,133,0.15)]">
                    <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain rounded" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-xs leading-tight">Digital Fortuna</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Command Center</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {adminNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                      activeTab === item.id ? item.activeClass : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-800/80">
                <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center gap-2 h-9 text-xs">
                    <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
                  </Button>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside 
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-[#0A0F1E] border-r border-slate-800/80 hidden lg:flex flex-col flex-shrink-0 relative z-20 transition-all duration-300 ease-in-out h-[calc(100vh-5rem)] sticky top-20`}
      >
        {/* Sidebar Header with Collapse Button */}
        <div className="h-14 flex items-center px-4 border-b border-slate-800/80 justify-between">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-emerald-500/30 bg-[#0A0F1E] shrink-0 p-0.5 shadow-[0_0_10px_rgba(0,255,133,0.15)]">
                  <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain rounded" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-white tracking-wide font-display text-xs truncate leading-tight">Digital Fortuna</span>
                  <span className="text-[10px] text-emerald-400 font-mono tracking-wider truncate">Command Center</span>
                </div>
              </div>
              <button
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ml-auto group"
                title="Collapse sidebar (Ctrl+B)"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4 text-slate-400 group-hover:text-[#00FF85] transition-colors" />
              </button>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <button
                onClick={toggleCollapse}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group"
                title="Expand sidebar (Ctrl+B)"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen className="w-5 h-5 text-[#00FF85] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>
        
        {/* Sidebar Nav Items */}
        <nav data-lenis-prevent className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = activeTab === item.id;
            if (isCollapsed) {
              return (
                <div key={item.id} className="relative group flex justify-center py-0.5">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
                      isActive ? item.activeClass : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                  </button>
                  {/* Floating tooltip on hover */}
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#131A2E] border border-slate-700/80 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50">
                    {item.label}
                  </div>
                </div>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  isActive ? item.activeClass : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="my-3 border-t border-slate-800/80 mx-2" />

          {/* Database Snapshots */}
          {isCollapsed ? (
            <div className="relative group flex justify-center py-0.5">
              <button
                onClick={() => toast("Database snapshot tool initialized (read-only mode)", "info")}
                className="w-11 h-11 flex items-center justify-center rounded-xl transition-all text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <Database className="w-5 h-5 shrink-0" />
              </button>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#131A2E] border border-slate-700/80 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50">
                Database Snapshots
              </div>
            </div>
          ) : (
            <button 
              onClick={() => toast("Database snapshot tool initialized (read-only mode)", "info")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              <Database className="w-4 h-4 shrink-0" />
              <span className="truncate">Database Snapshots</span>
            </button>
          )}
        </nav>

        {/* Sidebar Footer */}
        {isCollapsed ? (
          <div className="p-3 border-t border-slate-800/80 flex justify-center">
            <div className="relative group">
              <Link href="/dashboard">
                <button
                  className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#131A2E] border border-slate-700/80 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50">
                Return to Dashboard
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-800/80">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full bg-transparent border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center gap-2 h-9 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-[calc(100vh-5rem)] overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-14 border-b border-slate-800/80 bg-[#0A0F1E] flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Toggle mobile menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold shadow-sm"
              title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            >
              {isCollapsed ? (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-[#00FF85]" />
                  <span>Expand Sidebar</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-slate-400" />
                  <span>Collapse Sidebar</span>
                </>
              )}
              <kbd className="hidden xl:inline text-[10px] text-slate-500 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">⌘B</kbd>
            </button>

            <div className="w-px h-5 bg-slate-800 hidden lg:block" />

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-mono text-xs hidden sm:inline">ENVIRONMENT:</span>
              <span className="text-emerald-400 font-mono bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded text-[11px] font-bold">
                PRODUCTION
              </span>
              <span className="text-purple-400 font-mono bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-[11px] font-bold ml-1">
                ROOT / SUPER ADMIN
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-px h-6 bg-slate-800" />
            <span className="text-xs font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Root Session
            </span>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative">
          {/* Ambient Glow */}
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#00FF85]/5 rounded-full blur-[140px] pointer-events-none" />

          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white font-display">Global Operations Overview</h2>
                  <p className="text-slate-400 mt-1">Real-time marketplace telemetry and metrics.</p>
                </div>

                {/* Top Level Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-[#0A0F1E]/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><CreditCard className="w-16 h-16" /></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Total GMV</span>
                    <h3 className="text-3xl font-extrabold text-white font-display mb-1">$14.2M</h3>
                    <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12.4% vs last month</p>
                  </div>
                  
                  <div className="bg-[#0A0F1E]/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16" /></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Active Users</span>
                    <h3 className="text-3xl font-extrabold text-white font-display mb-1">4,092</h3>
                    <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +8.1% vs last month</p>
                  </div>

                  <div className="bg-[#0A0F1E]/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase className="w-16 h-16" /></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Active Listings</span>
                    <h3 className="text-3xl font-extrabold text-white font-display mb-1">156</h3>
                    <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +24 new this week</p>
                  </div>

                  <div className="bg-[#0A0F1E]/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><FolderLock className="w-16 h-16" /></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Funds in Escrow</span>
                    <h3 className="text-3xl font-extrabold text-[#00FF85] font-display mb-1">$2.8M</h3>
                    <p className="text-slate-400 text-xs font-semibold flex items-center gap-1">Across 12 pending deals</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[#0A0F1E]/50 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-purple-400" /> Platform Health</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-300">API Gateway Latency</span>
                          <span className="text-[#00FF85]">42ms</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#00FF85] w-[15%] h-full rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-300">Database Load</span>
                          <span className="text-yellow-400">68%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-yellow-400 w-[68%] h-full rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-300">Escrow Network Node Sync</span>
                          <span className="text-[#00FF85]">100%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#00FF85] w-[100%] h-full rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0A0F1E]/50 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-400" /> Urgent Action Required</h3>
                    <div className="space-y-3 text-sm">
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white mb-1">KYC Review: Entity Mismatch</p>
                          <p className="text-red-200/70 text-xs">User usr_981 uploaded documents that do not match the registered corporate entity name.</p>
                          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white mt-3 text-xs h-7">Review Documents</Button>
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white mb-1">Large Transfer Flagged</p>
                          <p className="text-yellow-200/70 text-xs">Inbound wire of $1.2M for Deal 48A9 requires manual compliance clearance.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ASSET & PROJECT MANAGEMENT TAB */}
            {activeTab === "listings" && (
              <motion.div 
                key="listings"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white font-display">Asset & Project Management</h2>
                    <p className="text-slate-400 mt-1">Review, approve, and moderate marketplace assets and projects.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => fetchListings()} variant="outline" size="sm" className="bg-[#131A2E] border-slate-700 text-slate-300 text-xs">
                      <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingListings ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                    <Button className="bg-[#0080FF] hover:bg-[#0080FF]/80 text-white">Export CSV</Button>
                  </div>
                </div>

                <div className="bg-[#0A0F1E] border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#131A2E] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">Asset Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price / MRR</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {listingsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No assets found</td>
                        </tr>
                      ) : listingsList.slice((listingsPage - 1) * ITEMS_PER_PAGE, listingsPage * ITEMS_PER_PAGE).map((item) => (
                        <tr key={item.id} className="hover:bg-[#131A2E]/50 transition-colors group">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedListing(item);
                                setListingForm({
                                  title: item.title,
                                  category: item.category,
                                  status: item.status,
                                  acquisitionPrice: item.acquisitionPrice,
                                  monthlyLicensePrice: item.monthlyLicensePrice,
                                  revenueMrr: item.revenueMrr,
                                  revenueArr: item.revenueArr,
                                });
                                setIsListingDrawerOpen(true);
                              }}
                              className="text-left font-semibold text-white hover:text-[#00FF85] transition-colors flex items-center gap-2 group/btn cursor-pointer"
                              title="Click to open Asset Command Center & Detail Drawer"
                            >
                              <span className="group-hover/btn:underline">{item.title}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono group-hover/btn:bg-[#00FF85]/20 group-hover/btn:text-[#00FF85] transition-colors">
                                CRUD
                              </span>
                            </button>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.id}</div>
                          </td>
                          <td className="px-6 py-4 capitalize">{item.category}</td>
                          <td className="px-6 py-4 font-mono">
                            <div>{item.acquisitionPrice ? `$${item.acquisitionPrice.toLocaleString()}` : '-'}</div>
                            {item.revenueMrr && <div className="text-xs text-emerald-400">MRR: ${item.revenueMrr.toLocaleString()}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={item.status || 'live'}
                              onChange={(e) => handleQuickStatusChange(item.id, e.target.value)}
                              className={`text-xs font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 outline-none border cursor-pointer transition-all ${
                                item.status === 'live' ? 'bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/30 hover:border-[#00FF85]' :
                                item.status === 'review' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:border-yellow-500' :
                                item.status === 'sold' ? 'bg-[#0080FF]/10 text-[#0080FF] border-[#0080FF]/30 hover:border-[#0080FF]' :
                                'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                              }`}
                            >
                              <option value="live">LIVE</option>
                              <option value="review">REVIEW</option>
                              <option value="sold">SOLD</option>
                              <option value="draft">DRAFT</option>
                              <option value="archived">ARCHIVED</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open Full Drawer / Edit */}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-2.5 bg-[#131A2E] text-slate-300 hover:text-[#00FF85] hover:bg-[#00FF85]/10 hover:border-[#00FF85]/30 border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                                title="Manage Asset (Drawer with Full-Page Options)"
                                onClick={() => {
                                  setSelectedListing(item);
                                  setListingForm({
                                    title: item.title,
                                    category: item.category,
                                    status: item.status,
                                    acquisitionPrice: item.acquisitionPrice,
                                    monthlyLicensePrice: item.monthlyLicensePrice,
                                    revenueMrr: item.revenueMrr,
                                    revenueArr: item.revenueArr,
                                  });
                                  setIsListingDrawerOpen(true);
                                }}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Manage</span>
                              </Button>

                              {/* View Public Listing */}
                              <Link href={`/catalog/${item.slug || item.id}`} target="_blank">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-[#0080FF]/20 hover:border-[#0080FF]/30 border border-transparent rounded-lg transition-all"
                                  title="View Public Listing Page (New Tab)"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Button>
                              </Link>

                              {/* Delete / Archive */}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-lg transition-all"
                                title="Delete / Archive Asset"
                                onClick={() => handleDeleteListing(item.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination 
                  page={listingsPage} 
                  totalPages={Math.ceil(listingsList.length / ITEMS_PER_PAGE)} 
                  total={listingsList.length} 
                  limit={ITEMS_PER_PAGE} 
                  onPageChange={setListingsPage} 
                  className="mt-6 border-t border-slate-800/80 pt-6 px-4"
                />
              </motion.div>
            )}

            {/* ESCROW & TRANSACTIONS TAB */}
            {activeTab === "escrow" && (
              <motion.div 
                key="escrow"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white font-display">Escrow Vault & Settlement</h2>
                    <p className="text-slate-400 mt-1">Regulated multi-currency escrow with milestone release controls.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-[#00FF85] text-xs px-3 py-1.5 rounded-full font-mono flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Vault Locked: $2,840,000
                    </span>
                  </div>
                </div>

                <div className="bg-[#0A0F1E] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#131A2E] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">Deal / Asset</th>
                        <th className="px-6 py-4">Parties</th>
                        <th className="px-6 py-4">Escrow Value</th>
                        <th className="px-6 py-4">Milestone Status</th>
                        <th className="px-6 py-4 text-right">Settlement Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {escrowList.slice((escrowPage - 1) * ITEMS_PER_PAGE, escrowPage * ITEMS_PER_PAGE).map((deal) => (
                        <tr key={deal.id} className="hover:bg-[#131A2E]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{deal.title}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">{deal.id}</div>
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <div className="text-slate-300">Buyer: <span className="text-slate-400">{deal.buyer}</span></div>
                            <div className="text-slate-300 mt-0.5">Seller: <span className="text-slate-400">{deal.seller}</span></div>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-[#00FF85]">{deal.amount}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-slate-300">{deal.milestone}</span>
                              <span className="text-[10px] text-slate-500">({deal.step}/{deal.totalSteps})</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-[120px]">
                              <div className="bg-gradient-to-r from-[#00FF85] to-[#0080FF] h-full rounded-full" style={{ width: `${(deal.step / deal.totalSteps) * 100}%` }} />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              onClick={() => handleReleaseEscrow(deal.id)}
                              disabled={releasingEscrowId === deal.id}
                              size="sm"
                              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-[#00FF85] border border-emerald-500/20 text-xs h-8"
                            >
                              {releasingEscrowId === deal.id ? (
                                <><Activity className="w-3.5 h-3.5 animate-spin mr-1.5" /> Releasing...</>
                              ) : (
                                <><Unlock className="w-3.5 h-3.5 mr-1.5" /> Release Tranche</>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* USERS & KYC VERIFICATION TAB */}
            {activeTab === "users" && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white font-display">User Base & KYC Compliance</h2>
                    <p className="text-slate-400 mt-1">Review identity credentials, verify corporate entities, and unlock deal rooms.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => fetchUsers()} variant="outline" size="sm" className="bg-[#131A2E] border-slate-700 text-slate-300 text-xs">
                      <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingUsers ? 'animate-spin' : ''}`} /> Refresh Queue
                    </Button>
                  </div>
                </div>

                {/* Queue Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Pending Review</span>
                      <h4 className="text-2xl font-bold text-yellow-400 mt-0.5">
                        {usersList.filter(u => u.kycStatus === 'pending').length}
                      </h4>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-400/20" />
                  </div>
                  <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Verified Users</span>
                      <h4 className="text-2xl font-bold text-[#00FF85] mt-0.5">
                        {usersList.filter(u => u.kycStatus === 'verified').length}
                      </h4>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-[#00FF85]/20" />
                  </div>
                  <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Unverified Accounts</span>
                      <h4 className="text-2xl font-bold text-slate-400 mt-0.5">
                        {usersList.filter(u => !['verified', 'pending'].includes(u.kycStatus)).length}
                      </h4>
                    </div>
                    <Users className="w-8 h-8 text-slate-500/20" />
                  </div>
                </div>

                {/* User Verification Table */}
                <div className="bg-[#0A0F1E] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#131A2E] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">User / Entity</th>
                        <th className="px-6 py-4">Role & Tier</th>
                        <th className="px-6 py-4">KYC Status</th>
                        <th className="px-6 py-4">Submitted Documents</th>
                        <th className="px-6 py-4 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {usersList.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE).map((user) => (
                        <tr key={user.id} className="hover:bg-[#131A2E]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{user.displayName || user.email}</div>
                            <div className="text-xs text-slate-400">{user.email}</div>
                            {user.companyName && <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{user.companyName}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 uppercase">
                              {user.role}
                            </span>
                            {user.subscriptionTier && (
                              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0080FF]/10 text-[#0080FF] uppercase">
                                {user.subscriptionTier}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {user.kycStatus === 'verified' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : user.kycStatus === 'pending' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                                <Clock className="w-3.5 h-3.5" /> Pending Review
                              </span>
                            ) : user.kycStatus === 'rejected' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                                <XCircle className="w-3.5 h-3.5" /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            {user.kycData ? (
                              <div className="space-y-1">
                                <div className="text-slate-300 font-mono">
                                  <span className="text-slate-500 uppercase">{user.kycData.idType}:</span> {user.kycData.idNumber}
                                </div>
                                <button
                                  onClick={() => setSelectedUserDoc(user)}
                                  className="text-xs text-[#0080FF] hover:text-[#00FF85] flex items-center gap-1 font-medium underline"
                                >
                                  <Eye className="w-3 h-3" /> Inspect Uploaded ID
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">No files lodged</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {user.kycStatus !== 'verified' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateKyc(user.id, "verified")}
                                  disabled={processingKycId === user.id}
                                  className="bg-[#00FF85] hover:bg-[#00FF85]/80 text-black font-semibold text-xs h-8 px-3"
                                >
                                  <Check className="w-3.5 h-3.5 mr-1" /> Approve
                                </Button>
                              )}
                              {user.kycStatus !== 'rejected' && user.kycStatus !== 'unverified' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateKyc(user.id, "rejected")}
                                  disabled={processingKycId === user.id}
                                  className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-8 px-3"
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination 
                  page={usersPage} 
                  totalPages={Math.ceil(usersList.length / ITEMS_PER_PAGE)} 
                  total={usersList.length} 
                  limit={ITEMS_PER_PAGE} 
                  onPageChange={setUsersPage} 
                  className="mt-6 border-t border-slate-800/80 pt-6 px-4"
                />

                {/* Document Inspection Modal */}
                {selectedUserDoc && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#0A0F1E] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
                    >
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#00FF85]" /> KYC Verification Inspection
                        </h3>
                        <button onClick={() => setSelectedUserDoc(null)} className="text-slate-400 hover:text-white">✕</button>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="bg-[#131A2E] p-3 rounded-xl space-y-1">
                          <div className="text-slate-400 text-xs">Applicant:</div>
                          <div className="font-semibold text-white">{selectedUserDoc.displayName || selectedUserDoc.email}</div>
                          <div className="text-slate-400 text-xs">Entity: {selectedUserDoc.companyName || "N/A"}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#131A2E] p-3 rounded-xl">
                            <span className="text-xs text-slate-500 uppercase font-bold">Document Type</span>
                            <div className="text-white font-medium uppercase mt-0.5">{selectedUserDoc.kycData?.idType}</div>
                          </div>
                          <div className="bg-[#131A2E] p-3 rounded-xl">
                            <span className="text-xs text-slate-500 uppercase font-bold">Document Number</span>
                            <div className="text-white font-mono mt-0.5">{selectedUserDoc.kycData?.idNumber}</div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Document Link / Image Preview:</label>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                            <FileText className="w-10 h-10 text-slate-500" />
                            <a 
                              href={selectedUserDoc.kycData?.documentUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs text-[#0080FF] hover:underline flex items-center gap-1 font-mono break-all"
                            >
                              {selectedUserDoc.kycData?.documentUrl} <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleUpdateKyc(selectedUserDoc.id, "rejected");
                            setSelectedUserDoc(null);
                          }}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                        >
                          Reject Submission
                        </Button>
                        <Button
                          onClick={() => {
                            handleUpdateKyc(selectedUserDoc.id, "verified");
                            setSelectedUserDoc(null);
                          }}
                          className="bg-[#00FF85] text-black hover:bg-[#00FF85]/80 text-xs font-semibold"
                        >
                          Approve KYC Verification
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {/* AUDIT LOGS & SYSTEM STREAM TAB */}
            {activeTab === "logs" && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white font-display">System Logs & Audit Trail</h2>
                    <p className="text-slate-400 mt-1">Immutable security event stream, transaction ledgers, and KYC decisions.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE TELEMETRY
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0A0F1E] border border-slate-800 p-3 rounded-xl">
                  <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                    {["ALL", "SECURITY", "AUDIT", "INFO", "SUCCESS"].map((flt) => (
                      <button
                        key={flt}
                        onClick={() => setLogFilter(flt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors ${
                          logFilter === flt ? 'bg-[#0080FF] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        {flt}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Filter log stream..."
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      className="w-full bg-[#131A2E] border border-slate-700/60 focus:border-[#0080FF] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Terminal Window */}
                <div className="bg-[#050810] border border-slate-800 rounded-2xl p-6 font-mono text-xs shadow-2xl overflow-hidden relative">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/70 inline-block" />
                      <span className="ml-2 text-slate-400 font-semibold">syslog@digital-fortuna-cluster:~$</span>
                    </div>
                    <span className="text-[11px] text-slate-600">Showing {logsList.length} events</span>
                  </div>

                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto custom-scrollbar">
                    {logsList
                      .filter((l) => logFilter === "ALL" || l.level === logFilter)
                      .filter((l) => !logSearch || l.message.toLowerCase().includes(logSearch.toLowerCase()) || l.service.toLowerCase().includes(logSearch.toLowerCase()))
                      .map((l) => (
                        <div key={l.id} className="flex flex-col sm:flex-row items-start gap-2 hover:bg-white/5 p-1 rounded transition-colors">
                          <span className="text-slate-500 shrink-0">[{l.timestamp}]</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                            l.level === 'SECURITY' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            l.level === 'AUDIT' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            l.level === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {l.level}
                          </span>
                          <span className="text-slate-400 font-semibold shrink-0">[{l.service}]:</span>
                          <span className="text-slate-200 break-all">{l.message}</span>
                        </div>
                      ))}
                  </div>
                  <Pagination 
                    page={logsPage} 
                    totalPages={Math.ceil(logsList.filter((l) => logFilter === "ALL" || l.level === logFilter).filter((l) => !logSearch || l.message.toLowerCase().includes(logSearch.toLowerCase()) || l.service.toLowerCase().includes(logSearch.toLowerCase())).length / ITEMS_PER_PAGE)} 
                    total={logsList.filter((l) => logFilter === "ALL" || l.level === logFilter).filter((l) => !logSearch || l.message.toLowerCase().includes(logSearch.toLowerCase()) || l.service.toLowerCase().includes(logSearch.toLowerCase())).length} 
                    limit={ITEMS_PER_PAGE} 
                    onPageChange={setLogsPage} 
                    className="mt-4 border-t border-slate-800/80 pt-4"
                  />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          {/* RIGHT SIDE DRAWER FOR ASSET EDITING */}
      <AnimatePresence>
        {isListingDrawerOpen && selectedListing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsListingDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 h-full bg-[#0A0F1E] border-l border-slate-800 z-50 flex flex-col shadow-2xl transition-all duration-300 ${
                isDrawerFullScreen ? "w-full sm:w-[90vw] md:w-[85vw]" : "w-full sm:w-[500px]"
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/80 bg-[#131A2E]/50 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0080FF]/10 p-2 rounded-lg border border-[#0080FF]/20">
                    <Briefcase className="w-5 h-5 text-[#0080FF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">Edit Asset: {selectedListing.title}</h3>
                    <p className="text-slate-500 text-xs font-mono">{selectedListing.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 mr-4 bg-[#1C2333] px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Live Sync</span>
                  </div>
                  <button
                    onClick={() => setIsDrawerFullScreen(!isDrawerFullScreen)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 border border-transparent rounded-xl transition-all"
                    title={isDrawerFullScreen ? "Collapse Width" : "Expand Full Width"}
                  >
                    {isDrawerFullScreen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsListingDrawerOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 border border-transparent rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Content Area */}
              <div className="flex-1 overflow-hidden flex flex-col sm:flex-row bg-[#0A0F1E]">
                {/* Left Sidebar (Only visible when Full Screen) */}
                {isDrawerFullScreen && (
                  <div className="w-64 border-r border-slate-800 bg-[#131A2E]/30 p-6 flex flex-col gap-1 overflow-y-auto shrink-0 hidden sm:flex">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">Configuration Modules</div>
                    <button className="flex items-center gap-3 text-left px-3 py-2.5 bg-[#0080FF]/10 text-[#0080FF] rounded-xl text-sm font-semibold transition-colors">
                      <Briefcase className="w-4 h-4" /> General Details
                    </button>
                    <button className="flex items-center gap-3 text-left px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-colors">
                      <TrendingUp className="w-4 h-4" /> Financials & MRR
                    </button>
                    <button className="flex items-center gap-3 text-left px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-colors">
                      <ShieldCheck className="w-4 h-4" /> Compliance & Legal
                    </button>
                  </div>
                )}

                {/* Main Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                  <div className={`space-y-8 ${isDrawerFullScreen ? "max-w-4xl mx-auto" : ""}`}>
                    
                    {/* General Details Module */}
                    <div className="bg-[#131A2E]/50 rounded-2xl border border-slate-800/80 p-6 shadow-lg shadow-black/20">
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
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0080FF] focus:ring-1 focus:ring-[#0080FF]/50 transition-all"
                            placeholder="e.g. Aura AI CRM"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Category</label>
                          <select
                            value={listingForm.category || ""}
                            onChange={e => setListingForm({ ...listingForm, category: e.target.value })}
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0080FF] appearance-none"
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
                            value={listingForm.status || ""}
                            onChange={e => setListingForm({ ...listingForm, status: e.target.value })}
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#0080FF] appearance-none font-semibold"
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
                    <div className="bg-[#131A2E]/50 rounded-2xl border border-slate-800/80 p-6 shadow-lg shadow-black/20">
                      <h4 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Financials & Valuations
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex justify-between">
                            <span>Acquisition Price</span>
                            <span className="text-emerald-500">USD</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                            <input 
                              type="number" 
                              value={listingForm.acquisitionPrice || ""} 
                              onChange={e => setListingForm({ ...listingForm, acquisitionPrice: parseInt(e.target.value) || 0 })}
                              className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl pl-8 pr-4 py-3 text-lg text-white font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex justify-between">
                            <span>Monthly License Price</span>
                            <span className="text-emerald-500">USD</span>
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
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#0080FF] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Revenue ARR ($)</label>
                          <input 
                            type="number" 
                            value={listingForm.revenueArr || ""} 
                            onChange={e => setListingForm({ ...listingForm, revenueArr: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#0A0F1E] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#0080FF] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Analytics Preview */}
                    <div className="bg-gradient-to-tr from-[#1C2333]/80 to-[#131A2E] border border-[#0080FF]/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <TrendingUp className="w-24 h-24 text-[#0080FF]" />
                      </div>
                      <h4 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#0080FF]" /> Financial Insights (Auto-calculated)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#0A0F1E]/80 backdrop-blur-md p-4 rounded-xl border border-slate-800">
                          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Annual Run Rate</div>
                          <div className="text-emerald-400 font-mono font-bold text-xl">${(listingForm.revenueArr || (listingForm.revenueMrr * 12) || 0).toLocaleString()}</div>
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
              <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-[#131A2E] flex items-center justify-between gap-4 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-20">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteListing(selectedListing.id)}
                  className="border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/20 h-11 px-4 rounded-xl font-medium transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete / Archive</span>
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsListingDrawerOpen(false)}
                    className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-11 px-6 rounded-xl font-bold transition-all"
                  >
                    Discard Changes
                  </Button>
                  <Button
                    onClick={() => handleUpdateListing(selectedListing.id)}
                    disabled={isSavingListing}
                    className="bg-gradient-to-r from-[#0080FF] to-[#0066CC] hover:from-[#0066CC] hover:to-[#0055AA] text-white font-bold h-11 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-[#0080FF]/30 transition-all active:scale-95 border border-[#0080FF]/50"
                  >
                    {isSavingListing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    {isSavingListing ? "Committing..." : "Commit & Save Asset"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
        </main>
      </div>
    </main>
  );
}
