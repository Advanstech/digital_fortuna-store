"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
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
  MoreVertical
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

type AdminTab = "overview" | "listings" | "users" | "escrow" | "logs";

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Quick role check
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      if (!['admin', 'superadmin', 'root'].includes(payloadDecoded.role?.toLowerCase())) {
        toast("Unauthorized access. Admin privileges required.", "error");
        window.location.href = "/dashboard";
        return;
      }
      setIsAuthorized(true);
    } catch (e) {
      window.location.href = "/dashboard";
    }
  }, [toast]);

  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center"><Activity className="w-8 h-8 text-[#00FF85] animate-spin" /></div>;
  }

  return (
    <main className="min-h-screen bg-[#050810] flex text-slate-300">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0A0F1E] border-r border-slate-800/80 hidden lg:flex flex-col flex-shrink-0 relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <ShieldCheck className="w-6 h-6 text-[#00FF85]" />
          <span className="font-bold text-white tracking-wide font-display">Command Center</span>
        </div>
        
        <nav data-lenis-prevent className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
              activeTab === "overview" ? "bg-[#00FF85]/10 text-[#00FF85]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Activity className="w-4 h-4" /> Operations Overview
          </button>

          <button 
            onClick={() => setActiveTab("listings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
              activeTab === "listings" ? "bg-[#0080FF]/10 text-[#0080FF]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Listings Management
          </button>

          <button 
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
              activeTab === "users" ? "bg-purple-500/10 text-purple-400" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Users className="w-4 h-4" /> User Base & KYC
          </button>

          <button 
            onClick={() => setActiveTab("escrow")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
              activeTab === "escrow" ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <FolderLock className="w-4 h-4" /> Escrow & Transactions
          </button>

          <div className="my-4 border-t border-slate-800/80 mx-2" />

          <button 
            onClick={() => setActiveTab("logs")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
              activeTab === "logs" ? "bg-yellow-500/10 text-yellow-500" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Terminal className="w-4 h-4" /> System Logs & Audit
          </button>

          <button 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <Database className="w-4 h-4" /> Database Snapshots
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800/80">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full bg-transparent border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center gap-2 h-9 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
            </Button>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0A0F1E] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2 lg:hidden">
            <ShieldCheck className="w-5 h-5 text-[#00FF85]" />
            <span className="font-bold text-white font-display">Fortuna Admin</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-sm">
            <span className="text-slate-500 font-mono">NODE_ENV:</span>
            <span className="text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded text-xs">PRODUCTION</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-px h-6 bg-slate-800" />
            <span className="text-sm font-semibold text-white">Root Access</span>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main data-lenis-prevent className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
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

            {/* LISTINGS MANAGEMENT TAB */}
            {activeTab === "listings" && (
              <motion.div 
                key="listings"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white font-display">Listings Management</h2>
                    <p className="text-slate-400 mt-1">Review, approve, and moderate marketplace assets.</p>
                  </div>
                  <Button className="bg-[#0080FF] hover:bg-[#0080FF]/80 text-white">Export CSV</Button>
                </div>

                <div className="bg-[#0A0F1E] border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#131A2E] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">Listing Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Asking Price</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {[
                        { name: "FortunaEats POS", cat: "POS System", price: "$120,000", status: "Active" },
                        { name: "Aura AI CRM", cat: "AI Tool", price: "$450,000", status: "Pending Audit" },
                        { name: "OpenCLAW SaaS", cat: "SaaS", price: "$85,000", status: "In Escrow" },
                        { name: "Zenith Crypto Wallet", cat: "Web3", price: "$2,100,000", status: "Flagged" },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-[#131A2E]/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                          <td className="px-6 py-4">{item.cat}</td>
                          <td className="px-6 py-4 font-mono">{item.price}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                              item.status === 'Active' ? 'bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/20' :
                              item.status === 'Pending Audit' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                              item.status === 'In Escrow' ? 'bg-[#0080FF]/10 text-[#0080FF] border border-[#0080FF]/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ESCROW TAB */}
            {activeTab === "escrow" && (
              <motion.div 
                key="escrow"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white font-display">Escrow & Transactions</h2>
                  <p className="text-slate-400 mt-1">Manage wire transfers, digital asset holds, and payouts.</p>
                </div>
                
                <div className="bg-[#0A0F1E] border border-slate-800 border-dashed rounded-2xl p-16 text-center flex flex-col items-center justify-center">
                  <FolderLock className="w-12 h-12 text-slate-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Escrow Ledger Protected</h3>
                  <p className="text-slate-400 max-w-md mx-auto">Full transaction histories and manual payout overrides require superadmin cryptographic signatures. Insert hardware key to unlock full ledger.</p>
                  <Button className="mt-6 bg-slate-800 text-white hover:bg-slate-700">Authenticate hardware key</Button>
                </div>
              </motion.div>
            )}

            {/* Users & Logs placeholders can be rendered similarly or left as WIP depending on needs */}
            {(activeTab === "users" || activeTab === "logs") && (
              <motion.div 
                key="wip"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center h-full text-center p-20"
              >
                <Terminal className="w-16 h-16 text-slate-800 mb-6" />
                <h2 className="text-2xl font-bold text-white font-display mb-2">Module Under Construction</h2>
                <p className="text-slate-500">The {activeTab} module is currently being upgraded for v2 compliance.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </main>
  );
}
