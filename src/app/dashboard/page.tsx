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
  Bell,
  Sparkles,
  MessageCircle,
  Globe,
  UploadCloud,
  FileText,
  Scan,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Pagination } from "@/components/ui/pagination";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { useCurrency } from "@/lib/currency";

type TabType = "overview" | "payments" | "adgenie" | "profile" | "settings" | "admin";

const KYC_TERMS_VERSION = "1";

const performanceData = [
  { name: 'Jan', value: 12000, views: 400 },
  { name: 'Feb', value: 19000, views: 800 },
  { name: 'Mar', value: 15000, views: 1200 },
  { name: 'Apr', value: 28000, views: 900 },
  { name: 'May', value: 25000, views: 1600 },
  { name: 'Jun', value: 34000, views: 2100 },
  { name: 'Jul', value: 45000, views: 2400 },
];


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [deals, setDeals] = useState<any[]>([]);
  const [dealsPage, setDealsPage] = useState(1);
  const DEALS_PER_PAGE = 5;
  const [loading, setLoading] = useState(true);
  const { format: formatPrice } = useCurrency();
  const [userContext, setUserContext] = useState<{ email: string; role: string; userId: string } | null>(null);
  const [contactingBroker, setContactingBroker] = useState(false);
  
  // KYC State
  const [kycStatus, setKycStatus] = useState<string>("unverified");
  const [kycRejectionReason, setKycRejectionReason] = useState<string | null>(null);
  const [kycForm, setKycForm] = useState({
    fullLegalName: "", idType: "passport", idNumber: "",
    nationality: "", dateOfBirth: "", country: "", phone: "", documentUrl: ""
  });
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [kycStep, setKycStep] = useState(1);
  const [kycTermsChecked, setKycTermsChecked] = useState(false);
  const [kycTermsAccepted, setKycTermsAccepted] = useState(false);
  const [isAcceptingKycTerms, setIsAcceptingKycTerms] = useState(false);

  // Profile Update State
  const [profileForm, setProfileForm] = useState({ displayName: "", companyName: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Payment State
  const [payments, setPayments] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const PAYMENTS_PER_PAGE = 8;

  // Drag & Drop State
  const [dragActive, setDragActive] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);

  const { toast } = useToast();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  // Sync activeTab with URL hash so it persists across reloads
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '') as TabType;
      if (['overview', 'payments', 'adgenie', 'profile', 'settings', 'admin'].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${activeTab}`);
    }
  }, [activeTab]);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          window.location.href = "/auth";
          return;
        }

        // Decode JWT to get initial user context (will be overridden by /auth/me)
        try {
          const payloadBase64 = token.split('.')[1];
          const payloadDecoded = JSON.parse(atob(payloadBase64));
          setUserContext({
            email: payloadDecoded.email || "",
            role: payloadDecoded.role || "buyer",
            userId: payloadDecoded.sub || ""
          });
        } catch (e) {
          console.error("JWT Decode error", e);
        }

        // Fetch User Profile for KYC & Live DB Role
        try {
          const meRes = await fetch(`${API_BASE}/auth/me`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (meRes.ok) {
            const rawJson = await meRes.json();
            const meData = rawJson.data || rawJson;
            setKycStatus(meData.kycStatus || "unverified");
            setKycRejectionReason(meData.kycRejectionReason || null);
            const termsAccepted =
              meData.kycData?.verificationTermsVersion === KYC_TERMS_VERSION &&
              Boolean(meData.kycData?.verificationTermsAcceptedAt);
            setKycTermsAccepted(termsAccepted);
            if (termsAccepted) setKycStep(2);
            if (meData.fullLegalName || meData.nationality) {
              setKycForm(prev => ({
                ...prev,
                fullLegalName: meData.fullLegalName || prev.fullLegalName,
                nationality: meData.nationality || prev.nationality,
                dateOfBirth: meData.dateOfBirth || prev.dateOfBirth,
                country: meData.country || prev.country,
                phone: meData.phone || prev.phone,
              }));
            }
            setUserContext({
              email: meData.email || "",
              role: meData.role || "buyer",
              userId: meData.id || ""
            });
            setProfileForm({
              displayName: meData.displayName || meData.fullLegalName || "",
              companyName: meData.companyName || ""
            });
          }
        } catch (e) {
          console.error("Failed to fetch profile", e);
        }

        const res = await fetch(`${API_BASE}/deals/my-deals`, {
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

  const loadPayments = async () => {
    setPaymentsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const [pmtRes, feeRes] = await Promise.all([
        fetch(`${API_BASE}/payments/my-payments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/payments/my-fees`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (pmtRes.ok) {
        const d = await pmtRes.json();
        setPayments(Array.isArray(d) ? d : d?.data || []);
      }
      if (feeRes.ok) {
        const d = await feeRes.json();
        setFees(Array.isArray(d) ? d : d?.data || []);
      }
    } catch {}
    setPaymentsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  };

  const isAdmin = Boolean(
    userContext &&
    ['admin', 'super_admin'].includes(userContext.role?.toLowerCase() || '')
  );

  const handleContactBroker = async () => {
    setContactingBroker(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/brokers/contact`, {
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

  const handleAcceptKycTerms = async () => {
    if (!kycTermsChecked || isAcceptingKycTerms) return;
    setIsAcceptingKycTerms(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/auth/kyc/accept-terms`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const responseJson = await res.json().catch(() => ({}));
      const responseData = responseJson.data || responseJson;
      if (res.ok) {
        setKycTermsAccepted(true);
        setKycStep(2);
      } else if (res.status === 401) {
        toast("Your session has expired. Redirecting to login...", "error");
        localStorage.removeItem("access_token");
        setTimeout(() => window.location.href = "/auth", 1500);
      } else {
        toast(responseData.message || "Could not save Terms of Verification acceptance.", "error");
      }
    } catch {
      toast("Could not save Terms of Verification acceptance.", "error");
    } finally {
      setIsAcceptingKycTerms(false);
    }
  };

  const handleKycSubmit = async () => {
    if (!kycTermsAccepted) {
      toast("Accept the Terms of Verification before submitting KYC.", "error");
      setKycStep(1);
      return;
    }
    if (!kycForm.fullLegalName || !kycForm.idNumber || !kycForm.documentUrl) {
      toast("Please provide your legal name, ID number, and upload your document.", "error");
      return;
    }
    setKycSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/auth/kyc/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(kycForm)
      });
      if (res.ok) {
        toast("KYC submitted successfully. Awaiting review.", "success");
        setKycStatus("pending");
      } else if (res.status === 401) {
        toast("Your session has expired. Redirecting to login...", "error");
        localStorage.removeItem("access_token");
        setTimeout(() => window.location.href = "/auth", 1500);
      } else {
        toast("Failed to submit KYC", "error");
      }
    } catch (e) {
      toast("Error submitting KYC", "error");
    } finally {
      setKycSubmitting(false);
    }
  };

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("File too large. Maximum size is 5MB.", "error");
      return;
    }
    setIsAiScanning(true);
    setSelectedFileName(file.name);
    try {
      // Convert file to base64 data URL for storage
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setKycForm(prev => ({ ...prev, documentUrl: dataUrl }));
        setIsAiScanning(false);
        toast(`Document "${file.name}" processed successfully.`, "success");
      };
      reader.onerror = () => {
        setIsAiScanning(false);
        toast("Failed to read file. Please try again.", "error");
      };
      reader.readAsDataURL(file);
    } catch {
      setIsAiScanning(false);
      toast("Failed to process document.", "error");
    }
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedProfile = {
      displayName: String(formData.get("displayName") || "").trim(),
      companyName: String(formData.get("companyName") || "").trim(),
    };
    setProfileForm(submittedProfile);
    setIsSavingProfile(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...submittedProfile, fullLegalName: submittedProfile.displayName })
      });
      const responseJson = await res.json().catch(() => ({}));
      const profile = responseJson.data || responseJson;
      if (res.ok) {
        setProfileForm({
          displayName: profile.displayName || profile.fullLegalName || profileForm.displayName,
          companyName: profile.companyName ?? profileForm.companyName,
        });
        toast("Profile updated successfully.", "success");
      } else if (res.status === 401) {
        toast("Your session has expired. Redirecting to login...", "error");
        localStorage.removeItem("access_token");
        setTimeout(() => window.location.href = "/auth", 1500);
      } else {
        const errorMessage = Array.isArray(profile.message) ? profile.message.join(", ") : profile.message;
        toast(errorMessage || "Failed to update profile.", "error");
      }
    } catch (e) {
      toast("Error updating profile.", "error");
    } finally {
      setIsSavingProfile(false);
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
                <span className="uppercase tracking-wider font-semibold text-emerald-400">
                  {userContext?.role?.replace('_', ' ') || "USER"} ACCOUNT
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">
                    <ShieldCheck className="w-3 h-3 text-purple-400" /> ROOT / SUPER ADMIN
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <Link href="/admin">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40 text-xs h-9 px-4 flex items-center gap-2 font-bold rounded-lg transition-all">
                  <ShieldCheck className="w-4 h-4 text-purple-200" /> Admin Console
                </Button>
              </Link>
            )}
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
                onClick={() => { setActiveTab("payments"); loadPayments(); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  activeTab === "payments" ? "bg-[#00FF85]/10 text-[#00FF85]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <CreditCard className="w-4 h-4" /> Payments & Fees
              </button>

              <button 
                onClick={() => setActiveTab("adgenie")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  activeTab === "adgenie" ? "bg-[#0080FF]/10 text-[#0080FF]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Sparkles className="w-4 h-4" /> AdGenie AI
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 px-3 flex items-center gap-1.5 font-mono">
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Administration
                  </h3>
                  <Link href="/admin">
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold bg-purple-500/15 text-purple-200 border border-purple-500/30 hover:bg-purple-500/25 hover:text-white shadow-lg shadow-purple-900/20 group"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" /> Admin Console <ChevronRight className="w-4 h-4 ml-auto text-purple-400" />
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
                    <div>
                      <h2 className="text-3xl font-bold text-white font-display">Command Center</h2>
                      <p className="text-slate-400 mt-1">Your acquisition portfolio, performance parameters, and active deal flow.</p>
                    </div>
                    <Link href="/catalog">
                      <Button className="bg-[#00FF85] text-black font-semibold hover:bg-[#00FF85]/80 shadow-lg shadow-[#00FF85]/20">Browse Market</Button>
                    </Link>
                  </div>

                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-[#131A2E] to-[#0A0F1E] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-16 h-16" /></div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Estimated Portfolio Value</span>
                      <h3 className="text-3xl font-extrabold text-white font-display mb-1">{formatPrice(450000)}</h3>
                      <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +14.2% MoM</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#131A2E] to-[#0A0F1E] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-16 h-16" /></div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Asset Engagement</span>
                      <h3 className="text-3xl font-extrabold text-white font-display mb-1">2,410 <span className="text-sm text-slate-500 font-normal">views</span></h3>
                      <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +28% this week</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#131A2E] to-[#0A0F1E] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase className="w-16 h-16" /></div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Active Deal Flow</span>
                      <h3 className="text-3xl font-extrabold text-[#0080FF] font-display mb-1">{deals.length || 2} <span className="text-sm text-slate-500 font-normal">deals</span></h3>
                      <p className="text-slate-400 text-xs font-semibold">1 awaiting escrow funding</p>
                    </div>
                  </div>

                  {/* Pictograph / Performance Chart */}
                  <div className="bg-[#131A2E]/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white font-bold flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#0080FF]" /> Portfolio Performance (Value)</h3>
                      <select className="bg-[#0A0F1E] border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-[#0080FF]">
                        <option>Last 6 Months</option>
                        <option>Year to Date</option>
                        <option>All Time</option>
                      </select>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00FF85" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00FF85" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                          <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0A0F1E', borderColor: '#1E293B', borderRadius: '12px' }}
                            itemStyle={{ color: '#00FF85', fontWeight: 'bold' }}
                            labelStyle={{ color: '#94A3B8' }}
                            formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']}
                          />
                          <Area type="monotone" dataKey="value" stroke="#00FF85" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Deals / Active Portfolio */}
                  <div>
                    <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-400" /> Active Deals & Offers</h3>
                    {loading ? (
                      <div className="animate-pulse bg-[#131A2E]/50 border border-slate-800 h-48 rounded-2xl" />
                    ) : deals.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 gap-4">
                          {deals.slice((dealsPage - 1) * DEALS_PER_PAGE, dealsPage * DEALS_PER_PAGE).map((deal: any) => (
                            <div key={deal.id} className="bg-[#1C2333]/80 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group shadow-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> {deal.status.replace('_', ' ')}
                                  </span>
                                  <span className="text-slate-500 text-xs font-mono">ID: {deal.id.split('-')[0]}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{deal.listingId}</h3>
                                
                                <div className="flex gap-6 mt-3">
                                  <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Agreed Price</p>
                                    <p className="text-[#00FF85] font-semibold font-mono text-lg">{deal.agreedPrice != null ? formatPrice(deal.agreedPrice) : "Pending"}</p>
                                  </div>
                                  <div className="hidden sm:block">
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Your Role</p>
                                    <p className="text-slate-300 capitalize">{deal.buyerId === userContext?.userId ? "Buyer" : "Seller"}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-3 shrink-0">
                                <Link href={`/deal/${deal.id}`}>
                                  <Button className="bg-[#0080FF] hover:bg-[#0080FF]/80 text-white font-semibold transition-all px-6">
                                    Enter Deal Room <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                </Link>
                                <span className="text-[10px] text-slate-500">Updated recently</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Pagination
                          page={dealsPage}
                          totalPages={Math.ceil(deals.length / DEALS_PER_PAGE)}
                          total={deals.length}
                          limit={DEALS_PER_PAGE}
                          onPageChange={setDealsPage}
                          className="mt-6 pt-6 border-t border-slate-800/80"
                        />
                      </>
                    ) : (
                      <div className="bg-[#1C2333]/30 border border-slate-800 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                        <Briefcase className="w-12 h-12 text-slate-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Active Deals</h3>
                        <p className="text-slate-400 max-w-sm mb-6">You haven't initiated any acquisition offers or listed any startups yet. Start your journey today.</p>
                      </div>
                    )}
                  </div>

                </motion.div>
              )}

              {/* TAB: PAYMENTS & FEES */}
              {activeTab === "payments" && (
                <motion.div 
                  key="payments"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white font-display">Payments & Fees</h2>
                      <p className="text-slate-400 text-sm mt-1">GTPay transactions and marketplace fees</p>
                    </div>
                    <Link href="/escrow">
                      <Button className="bg-[#00FF85] text-black hover:bg-[#00FF85]/90 font-bold text-xs h-9 rounded-xl px-4">
                        <CreditCard className="w-4 h-4 mr-1.5" /> Go to Escrow
                      </Button>
                    </Link>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#131A2E]/80 border border-slate-800/80 rounded-2xl p-5">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Payments</p>
                      <p className="text-2xl font-bold text-white font-mono">{payments.length}</p>
                    </div>
                    <div className="bg-[#131A2E]/80 border border-slate-800/80 rounded-2xl p-5">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Completed</p>
                      <p className="text-2xl font-bold text-[#00FF85] font-mono">
                        GHS {(payments.filter(p => p.status === 'completed').reduce((sum: number, p: any) => sum + (p.amount || 0), 0) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-[#131A2E]/80 border border-slate-800/80 rounded-2xl p-5">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Fees Paid</p>
                      <p className="text-2xl font-bold text-amber-400 font-mono">
                        GHS {(fees.filter(f => f.status === 'paid').reduce((sum: number, f: any) => sum + (f.amount || 0), 0) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Transactions */}
                  <div className="bg-[#131A2E]/80 border border-slate-800/80 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-slate-800/80">
                      <h3 className="text-sm font-bold text-white">Transaction History</h3>
                    </div>
                    {paymentsLoading ? (
                      <div className="p-8 text-center text-slate-500 text-sm">Loading transactions...</div>
                    ) : payments.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        No payments yet. Deposit to escrow or pay listing fees to get started.
                      </div>
                    ) : (
                      <>
                        <div className="divide-y divide-slate-800/40">
                          {payments
                            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice((paymentsPage - 1) * PAYMENTS_PER_PAGE, paymentsPage * PAYMENTS_PER_PAGE)
                            .map((p: any) => (
                            <div key={p.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${
                                  p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                  p.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                  p.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                  'bg-slate-500/10 text-slate-400'
                                }`}>
                                  {p.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                                   p.status === 'pending' ? <Activity className="w-4 h-4" /> :
                                   <CreditCard className="w-4 h-4" />}
                                </div>
                                <div>
                                  <p className="text-white text-sm font-semibold capitalize">{(p.purpose || 'payment').replace(/_/g, ' ')}</p>
                                  <p className="text-slate-500 text-[10px]">{p.serviceName} &middot; {new Date(p.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-mono text-sm font-bold">GHS {(p.amount / 100).toFixed(2)}</p>
                                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                  p.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                  'bg-red-500/10 text-red-400'
                                }`}>{p.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {payments.length > PAYMENTS_PER_PAGE && (
                          <div className="p-4 border-t border-slate-800/80">
                            <Pagination
                              page={paymentsPage}
                              totalPages={Math.ceil(payments.length / PAYMENTS_PER_PAGE)}
                              total={payments.length}
                              limit={PAYMENTS_PER_PAGE}
                              onPageChange={setPaymentsPage}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Marketplace Fees */}
                  {fees.length > 0 && (
                    <div className="bg-[#131A2E]/80 border border-slate-800/80 rounded-2xl overflow-hidden">
                      <div className="p-5 border-b border-slate-800/80">
                        <h3 className="text-sm font-bold text-white">Marketplace Fees</h3>
                      </div>
                      <div className="divide-y divide-slate-800/40">
                        {fees.map((f: any) => (
                          <div key={f.id} className="px-5 py-4 flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-semibold capitalize">{(f.feeType || '').replace(/_/g, ' ')}</p>
                              <p className="text-slate-500 text-[10px]">{new Date(f.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-mono text-sm">GHS {(f.amount / 100).toFixed(2)}</p>
                              <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                f.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                                f.status === 'waived' ? 'bg-blue-500/10 text-blue-400' :
                                'bg-amber-500/10 text-amber-400'
                              }`}>{f.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: ADGENIE */}
              {activeTab === "adgenie" && (
                <motion.div 
                  key="adgenie"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white font-display flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-[#0080FF]" /> AdGenie Creator
                      </h2>
                      <p className="text-slate-400 mt-2">Generate hyper-local AI ads optimized for WhatsApp and African markets.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button className="bg-[#F5C842] hover:bg-[#F5C842]/80 text-black font-semibold text-xs h-9">
                        Top Up (MoMo / Card)
                      </Button>
                      <div className="bg-[#131A2E] border border-slate-800 rounded-xl px-4 py-2 flex flex-col items-end">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Credits</span>
                        <span className="text-lg font-bold text-[#00FF85]">120</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Form */}
                    <div className="bg-[#131A2E]/50 border border-slate-800 rounded-2xl p-6">
                      <h3 className="text-white font-bold mb-6">Create New Campaign</h3>
                      
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product or Offer URL</label>
                          <input type="text" placeholder="https://yourstore.com/product" className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#0080FF] rounded-xl p-3 text-white outline-none" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Language</label>
                          <select className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#0080FF] rounded-xl p-3 text-white outline-none appearance-none">
                            <option>English</option>
                            <option>Twi</option>
                            <option>Pidgin (Nigerian/Ghanaian)</option>
                            <option>Hausa</option>
                            <option>Yoruba</option>
                            <option>Swahili</option>
                            <option>French (West Africa)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ad Format (Optimized)</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="border border-[#0080FF] bg-[#0080FF]/10 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                              <MessageCircle className="w-5 h-5 text-[#0080FF]" />
                              <span className="text-sm font-medium text-white">WhatsApp Click-to-Chat</span>
                            </div>
                            <div className="border border-slate-700 hover:border-slate-500 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                              <Activity className="w-5 h-5 text-slate-400" />
                              <span className="text-sm font-medium text-slate-300">TikTok / IG Reels</span>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full bg-[#0080FF] hover:bg-[#0080FF]/80 text-white font-semibold py-6 rounded-xl mt-4">
                          Generate AI Ad (Costs 5 Credits)
                        </Button>
                      </div>
                    </div>

                    {/* Right Column: Previews & Results */}
                    <div className="bg-gradient-to-br from-[#1C2333]/50 to-[#0A0F1E] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                      <h3 className="text-white font-bold mb-6">Recent Generations</h3>
                      
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-700 rounded-xl">
                        <Globe className="w-12 h-12 text-slate-600 mb-4" />
                        <h4 className="text-slate-300 font-medium mb-2">No active campaigns</h4>
                        <p className="text-slate-500 text-sm max-w-[250px]">
                          Enter your product details to generate high-converting ads localized for African audiences.
                        </p>
                      </div>
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
                    <form onSubmit={handleSaveProfile}>
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
                        <input 
                          type="text"
                          name="displayName"
                          autoComplete="name"
                          placeholder="Enter your legal name"
                          value={profileForm.displayName}
                          onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                          className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#00FF85] rounded-xl p-3 text-white outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company / Entity</label>
                        <input 
                          type="text"
                          name="companyName"
                          autoComplete="organization"
                          placeholder="e.g. Acme Holdings LLC"
                          value={profileForm.companyName}
                          onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                          className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#00FF85] rounded-xl p-3 text-white outline-none" 
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSavingProfile}
                        className="bg-[#00FF85] text-black hover:bg-[#00FF85]/80"
                      >
                        {isSavingProfile ? (
                          <><Activity className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                        ) : "Save Changes"}
                      </Button>
                    </div>
                    </form>
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

                  <div className="bg-[#131A2E]/50 border border-slate-800 rounded-2xl p-8">
                    <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">KYC Verification (Required for Transactions)</h3>
                    
                    {kycStatus === "verified" ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col items-center text-center">
                        <ShieldCheck className="w-12 h-12 text-emerald-400 mb-4" />
                        <h4 className="text-emerald-400 font-bold text-lg mb-2">Identity Verified</h4>
                        <p className="text-emerald-500/80 text-sm">Your account is fully verified. You can now initiate and participate in acquisition transactions.</p>
                      </div>
                    ) : kycStatus === "rejected" ? (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col items-center text-center">
                        <ShieldAlert className="w-12 h-12 text-red-400 mb-4" />
                        <h4 className="text-red-400 font-bold text-lg mb-2">Verification Rejected</h4>
                        <p className="text-red-500/80 text-sm mb-2">Your KYC submission was not approved.</p>
                        {kycRejectionReason && (
                          <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 mt-2 w-full max-w-md">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Reason</p>
                            <p className="text-sm text-red-300">{kycRejectionReason}</p>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => { setKycStep(kycTermsAccepted ? 2 : 1); setKycStatus("unverified"); }}
                          className="mt-4 border-red-500/40 text-red-300 hover:bg-red-500/10 text-xs"
                        >
                          Resubmit Verification
                        </Button>
                      </div>
                    ) : kycStatus === "pending" ? (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex flex-col items-center text-center">
                        <Activity className="w-12 h-12 text-blue-400 mb-4 animate-pulse" />
                        <h4 className="text-blue-400 font-bold text-lg mb-2">Verification Pending</h4>
                        <p className="text-blue-500/80 text-sm">Your documents have been submitted and are currently under review by our compliance team.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* WIZARD PROGRESS */}
                        <div className="relative flex items-center justify-between mb-8 px-4">
                          {[1, 2, 3].map((step) => (
                            <div key={step} className="flex flex-col items-center relative z-10 bg-[#131A2E] px-2 rounded-xl">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${kycStep === step ? 'bg-[#0080FF] text-white ring-4 ring-[#0080FF]/20' : kycStep > step ? 'bg-[#00FF85] text-black' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                {kycStep > step ? <ShieldCheck className="w-5 h-5" /> : step}
                              </div>
                              <span className={`text-xs mt-3 font-semibold uppercase tracking-wider ${kycStep >= step ? 'text-slate-300' : 'text-slate-600'}`}>
                                {step === 1 ? "Compliance" : step === 2 ? "Details" : "Upload"}
                              </span>
                            </div>
                          ))}
                          <div className="absolute left-10 right-10 h-[2px] bg-slate-800 top-5 -z-0">
                            <div className="h-full bg-gradient-to-r from-[#00FF85] to-[#0080FF] transition-all duration-500 ease-out" style={{ width: `${((kycStep - 1) / 2) * 100}%` }} />
                          </div>
                        </div>

                        {kycStep === 1 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                              <p className="text-sm text-amber-500/90 leading-relaxed">
                                <strong>Action Required:</strong> You must verify your identity to comply with Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations before participating in deal rooms or receiving escrow payouts.
                              </p>
                            </div>
                            <div className="bg-[#0A0F1E] border border-slate-700/50 rounded-xl p-6">
                              <h4 className="text-white font-medium mb-2">Terms of Verification</h4>
                              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                                By proceeding, you agree that Digital Fortuna Computing will securely process your identity documents. Your data will be encrypted at rest and will only be shared with our regulated financial partners for verification purposes.
                              </p>
                              <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={kycTermsChecked}
                                  onChange={(e) => setKycTermsChecked(e.target.checked)}
                                  className="h-5 w-5 accent-[#00FF85]"
                                />
                                <span className="text-sm text-slate-300">I agree to the Terms of Verification and Privacy Policy</span>
                              </label>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                onClick={handleAcceptKycTerms}
                                disabled={!kycTermsChecked || isAcceptingKycTerms}
                                className="bg-[#0080FF] hover:bg-[#0080FF]/80 text-white"
                              >
                                {isAcceptingKycTerms ? "Saving..." : "Agree & Continue"}
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {kycStep === 2 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Legal Name <span className="text-red-400">*</span></label>
                                <input 
                                  type="text" 
                                  value={kycForm.fullLegalName}
                                  onChange={(e) => setKycForm({...kycForm, fullLegalName: e.target.value})}
                                  placeholder="As it appears on your ID document" 
                                  className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#0080FF] rounded-xl p-3 text-white outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Document Type <span className="text-red-400">*</span></label>
                                <select 
                                  value={kycForm.idType}
                                  onChange={(e) => setKycForm({...kycForm, idType: e.target.value})}
                                  className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#0080FF] rounded-xl p-3 text-white outline-none appearance-none"
                                >
                                  <option value="passport">International Passport</option>
                                  <option value="national_id">National ID Card</option>
                                  <option value="drivers_license">Driver&apos;s License</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Document Number <span className="text-red-400">*</span></label>
                                <input 
                                  type="text" 
                                  value={kycForm.idNumber}
                                  onChange={(e) => setKycForm({...kycForm, idNumber: e.target.value})}
                                  placeholder="e.g. GHA-123456789-0" 
                                  className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#0080FF] rounded-xl p-3 text-white outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nationality</label>
                                <input 
                                  type="text" 
                                  value={kycForm.nationality}
                                  onChange={(e) => setKycForm({...kycForm, nationality: e.target.value})}
                                  placeholder="e.g. Ghanaian" 
                                  className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#0080FF] rounded-xl p-3 text-white outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                                <input 
                                  type="date" 
                                  value={kycForm.dateOfBirth}
                                  onChange={(e) => setKycForm({...kycForm, dateOfBirth: e.target.value})}
                                  className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#0080FF] rounded-xl p-3 text-white outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Country of Residence</label>
                                <input 
                                  type="text" 
                                  value={kycForm.country}
                                  onChange={(e) => setKycForm({...kycForm, country: e.target.value})}
                                  placeholder="e.g. Ghana" 
                                  className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#0080FF] rounded-xl p-3 text-white outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</label>
                                <input 
                                  type="tel" 
                                  value={kycForm.phone}
                                  onChange={(e) => setKycForm({...kycForm, phone: e.target.value})}
                                  placeholder="e.g. +233 XX XXX XXXX" 
                                  className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-[#0080FF] rounded-xl p-3 text-white outline-none" 
                                />
                              </div>
                            </div>
                            <div className="flex justify-end pt-2">
                              <Button onClick={() => setKycStep(3)} disabled={!kycForm.idNumber || !kycForm.fullLegalName} className="bg-[#0080FF] hover:bg-[#0080FF]/80 text-white">
                                Continue to Upload
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {kycStep === 3 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upload Document Scan</label>
                                {kycForm.documentUrl && (
                                  <span className="text-xs text-[#00FF85] flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Ready</span>
                                )}
                              </div>
                              
                              <div 
                                className={`relative group w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all overflow-hidden ${
                                  dragActive ? 'border-[#0080FF] bg-[#0080FF]/10' : 
                                  kycForm.documentUrl ? 'border-[#00FF85]/50 bg-[#00FF85]/5' : 
                                  'border-slate-700 bg-[#0A0F1E] hover:border-slate-500'
                                }`}
                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => { 
                                  e.preventDefault(); 
                                  e.stopPropagation(); 
                                  setDragActive(false);
                                  if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                                }}
                              >
                                <AnimatePresence mode="wait">
                                  {isAiScanning ? (
                                    <motion.div key="scanning" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                      <div className="relative">
                                        <Scan className="w-12 h-12 text-[#0080FF] animate-pulse" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0080FF]/50 h-full w-full animate-bounce" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 2px, 0 2px)' }} />
                                      </div>
                                      <p className="mt-4 text-sm text-slate-300 font-medium">Processing document...</p>
                                    </motion.div>
                                  ) : kycForm.documentUrl ? (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                                      <FileText className="w-12 h-12 text-[#00FF85] mb-2" />
                                      <p className="text-sm text-white font-medium">{selectedFileName || "Document"} uploaded</p>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="mt-2 text-slate-400 hover:text-white"
                                        onClick={() => { setKycForm({...kycForm, documentUrl: ""}); setSelectedFileName(null); }}
                                      >
                                        Remove & Upload Another
                                      </Button>
                                    </motion.div>
                                  ) : (
                                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                      <div className="bg-slate-800/50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#0080FF] transition-colors" />
                                      </div>
                                      <p className="text-sm text-slate-300 font-medium mb-1">Drag and drop your document here</p>
                                      <p className="text-xs text-slate-500 mb-4">Supports PDF, JPEG, PNG (Max 5MB)</p>
                                      
                                      <div className="flex gap-3">
                                        <label className="cursor-pointer">
                                          <div className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                                            Browse Files
                                          </div>
                                          <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*,.pdf" 
                                            onChange={(e) => {
                                              if (e.target.files && e.target.files.length > 0) {
                                                handleFileUpload(e.target.files[0]);
                                              }
                                            }}
                                          />
                                        </label>

                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                            
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
                              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                              <p className="text-sm text-blue-300 font-light">Your documents are encrypted and transmitted securely over TLS 1.3.</p>
                            </div>
                            
                            <div className="flex justify-between pt-2">
                              <Button variant="outline" onClick={() => setKycStep(2)} className="border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white" disabled={kycSubmitting || isAiScanning}>
                                Back
                              </Button>
                              <Button 
                                onClick={handleKycSubmit}
                                disabled={kycSubmitting || !kycForm.documentUrl || isAiScanning}
                                className="bg-[#00FF85] hover:bg-[#00FF85]/80 text-black font-bold"
                              >
                                {kycSubmitting ? <><Activity className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Verification"}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
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
