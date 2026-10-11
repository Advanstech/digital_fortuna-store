"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Key, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [needs2FA, setNeeds2FA] = useState(false);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";
  const getPostAuthDestination = () => {
    const next = new URLSearchParams(window.location.search).get("next");
    return next?.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/catalog";
  };

  // Check URL query for signup flag
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("signup") === "true") {
        setIsLogin(false);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isResetPassword) {
      try {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        const resJson = await res.json();
        const apiData = resJson.data || resJson;
        
        setIsLoading(false);
        
        if (res.ok) {
          toast(apiData.message || "Password reset link sent to your email!", "success");
          setIsResetPassword(false);
        } else {
          toast(apiData.message || "Failed to send reset link", "error");
        }
      } catch (err) {
        setIsLoading(false);
        toast("Network error. Please try again.", "error");
      }
      return;
    }

    try {
      if (needs2FA) {
        // Handle 2FA Verification
        const res = await fetch(`${API_BASE}/auth/2fa/verify-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, authCode }),
        });
        const resJson = await res.json();
        const apiData = resJson.data || resJson;
        
        if (apiData.access_token) {
          localStorage.setItem("access_token", apiData.access_token);
          localStorage.setItem("refresh_token", apiData.refresh_token);
          toast("Successfully verified security clearance!", "success");
          window.location.href = getPostAuthDestination();
        } else {
          toast(apiData.message || resJson.message || "Invalid 2FA Authenticator code", "error");
        }
        return;
      }

      // Handle normal Login or Register
      const endpoint = isLogin ? "login" : "register";
      const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const resJson = await res.json();
      const apiData = resJson.data || resJson;

      if (apiData.isTwoFactorRequired) {
        setNeeds2FA(true);
        setUserId(apiData.userId);
        return;
      }

      if (apiData.access_token) {
        localStorage.setItem("access_token", apiData.access_token);
        localStorage.setItem("refresh_token", apiData.refresh_token);
        toast(isLogin ? "Logged in successfully!" : "Registered successfully!", "success");
        window.location.href = getPostAuthDestination();
      } else {
        toast(apiData.message || resJson.message || "Authentication failed. Check credentials.", "error");
      }
    } catch (error) {
      console.error(error);
      toast("An error occurred during authentication.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 relative overflow-hidden pt-24 pb-12">
      {/* Dynamic Background Auras */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF85]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0080FF]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Highly Impactful Marketing Copy & Real-Time Security Feed */}
        <div className="lg:col-span-5 text-center lg:text-left space-y-6 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4" /> Vetted Security Clearance
          </motion.div>
          
          <h2 className="text-4xl font-extrabold text-white leading-tight font-display">
            The Gateway to Vetted Software Acquisitions.
          </h2>
          
          <p className="text-slate-400 font-light leading-relaxed text-base">
            Gain full verification to browse thousands of pre-vetted Micro-SaaS codebases, production-ready AI tools, and restaurant POS platforms. List and transact instantly.
          </p>

          <div className="space-y-3 bg-[#131A2E]/50 p-5 rounded-2xl border border-slate-800/80">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Security protocols active
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#00FF85]" /> AES-256 Bit Encryption standard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#00FF85]" /> Two-Factor Authenticator (TOTP) enforcement
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Double-Panel Glassmorphic Form Card */}
        <div className="lg:col-span-7 flex justify-center w-full">
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-[#131A2E]/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative"
          >
            {/* Top border glowing highlight */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#00FF85] to-transparent opacity-60" />

            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-white font-display mb-2 tracking-tight">
                {needs2FA ? "Two-Factor Auth" : (isResetPassword ? "Reset Password" : (isLogin ? "Welcome Back" : "Create Account"))}
              </h1>
              <p className="text-slate-400 text-sm font-light">
                {needs2FA 
                  ? "Enter the 6-digit verification code from your Google or Microsoft Authenticator app."
                  : (isResetPassword 
                      ? "Enter your email address and we'll send you a link to reset your password."
                      : (isLogin ? "Enter credentials to load your security clearance folder." : "Register to start listing or buying pre-vetted tech."))}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <AnimatePresence mode="wait">
                {needs2FA ? (
                  <motion.div 
                    key="2fa-fields"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-slate-300 text-sm font-medium flex justify-center gap-2 mb-3">
                        <Key className="w-4 h-4 text-[#00FF85]" /> Authenticator Code (TOTP)
                      </label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white text-center tracking-widest text-2xl font-bold font-display outline-none transition-all"
                        placeholder="000 000"
                        maxLength={6}
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                      />
                    </div>
                  </motion.div>
                ) : isResetPassword ? (
                  <motion.div 
                    key="reset-fields"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#0080FF]" /> Email Address
                      </label>
                      <input 
                        required
                        type="email" 
                        className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white outline-none transition-all placeholder-slate-600"
                        placeholder="founder@venture.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="normal-fields"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#0080FF]" /> Email Address
                      </label>
                      <input 
                        required
                        type="email" 
                        className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 text-white outline-none transition-all placeholder-slate-600"
                        placeholder="founder@venture.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                          <Lock className="w-4 h-4 text-[#0080FF]" /> Password
                        </label>
                        {isLogin && (
                          <button 
                            type="button" 
                            onClick={() => setIsResetPassword(true)}
                            className="text-xs text-[#0080FF] hover:text-[#00FF85] transition-colors"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 pr-12 text-white outline-none transition-all placeholder-slate-600"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-[#00FF85] to-[#0080FF] text-black hover:opacity-95 py-6 text-lg font-bold mt-2 w-full rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00FF85]/10"
              >
                {isLoading ? "AUTHORIZING..." : (needs2FA ? "VERIFY PASSKEY" : (isResetPassword ? "SEND RESET LINK" : (isLogin ? "SIGN IN Clearance" : "GENERATE SECURE ACCOUNT")))}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            {(!needs2FA && !isResetPassword) && (
              <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                <p className="text-slate-400">
                  {isLogin ? "Need credentials? " : "Already have clearance? "}
                  <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="text-[#00FF85] font-semibold hover:underline"
                    type="button"
                  >
                    {isLogin ? "Create account" : "Log in"}
                  </button>
                </p>
                <Link href="/about" className="text-slate-500 hover:text-white flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" /> Need assistance?
                </Link>
              </div>
            )}
            
            {isResetPassword && (
              <div className="mt-8 pt-6 border-t border-slate-800/80 flex justify-center text-sm">
                <button 
                  onClick={() => setIsResetPassword(false)} 
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-semibold"
                  type="button"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> Back to Login
                </button>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </main>
  );
}
