"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Code, 
  CheckCircle, 
  ShieldAlert,
  Layers,
  HelpCircle,
  FileText
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

// Steps definition
const STEPS = [
  { id: 1, name: "General Info", desc: "Your startup's basic identity" },
  { id: 2, name: "Financial Snapshot", desc: "Revenue and price metrics" },
  { id: 3, name: "Technical Stack", desc: "Architecture & capabilities" },
  { id: 4, name: "Market & Growth", desc: "Benefits, relevance & scale playbook" },
  { id: 5, name: "AI Valuation Multiplier", desc: "Instant market estimate" },
  { id: 6, name: "Verification & Submit", desc: "Review and list live" }
];

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    category: "saas",
    acquisitionPrice: "",
    mrr: "",
    arr: "",
    profitMargin: "85",
    techStack: "",
    description: "",
    whySelling: "",
    contactEmail: "",
    benefits: "",
    relevance: "",
    growth: "",
  });

  // Calculate dynamic AI Valuation estimation based on SaaS standard multiples (usually 4x - 8x ARR or 40x - 80x MRR)
  const [aiEstimate, setAiEstimate] = useState({ min: 0, max: 0, multiplier: 5.5, status: "competitive" });

  useEffect(() => {
    const monthlyRev = parseFloat(formData.mrr) || 0;
    const yearlyRev = parseFloat(formData.arr) || (monthlyRev * 12) || 0;
    const askingPrice = parseFloat(formData.acquisitionPrice) || 0;

    if (yearlyRev > 0) {
      // Calculate dynamic multiple based on asking price / yearly revenue
      const currentMultiple = askingPrice / yearlyRev;
      let status = "competitive";
      if (currentMultiple > 8) status = "premium";
      else if (currentMultiple < 3) status = "highly-undervalued";

      // Suggested valuation based on standard 4.5x - 7.5x multiples
      const minEst = Math.round(yearlyRev * 4.2);
      const maxEst = Math.round(yearlyRev * 7.8);
      const avgMultiplier = (askingPrice && yearlyRev) ? (askingPrice / yearlyRev).toFixed(1) : "6.0";

      setAiEstimate({
        min: minEst,
        max: maxEst,
        multiplier: parseFloat(avgMultiplier) || 6.0,
        status: status
      });
    } else {
      setAiEstimate({ min: 0, max: 0, multiplier: 6.0, status: "pending" });
    }
  }, [formData.mrr, formData.arr, formData.acquisitionPrice]);

  useEffect(() => {
    // Check if token exists to prompt login
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    if (!token) {
      window.location.href = "/auth?signup=true";
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAiAutofill = () => {
    // Simulate an AI autofilling the form
    setFormData({
      title: "Synthetix AI",
      category: "ai",
      acquisitionPrice: "120000",
      mrr: "8500",
      arr: "102000",
      profitMargin: "92",
      techStack: "Next.js, Python, FastAPI, Pinecone, OpenAI, Vercel",
      description: "Synthetix AI is a B2B platform that automates customer support using context-aware LLMs. It integrates with Zendesk and Intercom, parsing historical tickets to instantly resolve up to 75% of tier-1 support queries.",
      whySelling: "Scaling too fast for a solo founder. Seeking an enterprise team to take over operations and expand market reach.",
      contactEmail: "founder@synthetix.ai",
      benefits: "High ACV, Deep Moat, First Mover Advantage",
      relevance: "Customer support is the #1 pain point for SaaS. Synthetix solves this with AI.",
      growth: "Expand into sales automation, build native Slack integration.",
    });
  };

  const handleAiSuggestPrice = () => {
    const monthlyRev = parseFloat(formData.mrr) || 0;
    const yearlyRev = parseFloat(formData.arr) || (monthlyRev * 12) || 0;
    if (yearlyRev > 0) {
      setFormData({ ...formData, acquisitionPrice: Math.round(yearlyRev * 5.5).toString() });
      toast("AI Suggested a 5.5x ARR multiple for Asking Price", "success");
    } else {
      toast("Please enter MRR or ARR first to calculate Price", "error");
    }
  };

  const handleAiComputeARR = () => {
    const monthlyRev = parseFloat(formData.mrr) || 0;
    if (monthlyRev > 0) {
      setFormData({ ...formData, arr: (monthlyRev * 12).toString() });
      toast("ARR computed automatically", "success");
    } else {
      toast("Please enter MRR first to compute ARR", "error");
    }
  };

  const handleAiWriteDescription = () => {
    if (!formData.title || !formData.techStack) {
      toast("Please enter Title and Tech Stack first", "error");
      return;
    }
    const catText = formData.category === "saas" ? "SaaS platform" : 
                    formData.category === "pos" ? "Point of Sale system" : 
                    formData.category === "mobile" ? "Mobile Application" : 
                    formData.category === "ai" ? "AI-powered tool" : "digital business";
    
    const generatedDesc = `${formData.title} is a cutting-edge ${catText} built with ${formData.techStack}. It streamlines operations for modern teams, boasting a high retention rate and strong daily active user engagement. Built for rapid enterprise scaling.`;
    setFormData({ ...formData, description: generatedDesc });
    toast("AI Description Generated", "success");
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      
      // Structure payload for backend schema (using fallback empty values if fields aren't specified)
      const payload = {
        title: formData.title,
        category: formData.category,
        acquisitionPrice: parseFloat(formData.acquisitionPrice) || undefined,
        revenueMrr: parseFloat(formData.mrr) || undefined,
        revenueArr: parseFloat(formData.arr) || undefined,
        description: `Why Selling:\n${formData.whySelling}\n\n${formData.description}`,
        techStack: formData.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        // Rich sales collateral rendered on the listing detail page
        details: {
          benefits: formData.benefits
            ? formData.benefits.split(",").map((b) => ({ title: b.trim(), desc: "" })).filter((b) => b.title)
            : [],
          relevance: formData.relevance,
          growth: formData.growth
            ? formData.growth.split("\n").map((g) => g.trim()).filter(Boolean)
            : [],
          metrics: [
            formData.mrr && { label: "MRR", value: `$${Number(formData.mrr).toLocaleString()}`, icon: "DollarSign" },
            formData.arr && { label: "ARR", value: `$${Number(formData.arr).toLocaleString()}`, icon: "TrendingUp" },
            formData.profitMargin && { label: "Profit Margin", value: `${formData.profitMargin}%`, icon: "BarChart3" },
          ].filter(Boolean),
        },
      };

      const res = await fetch("http://localhost:4000/v1/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        toast(errData.message || "Failed to submit listing. Are you logged in?", "error");
      }
    } catch (error) {
      console.error(error);
      toast("An error occurred during submission. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper validation for each step
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title.trim().length > 3 && formData.category && formData.contactEmail;
      case 2:
        return formData.acquisitionPrice && (formData.mrr || formData.arr);
      case 3:
        return formData.techStack.trim().length > 2 && formData.description.trim().length > 10;
      case 4:
        return formData.benefits.trim().length > 5 && formData.relevance.trim().length > 5 && formData.growth.trim().length > 5;
      case 5:
        return true; // valuation step is read-only information
      case 6:
        return true; // validation of submission
      default:
        return false;
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 px-4 md:px-8 pb-24 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#00FF85]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#0080FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Wizard Header */}
        <div className="mb-12 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] px-4 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" /> Founder Onboarding Program
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display mb-3">
            List Your Venture on <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] to-[#0080FF]">Digital Fortuna Computing</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-light">
            Skip the raw, complicated forms. Our vertical wizard optimizes your startup snapshot, estimates standard market multiples, and secures your high-end listing in minutes.
          </p>
        </div>



        {isSubmitted ? (
          /* SUCCESS STATE PANEL */
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto bg-[#131A2E]/80 border border-emerald-500/30 rounded-3xl p-10 text-center backdrop-blur-md shadow-2xl relative"
          >
            {/* Embedded glowing green background aura */}
            <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl pointer-events-none" />
            
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-[#00FF85] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
              <Check className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4 font-display">Venture Successfully Lodged!</h2>
            <p className="text-slate-300 text-lg font-light mb-8 max-w-md mx-auto">
              Our AI analysis engine and global team of brokers are reviewing <span className="font-semibold text-white">"{formData.title}"</span>. You will receive an onboarding briefing within 4 hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8 bg-[#0A0F1E]/60 p-6 rounded-2xl border border-slate-800">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#00FF85] mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Listing Catalog Draft</h4>
                  <p className="text-xs text-slate-400">Generated successfully in staging</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#00FF85] mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">AI Valuation Match</h4>
                  <p className="text-xs text-slate-400">Suggested multiplier score: {aiEstimate.multiplier}x</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.href = "/catalog"} className="bg-[#00FF85] text-black hover:bg-[#00FF85]/80 px-8 py-5 rounded-xl font-semibold">
                Browse Marketplace
              </Button>
              <Button onClick={() => {
                setFormData({
                  title: "",
                  category: "saas",
                  acquisitionPrice: "",
                  mrr: "",
                  arr: "",
                  profitMargin: "85",
                  techStack: "",
                  description: "",
                  whySelling: "",
                  contactEmail: "",
                  benefits: "",
                  relevance: "",
                  growth: "",
                });
                setIsSubmitted(false);
                setCurrentStep(1);
              }} variant="outline" className="border-slate-800 text-slate-300 hover:text-white px-8 py-5 rounded-xl">
                List Another Venture
              </Button>
            </div>
          </motion.div>
        ) : (
          /* TWO COLUMN STEPPER WIZARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Vertical Stepper Timeline (Sticky on larger screens) */}
            <div className="lg:col-span-4 lg:sticky top-32 bg-[#131A2E]/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex flex-col gap-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Progress</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold text-white">{currentStep}</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-slate-500 text-sm">{STEPS.length} steps completed</span>
                  </div>
                  {/* Step progress bar */}
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#00FF85] to-[#0080FF]" 
                      initial={{ width: "20%" }}
                      animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {STEPS.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <div 
                        key={step.id} 
                        className={`flex gap-4 items-start p-3 rounded-xl transition-all ${isActive ? 'bg-[#1C2333]/60 border border-slate-700/50' : 'opacity-60'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border flex-shrink-0 transition-all ${
                          isCompleted 
                            ? "bg-[#00FF85] border-[#00FF85] text-black" 
                            : isActive 
                              ? "border-[#0080FF] text-[#0080FF] shadow-lg shadow-[#0080FF]/20" 
                              : "border-slate-700 text-slate-400"
                        }`}>
                          {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold ${isActive ? "text-white" : "text-slate-300"}`}>{step.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Active Wizard Step Card */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 15, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -15, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#131A2E]/80 border border-slate-800/80 rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-xl"
                  >
                    
                    {/* STEP 1: Basic Information */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                          <div className="p-2.5 bg-[#00FF85]/10 rounded-xl text-[#00FF85]">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white font-display">Basic Venture Details</h2>
                            <p className="text-sm text-slate-400">Tell us what your company does and who it serves.</p>
                          </div>
                        </div>

                        {/* AI AUTOFILL FEATURE */}
                        <div className="p-6 mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-indigo-400">
                            <Sparkles className="w-5 h-5" />
                            <h3 className="font-bold font-display tracking-wide">AI Listing Autofill</h3>
                          </div>
                          <p className="text-sm text-slate-400">Paste your startup's website URL or a short description, and our AI will generate a highly optimized listing for you.</p>
                          <div className="flex flex-col sm:flex-row gap-3 mt-2">
                            <input 
                              type="text" 
                              placeholder="https://yourstartup.com or 'A POS for pharmacies...'"
                              className="flex-1 bg-[#0A0F1E] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
                            />
                            <Button type="button" onClick={handleAiAutofill} className="bg-indigo-500 text-white hover:bg-indigo-600 font-semibold rounded-xl px-6">
                              Auto-Generate
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-slate-300 font-medium">Startup or Product Title</label>
                          <input 
                            required
                            type="text" 
                            className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white placeholder-slate-600 outline-none transition-all" 
                            placeholder="e.g. Modern AI CRM or FortunaEats"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                          />
                          <p className="text-xs text-slate-500">Provide a clear, recognizable brand or software identifier.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-slate-300 font-medium">Core Category</label>
                            <select 
                              className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white outline-none transition-all cursor-pointer"
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                              <option value="saas">SaaS (Software as a Service)</option>
                              <option value="pos">POS (Point of Sale Systems)</option>
                              <option value="mobile">Mobile Application</option>
                              <option value="blockchain">Web3 & Blockchain</option>
                              <option value="ecommerce">E-commerce Brand</option>
                              <option value="ai">AI Tool / Generator</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-slate-300 font-medium">Support Contact Email</label>
                            <input 
                              required
                              type="email" 
                              className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white placeholder-slate-600 outline-none transition-all" 
                              placeholder="founder@yourventure.com"
                              value={formData.contactEmail}
                              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Financial Metrics */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                          <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500">
                            <DollarSign className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white font-display">Financial & Revenue Metrics</h2>
                            <p className="text-sm text-slate-400">Add key numbers that determine startup valuation standard multiples.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="block text-slate-300 font-medium">Asking Price (USD)</label>
                              <button type="button" onClick={handleAiSuggestPrice} className="text-xs text-[#0080FF] hover:text-[#00FF85] flex items-center gap-1 font-semibold bg-[#0080FF]/10 px-2 py-1 rounded transition-colors">
                                <Sparkles className="w-3 h-3" /> AI Suggest
                              </button>
                            </div>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                              <input 
                                required
                                type="number" 
                                className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 pl-8 text-white placeholder-slate-600 outline-none transition-all" 
                                placeholder="15000"
                                value={formData.acquisitionPrice}
                                onChange={(e) => setFormData({...formData, acquisitionPrice: e.target.value})}
                              />
                            </div>
                            <p className="text-xs text-slate-500">Your targeted, direct lump-sum buyout value.</p>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-slate-300 font-medium">Profit Margin (%)</label>
                            <div className="relative">
                              <input 
                                type="number" 
                                className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 pr-10 text-white placeholder-slate-600 outline-none transition-all" 
                                placeholder="85"
                                value={formData.profitMargin}
                                onChange={(e) => setFormData({...formData, profitMargin: e.target.value})}
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-slate-300 font-medium">Monthly Recurring Revenue (MRR)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                              <input 
                                type="number" 
                                className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 pl-8 text-white placeholder-slate-600 outline-none transition-all" 
                                placeholder="500"
                                value={formData.mrr}
                                onChange={(e) => setFormData({...formData, mrr: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="block text-slate-300 font-medium">Yearly Recurring Revenue (ARR)</label>
                              <button type="button" onClick={handleAiComputeARR} className="text-xs text-[#0080FF] hover:text-[#00FF85] flex items-center gap-1 font-semibold bg-[#0080FF]/10 px-2 py-1 rounded transition-colors">
                                <Sparkles className="w-3 h-3" /> AI Compute
                              </button>
                            </div>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                              <input 
                                type="number" 
                                className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 pl-8 text-white placeholder-slate-600 outline-none transition-all" 
                                placeholder="6000"
                                value={formData.arr}
                                onChange={(e) => setFormData({...formData, arr: e.target.value})}
                              />
                            </div>
                            <p className="text-xs text-slate-500">Auto-filled if empty based on MRR x 12.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Tech Stack & Description */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                            <Code className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white font-display">Technical Architecture & Stack</h2>
                            <p className="text-sm text-slate-400">Describe the technology powering your startup.</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-slate-300 font-medium">Tech Stack (Comma Separated)</label>
                          <div className="relative">
                            <input 
                              required
                              type="text" 
                              className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white placeholder-slate-600 outline-none transition-all" 
                              placeholder="e.g. Next.js, Fastify, Drizzle ORM, PostgreSQL, Redis"
                              value={formData.techStack}
                              onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                            />
                          </div>
                          <p className="text-xs text-slate-500">Specify core frameworks, databases, libraries and platform requirements.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="block text-slate-300 font-medium">General Description</label>
                              <button type="button" onClick={handleAiWriteDescription} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold bg-purple-500/10 px-2 py-1 rounded transition-colors">
                                <Sparkles className="w-3 h-3" /> AI Write
                              </button>
                            </div>
                            <textarea 
                              required
                              className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white placeholder-slate-600 outline-none transition-all h-36" 
                              placeholder="What problems does this solve? What is the user base or daily/weekly active users?"
                              value={formData.description}
                              onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-slate-300 font-medium">Why Are You Selling?</label>
                            <textarea 
                              required
                              className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white placeholder-slate-600 outline-none transition-all h-36" 
                              placeholder="e.g. Seeking liquidity, pursuing new enterprise project, lack of marketing time..."
                              value={formData.whySelling}
                              onChange={(e) => setFormData({...formData, whySelling: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Market & Growth Playbook */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                          <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500">
                            <TrendingUp className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white font-display">Market Fit & Growth Playbook</h2>
                            <p className="text-sm text-slate-400">Why should a buyer acquire this and how can they scale it?</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-slate-300 font-medium">Acquisition Benefits</label>
                          <textarea 
                            required
                            className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white placeholder-slate-600 outline-none transition-all h-24" 
                            placeholder="e.g. Immediate Cash Flow, High Margin, First-Mover Advantage..."
                            value={formData.benefits}
                            onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-slate-300 font-medium">Market Relevance & Fit</label>
                          <textarea 
                            required
                            className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white placeholder-slate-600 outline-none transition-all h-24" 
                            placeholder="Explain why this product solves a pressing need in the current market landscape."
                            value={formData.relevance}
                            onChange={(e) => setFormData({...formData, relevance: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-slate-300 font-medium">Growth & Scale Playbook</label>
                          <textarea 
                            required
                            className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white placeholder-slate-600 outline-none transition-all h-24" 
                            placeholder="e.g. Introduce enterprise SSO, expand into European markets, build a marketplace integration..."
                            value={formData.growth}
                            onChange={(e) => setFormData({...formData, growth: e.target.value})}
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 5: AI Valuation Multiplier (Interactive Magic) */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                          <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white font-display">AI Suggested Multiple Valuation</h2>
                            <p className="text-sm text-slate-400">Instantly calculated pricing metrics compared to SaaS standard multipliers.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Left Stats Block */}
                          <div className="md:col-span-2 space-y-4">
                            <div className="p-6 bg-[#0A0F1E]/80 border border-slate-800 rounded-2xl">
                              <h4 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Estimated Market Valuation Range</h4>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#0080FF] font-display">
                                  ${aiEstimate.min.toLocaleString()}
                                </span>
                                <span className="text-slate-500 text-sm">to</span>
                                <span className="text-3xl font-extrabold text-white font-display">
                                  ${aiEstimate.max.toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-3">Calculated using industry-standard 4.2x to 7.8x ARR (Annual Recurring Revenue) multiples.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-5 bg-[#0A0F1E]/50 border border-slate-800 rounded-xl">
                                <span className="text-xs text-slate-500 uppercase block mb-1">Asking Multiple</span>
                                <span className="text-xl font-bold text-white">{aiEstimate.multiplier}x ARR</span>
                              </div>
                              <div className="p-5 bg-[#0A0F1E]/50 border border-slate-800 rounded-xl">
                                <span className="text-xs text-slate-500 uppercase block mb-1">Venture Status</span>
                                <span className={`text-sm font-bold uppercase tracking-wide px-2.5 py-1.5 rounded-full inline-block mt-1 ${
                                  aiEstimate.status === "highly-undervalued" 
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                    : aiEstimate.status === "competitive" 
                                      ? "bg-[#0080FF]/10 text-[#0080FF] border border-[#0080FF]/20" 
                                      : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                }`}>
                                  {aiEstimate.status.replace("-", " ")}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Gauge/Interactive Multiplier Graphic */}
                          <div className="bg-[#0A0F1E] border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                              {/* Simple SVG Circular indicator */}
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#131A2E" strokeWidth="8" />
                                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#00FF85" strokeWidth="8" 
                                  strokeDasharray="314" 
                                  strokeDashoffset={314 - (314 * (Math.min(aiEstimate.multiplier, 12) / 12))}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-bold text-white leading-none">{aiEstimate.multiplier}x</span>
                                <span className="text-xs text-slate-500 mt-1">Multiplier</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <span className="text-xs text-slate-400 font-light block leading-relaxed">
                                standard marketplace multiplier ranges are 3.5x to 8.0x for vetted early stage micro-SaaS startups.
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#00FF85]/5 border border-[#00FF85]/10 rounded-2xl flex gap-3">
                          <TrendingUp className="w-5 h-5 text-[#00FF85] flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-400 leading-relaxed">
                            <strong>Did you know?</strong> Digital Fortuna Computing buyers actively look for listings between 4x - 6.5x ARR. Your current pricing position increases buyer negotiation matching speed by up to 45%.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STEP 6: Verification & Submit */}
                    {currentStep === 6 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                            <Layers className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white font-display">Review Your Onboarding Brief</h2>
                            <p className="text-sm text-slate-400">Ensure all metrics are aligned before listing live.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0A0F1E]/50 p-6 rounded-2xl border border-slate-800/80">
                          <div>
                            <span className="text-xs text-slate-500 uppercase block mb-1">Venture Brand Name</span>
                            <span className="text-lg font-bold text-white font-display">{formData.title || "Untitled Venture"}</span>
                          </div>

                          <div>
                            <span className="text-xs text-slate-500 uppercase block mb-1">buyout asking price</span>
                            <span className="text-lg font-bold text-[#00FF85] font-display">${parseFloat(formData.acquisitionPrice || "0").toLocaleString()} USD</span>
                          </div>

                          <div>
                            <span className="text-xs text-slate-500 uppercase block mb-1">mrr & growth position</span>
                            <span className="text-sm font-semibold text-slate-300">
                              MRR: ${parseFloat(formData.mrr || "0").toLocaleString()} ARR: ${parseFloat(formData.arr || "0").toLocaleString()} (Margin: {formData.profitMargin}%)
                            </span>
                          </div>

                          <div>
                            <span className="text-xs text-slate-500 uppercase block mb-1">Architecture tech stack</span>
                            <span className="text-sm font-semibold text-slate-300 max-w-xs block truncate">{formData.techStack || "Not Specified"}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex gap-3 text-left">
                          <HelpCircle className="w-5 h-5 text-[#F5C842] flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Upon submission, we will create a secure legal digital folder (escrow preparation) and run automated AI due diligence audits on the specified codebase. Submitting is non-binding.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* WIZARD ACTIONS NAV BAR */}
                    <div className="flex justify-between items-center mt-10 border-t border-slate-800/80 pt-6">
                      <Button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        variant="ghost"
                        className="text-slate-400 hover:text-white hover:bg-slate-800/40 px-6 py-5 rounded-xl flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>

                      {currentStep < STEPS.length ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          disabled={!isStepValid(currentStep)}
                          className="bg-[#00FF85] text-black hover:bg-[#00FF85]/80 px-8 py-5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-[#00FF85]/10"
                        >
                          Next Step <ArrowRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isSubmitting || !isLoggedIn}
                          className="bg-gradient-to-r from-[#00FF85] to-[#0080FF] text-black hover:opacity-90 px-10 py-5 rounded-xl font-bold flex items-center gap-2 shadow-xl"
                        >
                          {isSubmitting ? "LODGING VENTURE..." : "SUBMIT FOR REVIEW"} <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                  </motion.div>
                </AnimatePresence>
              </form>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
