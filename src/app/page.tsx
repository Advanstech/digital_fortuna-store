"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Spline from '@splinetool/react-spline';
import { ListingCard } from '@/components/listings/listing-card';
import { Button } from '@/components/ui/button';
import { AnimatedHeroText } from '@/components/animated-hero-text';
import { FeaturedInSection } from '@/components/ui/featured-in';
import { HowItWorksSection } from '@/components/ui/how-it-works';
import { BenefitsSection } from '@/components/ui/benefits';
import { FinalCTASection } from '@/components/ui/final-cta';
import { getListings, type MarketplaceListing } from '@/lib/api/listings';
import { useCurrency } from '@/lib/currency';

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<MarketplaceListing[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);
  const { format: formatPrice } = useCurrency();

  useEffect(() => {
    getListings({ limit: 4, sort: "newest" })
      .then(({ data }) => setFeaturedListings(data))
      .catch((error) => {
        console.warn("Failed to load marketplace listings:", error);
        setFeaturedError(true);
      })
      .finally(() => setFeaturedLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      {/* 3D Hero Section */}
      <section className="relative isolate flex min-h-screen min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#0A0F1E]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,128,255,0.18),_transparent_58%),linear-gradient(135deg,_#0A0F1E,_#10182a_55%,_#0A0F1E)]" />
        <div className="absolute inset-0 z-0 opacity-70 md:opacity-80 cursor-grab active:cursor-grabbing">
          <Spline
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            renderOnDemand
            className="h-full w-full"
            aria-hidden="true"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0A0F1E]/35 via-[#0A0F1E]/25 to-[#0A0F1E]/90" />

        {/* Hero Content */}
        <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-5 pb-24 pt-28 text-center sm:px-8 sm:pb-28 sm:pt-32">
          <div className="mb-4 flex w-full justify-center sm:mb-6">
            <AnimatedHeroText />
          </div>

          <p className="mb-8 max-w-2xl text-base font-light leading-relaxed text-slate-200 sm:mb-10 sm:text-lg md:text-2xl">
            The world&apos;s most curated on-demand marketplace for production-ready startup software, AI-powered tools, and full-stack digital businesses.
          </p>
          <div className="pointer-events-auto flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link href="/catalog" className="w-full sm:w-auto">
              <Button className="w-full rounded-full bg-[#F5C842] px-7 py-5 text-base font-semibold text-black hover:bg-[#F5C842]/80 sm:px-8 sm:py-6 sm:text-lg">
                Find Your Business
              </Button>
            </Link>
            <Link href="/sell" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full rounded-full border-slate-700 bg-[#1C2333]/70 px-7 py-5 text-base font-semibold text-white backdrop-blur-sm hover:bg-[#1C2333] sm:px-8 sm:py-6 sm:text-lg">
                List Your Product
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 sm:block sm:bottom-7" aria-hidden="true">
          <div className="h-12 w-[2px] bg-gradient-to-b from-transparent via-[#00FF85] to-transparent animate-pulse sm:h-16" />
        </div>
      </section>

      {/* Marketplace Information Strip */}
      <section className="border-y border-slate-800/80 bg-[#070B16] py-4 relative z-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#00FF85]" />
            <span className="text-slate-400">MARKETPLACE:</span>
            <span className="text-[#00FF85] font-semibold">LIVE SELLER LISTINGS</span>
          </div>
          <div className="flex w-full min-w-0 max-w-full items-center gap-4 overflow-x-auto py-1 text-slate-400 no-scrollbar sm:gap-6 md:w-auto md:flex-1">
            <span>Seller-provided details</span>
            <span className="text-slate-700">•</span>
            <span>KYC-gated deal rooms</span>
            <span className="text-slate-700">•</span>
            <span>Mobile Money & bank transfer</span>
            <span className="text-slate-700">•</span>
            <span>GHS payments via GTPay</span>
          </div>
        </div>
      </section>

      {/* Featured In / Sponsors Section */}
      <FeaturedInSection />

      {/* Featured Listings Section - Sticky Layout */}
      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-3 md:gap-12 md:px-8 md:py-24">
        
        {/* Sticky Left Sidebar for Section Header */}
        <div className="self-start md:sticky md:top-32 md:col-span-1">
          <div className="inline-flex items-center gap-2 bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] px-3.5 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
            Live M&A Catalog
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight font-display">
            Live <br className="hidden md:block"/> Startups
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Explore currently published businesses and software listings. Each dossier uses information supplied by its seller.
          </p>
          <Link href="/catalog" passHref>
            <Button variant="link" className="text-[#00FF85] hover:text-[#00FF85]/80 p-0 text-lg font-semibold flex items-center gap-2">
              Browse Entire Catalog &rarr;
            </Button>
          </Link>
        </div>

        {/* Scrollable Right Grid */}
        <div className="grid min-w-0 grid-cols-1 gap-5 md:col-span-2 md:grid-cols-2 md:gap-8">
          {featuredLoading ? (
            [0, 1, 2, 3].map((item) => (
              <div key={item} className="h-[400px] animate-pulse rounded-2xl border border-slate-800 bg-[#131A2E]/60" />
            ))
          ) : featuredListings.length > 0 ? (
            featuredListings.map((listing, index) => {
              const acquisitionPrice = Number(listing.acquisitionPrice || 0);
              const licensePrice = Number(listing.monthlyLicensePrice || 0);
              const amount = acquisitionPrice || licensePrice;
              const type = licensePrice && !acquisitionPrice ? "saas" : "acquisition";
              return (
                <div key={listing.id} className={index % 2 === 1 ? "md:mt-16" : ""}>
                  <ListingCard
                    id={listing.slug || listing.id}
                    title={listing.title}
                    category={String(listing.category || "other").replace(/_/g, " ")}
                    price={amount ? formatPrice(amount, { suffix: type === "saas" ? "/mo" : "" }) : "Contact seller"}
                    type={type}
                    imageUrl={listing.details?.assets?.screenshot || listing.details?.images?.[0] || undefined}
                    tagline={listing.tagline || listing.description || ""}
                    verified={Boolean(listing.verified)}
                    priority={index === 0}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-slate-800 bg-[#131A2E]/40 p-8 text-center">
              <p className="text-slate-300 font-semibold">
                {featuredError ? "Live listings could not be loaded." : "No live listings are available yet."}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {featuredError ? "Please visit the marketplace and try again." : "Browse the marketplace to see businesses when they are published."}
              </p>
            </div>
          )}
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
