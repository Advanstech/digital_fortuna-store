"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Lock, ArrowRight, CheckCircle, Clock, 
  DollarSign, AlertTriangle, Building, Wallet,
  FileText, ArrowDownLeft, ArrowUpRight, Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api/client";

interface EscrowDeal {
  dealId: string;
  listingTitle: string;
  buyerName: string;
  sellerName: string;
  agreedPrice: number;
  status: string;
  escrowBalance: number;
}

export default function EscrowPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "deposit" | "history">("overview");
  const [banks, setBanks] = useState<any[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [userDeals, setUserDeals] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Deposit form
  const [selectedDeal, setSelectedDeal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"debitwallet" | "banktrf">("debitwallet");
  const [serviceNumber, setServiceNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [depositing, setDepositing] = useState(false);
  const [depositResult, setDepositResult] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    Promise.all([
      fetch(`${API_BASE}/deals/my-deals`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE}/payments/my-payments`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : []),
    ]).then(([deals, pmts]) => {
      setUserDeals(Array.isArray(deals) ? deals : deals?.data || []);
      setPayments(Array.isArray(pmts) ? pmts : pmts?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const loadBanks = async () => {
    if (banks.length > 0) return;
    setLoadingBanks(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/payments/gtpay/banks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const bankList = data?.data?.Data || data?.Data || [];
      setBanks(Array.isArray(bankList) ? bankList : []);
    } catch { }
    setLoadingBanks(false);
  };

  const handleDeposit = async () => {
    if (!selectedDeal || !serviceNumber || !depositAmount || !paidBy) return;
    setDepositing(true);
    setDepositResult(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/payments/escrow/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          dealId: selectedDeal,
          serviceName: paymentMethod,
          serviceNumber,
          secondaryServiceNumber: paymentMethod === "banktrf" ? bankCode : undefined,
          amount: parseFloat(depositAmount),
          paidBy,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDepositResult({ success: true, ...data });
      } else {
        setDepositResult({ success: false, error: data.message || "Deposit failed" });
      }
    } catch (err: any) {
      setDepositResult({ success: false, error: err.message });
    }
    setDepositing(false);
  };

  const steps = [
    { icon: DollarSign, title: "Buyer Deposits", desc: "Buyer deposits agreed amount into Digital Fortuna escrow via mobile wallet or bank transfer." },
    { icon: FileText, title: "Asset Transfer", desc: "Seller uploads source code, transfers domains, databases, and all business assets to the staging vault." },
    { icon: CheckCircle, title: "Buyer Verifies", desc: "Buyer inspects and verifies all transferred assets match the deal agreement." },
    { icon: ArrowUpRight, title: "Funds Released", desc: "Platform releases funds to seller (minus 8% success fee). Assets are fully unlocked for the buyer." },
  ];

  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#00FF85]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-display">Secure Escrow Service</h1>
            <p className="text-slate-400 mt-1">Powered by GTPay — GTBank Partner API</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800/80 pb-4">
          {(["overview", "deposit", "history"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "deposit") loadBanks();
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#0080FF] text-white shadow-lg shadow-blue-500/20"
                  : "bg-[#131A2E]/60 text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {tab === "overview" ? "How It Works" : tab === "deposit" ? "Deposit to Escrow" : "Payment History"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {steps.map((step, i) => (
                <div key={i} className="bg-[#131A2E]/60 border border-slate-800 p-6 rounded-2xl relative">
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0080FF]/10 border border-[#0080FF]/20 flex items-center justify-center text-[#0080FF] text-xs font-bold">
                    {i + 1}
                  </div>
                  <step.icon className="w-8 h-8 text-[#00FF85] mb-3" />
                  <h3 className="text-white font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="bg-[#131A2E]/60 border border-slate-800 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Accepted Payment Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0A0F1E]/60 border border-slate-800/60 p-5 rounded-xl">
                  <Wallet className="w-6 h-6 text-amber-400 mb-3" />
                  <h4 className="text-white font-semibold mb-1">Mobile Wallet</h4>
                  <p className="text-slate-400 text-xs">Debit directly from your MTN, Vodafone, or AirtelTigo mobile money wallet.</p>
                </div>
                <div className="bg-[#0A0F1E]/60 border border-slate-800/60 p-5 rounded-xl">
                  <Building className="w-6 h-6 text-blue-400 mb-3" />
                  <h4 className="text-white font-semibold mb-1">Bank Transfer (GIP)</h4>
                  <p className="text-slate-400 text-xs">Transfer from any supported Ghanaian bank account via GIP interbank settlement.</p>
                </div>
                <div className="bg-[#0A0F1E]/60 border border-slate-800/60 p-5 rounded-xl">
                  <Landmark className="w-6 h-6 text-emerald-400 mb-3" />
                  <h4 className="text-white font-semibold mb-1">Bank Transfer (NRT)</h4>
                  <p className="text-slate-400 text-xs">Near-real-time bank transfer for faster processing between NRT-enabled banks.</p>
                </div>
              </div>
            </div>

            {/* Fee Structure */}
            <div className="bg-[#131A2E]/60 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Fee Structure</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-slate-400 font-bold py-3 pr-4">Fee Type</th>
                      <th className="text-left text-slate-400 font-bold py-3 pr-4">Amount</th>
                      <th className="text-left text-slate-400 font-bold py-3">Who Pays</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-slate-800/40">
                      <td className="py-3 pr-4">Listing Fee</td>
                      <td className="py-3 pr-4 text-[#00FF85] font-mono">GHS 49.00</td>
                      <td className="py-3">Seller (per listing)</td>
                    </tr>
                    <tr className="border-b border-slate-800/40">
                      <td className="py-3 pr-4">Success Fee</td>
                      <td className="py-3 pr-4 text-[#00FF85] font-mono">8% of deal value</td>
                      <td className="py-3">Deducted from escrow at closing</td>
                    </tr>
                    <tr className="border-b border-slate-800/40">
                      <td className="py-3 pr-4">Buyer Subscription</td>
                      <td className="py-3 pr-4 text-[#00FF85] font-mono">GHS 29.00/month</td>
                      <td className="py-3">Buyer (for premium access)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Escrow Deposit</td>
                      <td className="py-3 pr-4 text-[#00FF85] font-mono">No fee</td>
                      <td className="py-3">Free to deposit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Deposit Tab */}
        {activeTab === "deposit" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#131A2E]/60 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-[#00FF85]" />
                  <h2 className="text-xl font-bold text-white">Deposit Funds to Escrow</h2>
                </div>

                {depositResult && (
                  <div className={`mb-6 p-4 rounded-xl border ${
                    depositResult.success
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {depositResult.success ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      <span className="font-bold text-sm">
                        {depositResult.success ? "Deposit Initiated" : "Deposit Failed"}
                      </span>
                    </div>
                    {depositResult.success ? (
                      <div className="text-xs mt-1 space-y-1">
                        <p>Status: <span className="font-mono">{depositResult.gtbStatus || depositResult.status}</span></p>
                        <p>Transaction ID: <span className="font-mono">{depositResult.partnerTransId}</span></p>
                        <p>Amount: <span className="font-mono">GHS {depositResult.amount?.toFixed(2)}</span></p>
                        {depositResult.status === "pending" && (
                          <p className="text-amber-400 mt-2">Payment is processing. You will receive confirmation shortly.</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs mt-1">{depositResult.error}</p>
                    )}
                  </div>
                )}

                <div className="space-y-5">
                  {/* Select Deal */}
                  <div>
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Select Deal</label>
                    <select
                      value={selectedDeal}
                      onChange={e => setSelectedDeal(e.target.value)}
                      className="w-full bg-[#0A0F1E] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#0080FF] outline-none"
                    >
                      <option value="">Choose a deal...</option>
                      {userDeals.map((deal: any) => (
                        <option key={deal.id} value={deal.id}>
                          Deal {deal.id?.split("-")[0]} — {deal.status?.replace("_", " ")} — {deal.agreedPrice ? `GHS ${(deal.agreedPrice / 100).toLocaleString()}` : "Price TBD"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod("debitwallet")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          paymentMethod === "debitwallet"
                            ? "border-[#0080FF] bg-[#0080FF]/10"
                            : "border-slate-700 bg-[#0A0F1E] hover:border-slate-600"
                        }`}
                      >
                        <Wallet className={`w-5 h-5 mb-2 ${paymentMethod === "debitwallet" ? "text-[#0080FF]" : "text-slate-400"}`} />
                        <p className={`text-sm font-semibold ${paymentMethod === "debitwallet" ? "text-white" : "text-slate-300"}`}>Mobile Wallet</p>
                        <p className="text-[10px] text-slate-500 mt-1">MTN, Vodafone, AirtelTigo</p>
                      </button>
                      <button
                        onClick={() => { setPaymentMethod("banktrf"); loadBanks(); }}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          paymentMethod === "banktrf"
                            ? "border-[#0080FF] bg-[#0080FF]/10"
                            : "border-slate-700 bg-[#0A0F1E] hover:border-slate-600"
                        }`}
                      >
                        <Building className={`w-5 h-5 mb-2 ${paymentMethod === "banktrf" ? "text-[#0080FF]" : "text-slate-400"}`} />
                        <p className={`text-sm font-semibold ${paymentMethod === "banktrf" ? "text-white" : "text-slate-300"}`}>Bank Transfer</p>
                        <p className="text-[10px] text-slate-500 mt-1">GIP Interbank Transfer</p>
                      </button>
                    </div>
                  </div>

                  {/* Service Number */}
                  <div>
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">
                      {paymentMethod === "debitwallet" ? "Wallet Number" : "Bank Account Number"}
                    </label>
                    <input
                      type="text"
                      value={serviceNumber}
                      onChange={e => setServiceNumber(e.target.value)}
                      placeholder={paymentMethod === "debitwallet" ? "e.g. 0244588584" : "e.g. 1216001145688"}
                      className="w-full bg-[#0A0F1E] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-[#0080FF] outline-none"
                    />
                  </div>

                  {/* Bank Code (for bank transfer) */}
                  {paymentMethod === "banktrf" && (
                    <div>
                      <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Select Bank</label>
                      <select
                        value={bankCode}
                        onChange={e => setBankCode(e.target.value)}
                        className="w-full bg-[#0A0F1E] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#0080FF] outline-none"
                      >
                        <option value="">Choose a bank...</option>
                        {banks.map((bank: any) => (
                          <option key={bank.BankCode} value={bank.BankCode}>
                            {bank.BankName}
                          </option>
                        ))}
                      </select>
                      {loadingBanks && <p className="text-slate-500 text-xs mt-1">Loading banks...</p>}
                    </div>
                  )}

                  {/* Amount */}
                  <div>
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Amount (GHS)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      placeholder="e.g. 5000.00"
                      className="w-full bg-[#0A0F1E] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-[#0080FF] outline-none font-mono"
                    />
                  </div>

                  {/* Paid By */}
                  <div>
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Your Full Name</label>
                    <input
                      type="text"
                      value={paidBy}
                      onChange={e => setPaidBy(e.target.value)}
                      placeholder="e.g. Hanson Peprah"
                      className="w-full bg-[#0A0F1E] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-[#0080FF] outline-none"
                    />
                  </div>

                  <Button
                    onClick={handleDeposit}
                    disabled={depositing || !selectedDeal || !serviceNumber || !depositAmount || !paidBy}
                    className="w-full bg-[#00FF85] text-black hover:bg-[#00FF85]/90 font-bold py-3 rounded-xl text-sm disabled:opacity-40"
                  >
                    {depositing ? (
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 animate-spin" /> Processing...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Deposit to Escrow <ArrowRight className="w-4 h-4" /></span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment History Tab */}
        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-[#131A2E]/60 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800/80">
                <h2 className="text-lg font-bold text-white">Your Payment History</h2>
                <p className="text-slate-400 text-xs mt-1">All GTPay transactions on your account</p>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500 text-sm">Loading payments...</div>
              ) : payments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No payments yet</div>
              ) : (
                <div className="divide-y divide-slate-800/40">
                  {payments.map((p: any) => (
                    <div key={p.id} className="p-5 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          p.purpose === "escrow_deposit" ? "bg-emerald-500/10 text-emerald-400" :
                          p.purpose === "escrow_release" ? "bg-blue-500/10 text-blue-400" :
                          p.purpose === "refund" ? "bg-amber-500/10 text-amber-400" :
                          p.purpose === "listing_fee" ? "bg-purple-500/10 text-purple-400" :
                          "bg-slate-500/10 text-slate-400"
                        }`}>
                          {p.purpose === "escrow_deposit" ? <ArrowDownLeft className="w-5 h-5" /> :
                           p.purpose === "escrow_release" ? <ArrowUpRight className="w-5 h-5" /> :
                           p.purpose === "refund" ? <ArrowUpRight className="w-5 h-5" /> :
                           <DollarSign className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold capitalize">{p.purpose?.replace(/_/g, " ")}</p>
                          <p className="text-slate-500 text-xs">{p.serviceName} &middot; {p.serviceNumber}</p>
                          <p className="text-slate-600 text-[10px] font-mono mt-0.5">{p.partnerTransId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-mono text-sm font-bold">
                          GHS {(p.amount / 100).toFixed(2)}
                        </p>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                          p.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                          p.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                          p.status === "failed" ? "bg-red-500/10 text-red-400" :
                          "bg-slate-500/10 text-slate-400"
                        }`}>
                          {p.status}
                        </span>
                        <p className="text-slate-600 text-[10px] mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
