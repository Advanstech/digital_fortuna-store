"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Settings, 
  UserCircle, 
  ShieldAlert, 
  LogOut, 
  BarChart3, 
  Activity, 
  Users, 
  Briefcase,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Bell
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { useCurrency } from "@/lib/currency";

type TabType = "overview" | "profile" | "settings" | "admin";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { format: formatPrice } = useCurrency();
  const [userContext, setUserContext] = useState<{ email: string; role: string; userId: string } | null>(null);
  const [contactingBroker, setContactingBroker] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          window.location.href = "/auth";
          return;
        }

        // Decode JWT to get user context
        try {
          const payloadBase64 = token.split('.')[1];
          const payloadDecoded = JSON.parse(atob(payloadBase64));
          setUserContext({
            email: payloadDecoded.email || "user@example.com",
            role: payloadDecoded.role || "user",
            userId: payloadDecoded.sub || "user-123"
          });
        } catch (e) {
          console.error("JWT Decode error", e);
        }

        const res = await fetch("http://localhost:4000/v1/deals/my-deals", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          // unwrap if NestJS interceptor wrapped it
          const actualDeals = data.data || data || [];
          setDeals(Array.isArray(actualDeals) ? actualDeals : []);
        }
      } catch (error) {
        console.error("Failed to fetch deals:", error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  };

  const isAdmin = userContext && ['admin', 'superadmin', 'root'].includes(userContext.role.toLowerCase());

  // Quick helper to force admin role for demo purposes if needed
  const toggleDemoAdmin = () => {
    setUserContext(prev => prev ? { ...prev, role: prev.role === 'admin' ? 'user' : 'admin' } : null);
  };

  const handleContactBroker = async () => {
    setContactingBroker(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:4000/v1/brokers/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: "I need assistance with M&A strategy for my portfolio." })
      });

      if (res.ok) {
        toast("Your dedicated Fortuna broker has been notified. They will reach out to you within 2 hours.", "success");
      } else {
        toast("Failed to contact broker. Please try again.", "error");
      }
    } catch (error) {
      toast("An error occurred while contacting the broker.", "error");
      console.error(error);
    } finally {
      setContactingBroker(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-24 pb-12">
      {/* Top Banner / Breadcrumb Area */}
      <div className="w-full border-b border-slate-800/80 bg-[#131A2E]/50 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-[#00FF85]" />
            <div>
              <h2 className="text-white font-bold font-display leading-tight">{userContext?.email || "Loading..."}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="uppercase tracking-wider">{userContext?.role || "USER"} ACCOUNT</span>
                {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={toggleDemoAdmin} className="bg-transparent border-slate-800 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 h-9 hidden md:flex">
              Toggle Demo Role
            </Button>
            <Button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-white h-9 px-4 text-xs font-semibold rounded-md flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: SCROLL & STICKY NAVIGATION */}
          <div className="lg:col-span-3 lg:sticky lg:top-[140px] space-y-2">
            <nav className="flex flex-col gap-1 bg-[#131A2E]/40 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-3">Main Menu</h3>
              
              <button 
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  activeTab === "overview" ? "bg-[#00FF85]/10 text-[#00FF85]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Overview & Deals
              </button>
              
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  activeTab === "profile" ? "bg-[#00FF85]/10 text-[#00FF85]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <UserCircle className="w-4 h-4" /> User Profile
              </button>
              
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  activeTab === "settings" ? "bg-[#00FF85]/10 text-[#00FF85]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Settings className="w-4 h-4" /> Account Settings
              </button>

              {isAdmin && (
                <>
                  <div className="my-2 border-t border-slate-800/80" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-500/70 mb-2 px-3 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Administration
                  </h3>
                  <Link href="/admin">
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50"
                    >
                      <BarChart3 className="w-4 h-4" /> Admin Console <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  </Link>
                </>
              )}
            </nav>
            
            <div className="bg-gradient-to-tr from-slate-900 to-[#131A2E] border border-slate-800 rounded-2xl p-5 relative overflow-hidden mt-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF85]/5 rounded-full blur-2xl" />
              <h4 className="text-white font-bold text-sm mb-1">Need Assistance?</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">Connect with your dedicated Fortuna broker for M&A strategy.</p>
              <Button 
                onClick={handleContactBroker} 
                disabled={contactingBroker}
                className="w-full bg-white text-black hover:bg-gray-200 text-xs font-semibold h-8 rounded-lg"
              >
                {contactingBroker ? <Activity className="w-4 h-4 animate-spin" /> : "Contact Broker"}
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: DYNAMIC CONTENT AREA */}
          <div className="lg:col-span-9 min-h-[600px]">
            <AnimatePresence mode="wait">
              
              {/* TAB: OVERVIEW */}
              {activeTab === "overview" && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white font-display">Active Portfolio</h2>
                    <Link href="/catalog">
                      <Button className="bg-[#00FF85] text-black font-semibold hover:bg-[#00FF85]/80">Browse Acquisitions</Button>
                    </Link>
                  </div>
                  
                  {loading ? (
                    <div className="animate-pulse bg-[#131A2E]/50 border border-slate-800 h-48 rounded-2xl" />
                  ) : deals.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {deals.map((deal: any) => (
                        <div key={deal.id} className="bg-[#1C2333]/80 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                {deal.status.replace('_', ' ')}
                              </span>
                              <span className="text-slate-500 text-xs font-mono">ID: {deal.id.split('-')[0]}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Target: {deal.listingId}</h3>
                            <p className="text-slate-400 text-sm">Negotiated Valuation: <span className="text-[#00FF85] font-semibold">{deal.agreedPrice != null ? formatPrice(deal.agreedPrice) : "Pending Review"}</span></p>
                          </div>
                          <Link href={`/deal/${deal.id}`}>
                            <Button className="bg-[#0A0F1E] border border-slate-700 text-white group-hover:border-[#00FF85] group-hover:text-[#00FF85] transition-all">
                              Enter Deal Room <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#1C2333]/30 border border-slate-800 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                      <Briefcase className="w-12 h-12 text-slate-600 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Your Portfolio is Empty</h3>
                      <p className="text-slate-400 max-w-sm mb-6">You haven't initiated any acquisition offers or listed any startups yet. Start your journey today.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-[#131A2E]/50 border border-slate-800 rounded-2xl p-6">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-yellow-500" /> Recent Activity</h3>
                      <ul className="space-y-4 text-sm text-slate-300">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                          <p>Account verification completed <span className="text-slate-500 block text-xs mt-0.5">2 hours ago</span></p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                          <p>Welcome to Digital Fortuna Computing <span className="text-slate-500 block text-xs mt-0.5">1 day ago</span></p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: PROFILE & SETTINGS */}
              {(activeTab === "profile" || activeTab === "settings") && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold text-white font-display mb-6 capitalize">{activeTab} Configuration</h2>
                  
                  <div className="bg-[#131A2E]/50 border border-slate-800 rounded-2xl p-8">
                    <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input type="text" disabled value={userContext?.email || ""} className="w-full bg-[#0A0F1E] border border-slate-800 rounded-xl p-3 text-slate-300 opacity-70" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account ID</label>
                        <input type="text" disabled value={userContext?.userId || ""} className="w-full bg-[#0A0F1E] border border-slate-800 rounded-xl p-3 text-slate-500 font-mono text-sm opacity-70" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                        <input type="text" placeholder="Enter your legal name" className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#00FF85] rounded-xl p-3 text-white outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company / Entity</label>
                        <input type="text" placeholder="e.g. Acme Holdings LLC" className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#00FF85] rounded-xl p-3 text-white outline-none" />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button className="bg-[#00FF85] text-black hover:bg-[#00FF85]/80">Save Changes</Button>
                    </div>
                  </div>

                  <div className="bg-[#131A2E]/50 border border-slate-800 rounded-2xl p-8">
                    <h3 className="text-lg font-bold text-white mb-2 border-b border-slate-800 pb-4">Regional Preferences</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                      <div>
                        <h4 className="text-white font-medium">Display Currency</h4>
                        <p className="text-sm text-slate-400">
                          Prices are settled in USD — choose your preferred display currency for browsing and deal rooms.
                        </p>
                      </div>
                      <div className="w-full sm:w-64 shrink-0">
                        <CurrencySwitcher full />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#131A2E]/50 border border-slate-800 rounded-2xl p-8">
                    <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Security & Authentication</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Two-Factor Authentication (2FA)</h4>
                          <p className="text-sm text-slate-400">Add an extra layer of security to your account.</p>
                        </div>
                        <Button variant="outline" className="bg-transparent border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">Enable 2FA</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Password Reset</h4>
                          <p className="text-sm text-slate-400">Update your account access password.</p>
                        </div>
                        <Button variant="outline" className="bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">Update Password</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}
