"use client";

import Link from "next/link";

import Spline from '@splinetool/react-spline';
import { ListingCard } from '@/components/listings/listing-card';
import { Button } from '@/components/ui/button';
import { AnimatedHeroText } from '@/components/animated-hero-text';
import { FeaturedInSection } from '@/components/ui/featured-in';
import { HowItWorksSection } from '@/components/ui/how-it-works';
import { BenefitsSection } from '@/components/ui/benefits';
import { FinalCTASection } from '@/components/ui/final-cta';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      {/* 3D Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Spline 3D Scene - Removed pointer-events-none so it's interactive */}
        <div className="absolute inset-0 z-0 opacity-80 cursor-grab active:cursor-grabbing">
          {/* Live Interactive Spline Scene */}
          <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-4 pointer-events-none pt-16">
          {/* Animated Rotating Text */}
          <div className="w-full flex justify-center mb-6">
            <AnimatedHeroText />
          </div>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto text-center font-light">
            The world's most curated on-demand marketplace for production-ready startup software, AI-powered tools, and full-stack digital businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
            <Link href="/catalog" passHref>
              <Button className="bg-[#F5C842] text-black hover:bg-[#F5C842]/80 px-8 py-6 text-lg rounded-full font-semibold">
                Find Your Business
              </Button>
            </Link>
            <Link href="/sell" passHref>
              <Button variant="outline" className="px-8 py-6 text-lg rounded-full font-semibold border-slate-700 bg-[#1C2333]/50 backdrop-blur-sm text-white hover:bg-[#1C2333]">
                List Your Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator - Small vertical line */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-[2px] h-16 bg-gradient-to-b from-transparent via-[#00FF85] to-transparent animate-pulse" />
        </div>
      </section>

      {/* Live Market Telemetry Strip */}
      <section className="border-y border-slate-800/80 bg-[#070B16] py-4 relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#00FF85] animate-ping" />
            <span className="text-slate-400">MARKETPLACE STATUS:</span>
            <span className="text-[#00FF85] font-semibold">ALL CLEAR (100% ESCROW UPTIME)</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400 overflow-x-auto no-scrollbar py-1">
            <span><strong className="text-white">$14.2M+</strong> Closed Volume</span>
            <span className="text-slate-700">•</span>
            <span><strong className="text-white">150+</strong> Vetted Assets</span>
            <span className="text-slate-700">•</span>
            <span><strong className="text-white">1st Agent OS</strong> in Africa</span>
            <span className="text-slate-700">•</span>
            <span><strong className="text-white">Dual Settlement:</strong> USD & MoMo</span>
          </div>
        </div>
      </section>

      {/* Featured In / Sponsors Section */}
      <FeaturedInSection />

      {/* Featured Listings Section - Sticky Layout */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 relative z-10">
        
        {/* Sticky Left Sidebar for Section Header */}
        <div className="md:w-1/3 md:sticky top-32 self-start">
          <div className="inline-flex items-center gap-2 bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] px-3.5 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
            Verified M&A Catalog
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight font-display">
            Featured <br className="hidden md:block"/> Startups
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Verified, production-ready platforms and autonomous AI agents you can acquire today with instant escrow settlement.
          </p>
          <Link href="/catalog" passHref>
            <Button variant="link" className="text-[#00FF85] hover:text-[#00FF85]/80 p-0 text-lg font-semibold flex items-center gap-2">
              Browse Entire Catalog &rarr;
            </Button>
          </Link>
        </div>

        {/* Scrollable Right Grid */}
        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ListingCard 
            id="jarvis-agent-os"
            title="JARVIS - 1-Person Business AI" 
            category="AI & Autonomous Agents" 
            price="$240,000" 
            type="acquisition"
            imageUrl="/images/premium_hero_bg.png"
            priority={true}
          />
          <div className="md:mt-16">
            <ListingCard 
              id="mock-1"
              title="ModernRx POS Platform" 
              category="Healthcare & Pharmacy" 
              price="$15,000" 
              type="acquisition"
              imageUrl="/images/modernrx.png"
            />
          </div>
          <ListingCard 
            id="mock-2"
            title="FortunaEats Restaurant OS" 
            category="Food & POS Systems" 
            price="$8,500" 
            type="acquisition"
            imageUrl="/images/fortunaeats.png"
          />
          <div className="md:mt-16">
            <ListingCard 
              id="mock-3"
              title="OpenCLAW Operations Hub" 
              category="Office & AI Automation" 
              price="$99/mo" 
              type="saas"
              imageUrl="/images/openclaw.png"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Final Call To Action */}
      <FinalCTASection />
    </main>
  );
}
