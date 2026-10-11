"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Shield, Zap, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free Buyer",
    price: "Free",
    period: "",
    description: "Browse and discover technology businesses on the marketplace.",
    features: [
      "Browse all live listings",
      "View listing details and metrics",
      "Create a buyer account",
      "Basic KYC verification",
      "View asking prices",
    ],
    cta: "Get Started",
    href: "/auth",
    accent: "slate",
    popular: false,
  },
  {
    name: "Premium Buyer",
    price: "GHS 29",
    period: "/month",
    description: "Unlock full buyer tools — contact sellers, make offers, and enter deal rooms.",
    features: [
      "Everything in Free",
      "Contact sellers directly",
      "Submit acquisition offers",
      "Access secure deal rooms",
      "Due diligence participation",
      "Escrow deposit capability",
      "Priority broker support",
    ],
    cta: "Subscribe Now",
    href: "/dashboard#payments",
    accent: "blue",
    popular: true,
  },
  {
    name: "Seller",
    price: "GHS 49",
    period: "/listing",
    description: "List your technology business, SaaS, or digital asset for acquisition.",
    features: [
      "Create and publish listings",
      "AI-powered valuation tools",
      "CIM and report generation",
      "Receive and manage offers",
      "Deal room negotiation",
      "Document generation (NDA, LOI, APA)",
      "Escrow-protected closing",
    ],
    cta: "Start Selling",
    href: "/sell",
    accent: "green",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white font-display mb-4"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            No hidden fees. We succeed when you do — our primary revenue comes from a success fee only when your deal closes.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-[#131A2E]/60 border rounded-2xl p-8 flex flex-col ${
                plan.popular
                  ? "border-[#0080FF]/40 shadow-xl shadow-blue-500/10"
                  : "border-slate-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white font-mono">{plan.price}</span>
                  {plan.period && <span className="text-slate-500 text-sm">{plan.period}</span>}
                </div>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${
                      plan.accent === "blue" ? "text-[#0080FF]" :
                      plan.accent === "green" ? "text-[#00FF85]" :
                      "text-slate-500"
                    }`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button className={`w-full font-bold rounded-xl h-11 ${
                  plan.popular
                    ? "bg-[#0080FF] text-white hover:bg-[#0080FF]/90"
                    : plan.accent === "green"
                    ? "bg-[#00FF85] text-black hover:bg-[#00FF85]/90"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}>
                  {plan.cta} <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Success Fee Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 mb-12"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-[#00FF85]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Success Fee: 8% of Deal Value</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                The platform success fee is deducted automatically from the escrow balance when a deal closes.
                The seller receives the agreed price minus 8%. There are no upfront fees beyond the listing fee for sellers
                and the optional subscription for buyers.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="bg-[#0A0F1E] border border-slate-700 px-3 py-1.5 rounded-lg">
                  Escrow-protected via <span className="text-[#00FF85] font-bold">GTPay</span>
                </span>
                <span className="bg-[#0A0F1E] border border-slate-700 px-3 py-1.5 rounded-lg">
                  Mobile Money & Bank Transfer accepted
                </span>
                <span className="bg-[#0A0F1E] border border-slate-700 px-3 py-1.5 rounded-lg">
                  Payments in Ghana Cedis (GHS)
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <div className="bg-[#131A2E]/60 border border-slate-800 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Payment Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0A0F1E]/60 border border-slate-800/60 p-5 rounded-xl text-center">
              <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-white font-semibold text-sm">Mobile Money</p>
              <p className="text-slate-500 text-[11px] mt-1">MTN, Vodafone, AirtelTigo</p>
            </div>
            <div className="bg-[#0A0F1E]/60 border border-slate-800/60 p-5 rounded-xl text-center">
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-semibold text-sm">Bank Transfer (GIP)</p>
              <p className="text-slate-500 text-[11px] mt-1">All major Ghanaian banks</p>
            </div>
            <div className="bg-[#0A0F1E]/60 border border-slate-800/60 p-5 rounded-xl text-center">
              <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-white font-semibold text-sm">GTBank Partner API</p>
              <p className="text-slate-500 text-[11px] mt-1">Powered by GTPay</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
