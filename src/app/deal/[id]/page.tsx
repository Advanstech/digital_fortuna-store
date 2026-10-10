"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Lock, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  Send, 
  Download, 
  Cpu, 
  AlertCircle,
  Clock,
  Loader2,
  FileCode
} from "lucide-react";
import { useCurrency } from "@/lib/currency";

const MOCK_DEAL_DATA: Record<string, any> = {
  "mock-1": { 
    title: "TikTok AI Advertising Ecosystem", 
    status: "negotiation", 
    price: "$4,500,000",
    ebitda: "x6.2",
    margin: "82%",
    risk: "Low"
  },
  "mock-2": { 
    title: "Global Supply Chain ERP", 
    status: "due_diligence", 
    price: "$1,850,000",
    ebitda: "x5.4",
    margin: "74%",
    risk: "Minimal"
  },
  "mock-3": { 
    title: "Enterprise Fintech Gateway", 
    status: "escrow_funded", 
    price: "$2,200,000",
    ebitda: "x7.1",
    margin: "89%",
    risk: "Low"
  },
  "mock-4": { 
    title: "Healthcare EHR Core System", 
    status: "negotiation", 
    price: "$5,000,000",
    ebitda: "x5.8",
    margin: "68%",
    risk: "Moderate"
  },
  "mock-5": { 
    title: "Real Estate Tokenization Protocol", 
    status: "closing", 
    price: "$1,150,000",
    ebitda: "x4.9",
    margin: "91%",
    risk: "Low"
  },
  "mock-6": { 
    title: "Generative AI CRM Framework", 
    status: "negotiation", 
    price: "$950,000",
    ebitda: "x4.2",
    margin: "78%",
    risk: "Minimal"
  },
};

export default function DealRoomPage() {
  const params = useParams();
  const dealId = params.id as string;
  
  const [deal, setDeal] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Document generation simulation states
  const [generatingDoc, setGeneratingDoc] = useState<string | null>(null);
  const [generatedDocs, setGeneratedDocs] = useState<string[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { format: formatPrice } = useCurrency();

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, generatingDoc]);

  useEffect(() => {
    const fetchDealData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const dealRes = await fetch(`http://localhost:4000/v1/deals/${dealId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (dealRes.ok) {
          const dealData = await dealRes.json();
          setDeal(dealData.data || dealData);

          const msgRes = await fetch(`http://localhost:4000/v1/deals/${dealId}/messages`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (msgRes.ok) {
            const msgData = await msgRes.json();
            const actualMessages = msgData.data || msgData;
            setMessages(Array.isArray(actualMessages) ? actualMessages : []);
          }

          const invRes = await fetch(`http://localhost:4000/v1/invoices/deal/${dealId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (invRes.ok) {
            const invData = await invRes.json();
            const actualInvoices = invData.data || invData;
            setInvoices(Array.isArray(actualInvoices) ? actualInvoices : []);
          }
        } else {
          throw new Error("Failed to fetch deal from API");
        }
      } catch (error) {
        console.warn("API offline or deal not found. Using high-fidelity mock data.", error);
        
        const mockDealInfo = MOCK_DEAL_DATA[dealId] || { 
          title: "Enterprise Software Asset", 
          status: "negotiation", 
          price: "TBD",
          ebitda: "N/A",
          margin: "N/A",
          risk: "N/A"
        };
        setDeal(mockDealInfo);
        
        setMessages([
          { senderId: "system", timestamp: "09:00 PM", content: "🔐 Secure Room initialized. All transmissions use TLS 1.3 encryption protocols." },
          { senderId: "broker", timestamp: "09:02 PM", content: `Greetings. I am your M&A Broker Advisor assigned to the ${mockDealInfo.title} transaction dossier.` },
          { senderId: "broker", timestamp: "09:03 PM", content: "We've pre-audited the code repositories and checked the financials. Let's begin the negotiation. You can draft an LOI using our AI Legal generator." }
        ]);
        
        setInvoices([
          { id: "inv-1", description: "M&A Due Diligence Retainer Fee", amount: 5000, status: "paid" },
          { id: "inv-2", description: "Escrow Purchase Downpayment (10%)", amount: parseFloat(mockDealInfo.price.replace(/[^0-9.]/g, "")) * 0.1 || 150000, status: "pending" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDealData();
  }, [dealId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = { senderId: "me", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), content: newMessage };
    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");

    // Simulate smart agent responses for immersive mock UX
    setTimeout(() => {
      setMessages(prev => [...prev, {
        senderId: "broker",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Understood. Analyzing parameters of: "${newMessage}". We will coordinate with the engineering partners to prepare verification logs.`
      }]);
    }, 1500);
  };

  const triggerAIDocument = (type: "loi" | "apa" | "dd") => {
    setGeneratingDoc(type);
    
    // Simulate generation loop
    setTimeout(() => {
      setGeneratedDocs(prev => [...prev, type]);
      setGeneratingDoc(null);
      setMessages(prev => [...prev, {
        senderId: "system",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `📄 AI Agent successfully generated and verified the cryptographically signed document: ${type.toUpperCase()}_v1.pdf. Available in Data Room Vault.`
      }]);
    }, 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-[#00FF85] animate-spin mb-4" />
        <p className="font-mono text-sm tracking-widest uppercase">Decrypted Terminal Connection...</p>
      </div>
    );
  }

  if (!deal) return <div className="min-h-screen bg-[#0A0F1E] pt-32 text-center text-white">Asset acquisition file not found.</div>;

  return (
    <main className="min-h-screen w-full bg-[#0A0F1E] pt-32 pb-24 px-4 md:px-8 relative">
      {/* Decorative high-tech grids */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#00FF85]/5 rounded-full blur-[120px] pointer-events-none animate-pulse z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#0080FF]/5 rounded-full blur-[120px] pointer-events-none animate-pulse z-0" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start relative z-10">
        
        {/* ================= LEFT COLUMN: SCROLLABLE DOSSIER SIDEBAR ================= */}
        <aside className="w-full lg:w-[380px] lg:sticky lg:top-32 flex flex-col gap-6 flex-shrink-0">
          
          {/* Dossier Card */}
          <div className="bg-[#131A2E]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            {/* Top glowing edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FF85]/80 to-transparent" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] px-2.5 py-1 rounded-full font-mono font-bold tracking-wider uppercase">
                  Dossier #{dealId.toUpperCase()}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-[#00FF85]" /> Secure
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-white font-display tracking-tight group-hover:text-[#00FF85] transition-colors">
                {deal.title}
              </h2>

              <div className="border-t border-slate-800/80 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Acquisition Price:</span>
                  <span className="text-white font-bold text-base font-mono">
                    {deal.agreedPrice != null ? formatPrice(deal.agreedPrice) : deal.price}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">EBITDA Multiple:</span>
                  <span className="text-white font-semibold font-mono">{deal.ebitda}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Net Profit Margin:</span>
                  <span className="text-[#00FF85] font-semibold font-mono">{deal.margin}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Risk Assessment:</span>
                  <span className="text-white font-semibold">{deal.risk}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Due Diligence Document Center */}
          <div className="bg-[#131A2E]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#0080FF] animate-pulse" /> AI Legal Document Suite
            </h3>

            <div className="space-y-3">
              {/* LOI Button */}
              <Button 
                onClick={() => triggerAIDocument("loi")} 
                disabled={generatingDoc !== null}
                className="w-full bg-[#0A0F1E] border border-slate-800 hover:border-[#00FF85] text-slate-300 hover:text-white rounded-xl py-6 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  {generatingDoc === "loi" ? (
                    <Loader2 className="w-4 h-4 text-[#00FF85] animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 text-slate-500 group-hover:text-[#00FF85] transition-colors" />
                  )}
                  <span className="text-xs">Letter of Intent (LOI)</span>
                </div>
                {generatedDocs.includes("loi") ? (
                  <CheckCircle className="w-4 h-4 text-[#00FF85]" />
                ) : (
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300">Generate</span>
                )}
              </Button>

              {/* APA Button */}
              <Button 
                onClick={() => triggerAIDocument("apa")} 
                disabled={generatingDoc !== null}
                className="w-full bg-[#0A0F1E] border border-slate-800 hover:border-[#00FF85] text-slate-300 hover:text-white rounded-xl py-6 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  {generatingDoc === "apa" ? (
                    <Loader2 className="w-4 h-4 text-[#00FF85] animate-spin" />
                  ) : (
                    <FileCode className="w-4 h-4 text-slate-500 group-hover:text-[#00FF85] transition-colors" />
                  )}
                  <span className="text-xs">Asset Purchase Agreement (APA)</span>
                </div>
                {generatedDocs.includes("apa") ? (
                  <CheckCircle className="w-4 h-4 text-[#00FF85]" />
                ) : (
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300">Generate</span>
                )}
              </Button>
            </div>

            {/* Live Document Vault */}
            {generatedDocs.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document Vault</p>
                {generatedDocs.map((doc) => (
                  <div key={doc} className="flex items-center justify-between bg-[#0A0F1E] p-3 rounded-xl border border-slate-800/80 animate-fadeIn">
                    <span className="text-xs text-white font-mono uppercase font-bold">{doc}_DRAFT_v1.pdf</span>
                    <button className="p-1.5 bg-[#00FF85]/10 hover:bg-[#00FF85]/20 border border-[#00FF85]/20 text-[#00FF85] rounded-lg transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Escrow Milestone & Invoices */}
          <div className="bg-[#131A2E]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Financial Milestones</h3>
            <div className="space-y-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-[#0A0F1E]/50 border border-slate-800/80 p-4 rounded-2xl relative overflow-hidden">
                  <p className="text-slate-200 font-semibold mb-1 text-xs">{inv.description}</p>
                  <p className="text-[#00FF85] text-xs font-mono mb-3">{formatPrice(inv.amount)}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/40">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                      inv.status === 'paid' 
                        ? 'bg-[#00FF85]/10 border-[#00FF85]/20 text-[#00FF85]' 
                        : 'bg-[#F5C842]/10 border-[#F5C842]/20 text-[#F5C842]'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                    {inv.status === 'pending' && (
                      <Button size="sm" className="bg-[#00FF85] text-black hover:bg-[#00FF85]/90 h-7 text-[10px] font-bold rounded-lg px-3">
                        Deposit Escrow
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* ================= RIGHT COLUMN: STUNNING SECURE CHAT ROOM ================= */}
        <section className="flex-1 w-full bg-[#131A2E]/70 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl flex flex-col lg:h-[calc(100vh-160px)] min-h-[600px] overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-[#131A2E]/40 rounded-t-3xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#00FF85]">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  Secure Broker Portal
                </h1>
                <p className="text-slate-500 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connection Active & encrypted
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 hidden sm:block">M&A NEGOTIATION PLATFORM</span>
            </div>
          </div>

          {/* Chat Feed */}
          <div
            ref={chatContainerRef}
            data-lenis-prevent
            className="flex-1 p-6 space-y-6 overflow-y-auto"
          >
            <div className="flex flex-col justify-end min-h-full space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isSystem = msg.senderId === "system";
                const isMe = msg.senderId === "me";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`flex ${isSystem ? "justify-center" : (isMe ? "justify-end" : "justify-start")}`}
                  >
                    {isSystem ? (
                      <div className="bg-[#0080FF]/10 border border-[#0080FF]/20 text-[#0080FF] text-xs font-mono py-2.5 px-4 rounded-xl max-w-lg shadow-inner flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 flex-shrink-0 text-[#0080FF]" /> {msg.content}
                      </div>
                    ) : (
                      <div className={`flex gap-3 max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar bubble */}
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-extrabold font-mono border ${
                          isMe 
                            ? "bg-[#00FF85]/10 border-[#00FF85]/20 text-[#00FF85]" 
                            : "bg-[#0080FF]/10 border border-[#0080FF]/20 text-[#0080FF]"
                        }`}>
                          {isMe ? "ME" : "BR"}
                        </div>

                        <div>
                          {/* Message Content bubble */}
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                            isMe 
                              ? "bg-[#0080FF] text-white rounded-tr-none shadow-lg shadow-[#0080FF]/15" 
                              : "bg-[#0A0F1E] border border-slate-800 text-slate-200 rounded-tl-none"
                          }`}>
                            {msg.content}
                          </div>

                          {/* Meta timestamps */}
                          <div className={`text-[9px] text-slate-500 font-mono mt-1 ${isMe ? "text-right" : "text-left"}`}>
                            {msg.timestamp || "Just now"}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {generatingDoc && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[75%]">
                    <div className="w-8 h-8 rounded-lg bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] flex items-center justify-center text-[10px] font-mono animate-pulse">
                      AI
                    </div>
                    <div className="bg-[#0A0F1E] border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs font-mono text-[#00FF85] space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> 
                        <span>Generating {generatingDoc.toUpperCase()} document dossier...</span>
                      </div>
                      <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3.5 }}
                          className="h-full bg-[#00FF85]" 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>

          {/* Secure Message Input footer - STICKY AT BOTTOM OF CONTAINER */}
          <div className="p-6 border-t border-slate-800/80 bg-[#131A2E]/90 backdrop-blur-xl sticky bottom-0 z-20">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input 
                type="text" 
                className="flex-1 bg-[#0A0F1E] border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:border-[#00FF85] transition-all placeholder-slate-600 font-light text-sm outline-none shadow-inner"
                placeholder="Draft secure transaction correspondence..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" className="bg-gradient-to-r from-[#00FF85] to-[#0080FF] text-black hover:opacity-95 h-full px-4 sm:px-8 rounded-2xl font-bold tracking-wide shadow-lg shadow-[#00FF85]/15 transition-all flex items-center gap-2">
                <span className="hidden sm:inline">TRANSMIT</span> <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </section>

      </div>
    </main>
  );
}
