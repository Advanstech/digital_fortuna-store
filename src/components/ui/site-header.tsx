"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard, Compass, PlusCircle, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";

export function SiteHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Read login state on boot
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecoded = JSON.parse(atob(payloadBase64));
        const role = (payloadDecoded.role || '').toLowerCase();
        const email = (payloadDecoded.email || '').toLowerCase();
        if (['admin', 'superadmin', 'super_admin', 'root'].includes(role) || email === 'hanson.pepra@gmail.com') {
          setIsAdmin(true);
        }
      } catch {
        // ignore
      }

      // Live fetch /v1/auth/me to check DB role
      fetch("http://localhost:4000/v1/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(raw => {
        const data = raw.data || raw;
        const role = (data?.role || '').toLowerCase();
        const email = (data?.email || '').toLowerCase();
        if (['admin', 'superadmin', 'super_admin', 'root'].includes(role) || email === 'hanson.pepra@gmail.com') {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsMobileMenuOpen(false);
    toast("Logged out of session. Access terminated.", "info");
    router.push("/");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0A0F1E]/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/30 shadow-[0_0_15px_rgba(0,255,133,0.2)] group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(0,128,255,0.3)] transition-all bg-[#0A0F1E] flex items-center justify-center p-0.5">
              <img src="/images/logo.png" alt="Digital Fortuna Computing Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display text-white tracking-tight group-hover:text-[#00FF85] transition-colors leading-tight">
                Digital Fortuna
              </span>
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase -mt-0.5">
                Computing
              </span>
            </div>
          </Link>
          
          {/* Desktop Nav Menus */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/catalog" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1">
              <Compass className="w-4 h-4 opacity-50" /> Marketplace
            </Link>
            <Link href="/sell" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1">
              <PlusCircle className="w-4 h-4 opacity-50" /> List Your Startup
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              About Us
            </Link>
          </nav>
        </div>

        {/* Action Controls & Responsive Mobile Button */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <CurrencySwitcher />
          </div>
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link href="/auth" passHref>
                  <Button 
                    variant="ghost" 
                    className="hidden sm:inline-flex text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/auth?signup=true" passHref>
                  <Button 
                    className="bg-white text-black hover:bg-white/90 font-semibold px-5 rounded-lg text-sm"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link href="/admin" passHref>
                    <Button 
                      variant="ghost" 
                      className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Admin Console
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard" passHref>
                  <Button 
                    variant="ghost" 
                    className="text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 text-sm font-semibold"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Deal Room
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-4 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Hamburger Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Animated Mobile Drawer Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0F1E] border-b border-slate-800/80 w-full overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6 font-display">
              <Link 
                href="/catalog" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-200 hover:text-[#00FF85]"
              >
                Marketplace
              </Link>
              <Link 
                href="/sell" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-200 hover:text-[#00FF85]"
              >
                List Your Startup
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-200 hover:text-[#00FF85]"
              >
                About Us
              </Link>
              
              <div className="pt-2">
                <CurrencySwitcher full />
              </div>

              <div className="h-[1px] bg-slate-800 my-2" />

              {!isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <Link href="/auth" passHref onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-800 text-slate-200 py-6 text-base font-semibold rounded-xl"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth?signup=true" passHref onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      className="w-full bg-[#00FF85] text-black py-6 text-base font-bold rounded-xl"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {isAdmin && (
                    <Link href="/admin" passHref onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        className="w-full bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 py-6 text-base font-bold rounded-xl flex items-center justify-center gap-2"
                      >
                        <ShieldAlert className="w-5 h-5 text-purple-400" /> Admin Console
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard" passHref onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-800 text-slate-200 py-6 text-base font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-5 h-5 text-[#0080FF]" /> Deal Room Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-6 text-base font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" /> Terminate Session (Sign Out)
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
