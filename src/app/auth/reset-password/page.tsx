"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }

    if (password.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:4000/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      
      const resJson = await res.json();
      const apiData = resJson.data || resJson;

      setIsLoading(false);

      if (res.ok) {
        toast("Password successfully reset!", "success");
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      } else {
        toast(apiData.message || "Failed to reset password. Link may be expired.", "error");
      }
    } catch (err) {
      setIsLoading(false);
      toast("Network error. Please try again.", "error");
    }
  };

  if (!token) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
        <p className="text-slate-400 mb-8">This password reset link is invalid or missing.</p>
        <Link href="/auth">
          <Button className="bg-[#0080FF] hover:bg-[#0080FF]/80 text-white rounded-xl">
            Return to Login
          </Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-[#00FF85]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-[#00FF85]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Password Reset!</h2>
        <p className="text-slate-400 mb-8">Your password has been changed. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white font-display mb-2 tracking-tight">
          Set New Password
        </h1>
        <p className="text-slate-400 text-sm font-light">
          Enter a new, secure password for your account.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0080FF]" /> New Password
          </label>
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0080FF]" /> Confirm Password
          </label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              className="w-full bg-[#0A0F1E] border border-slate-800 focus:border-[#00FF85] rounded-xl p-4 pr-12 text-white outline-none transition-all placeholder-slate-600"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-gradient-to-r from-[#00FF85] to-[#0080FF] text-black hover:opacity-95 py-6 text-lg font-bold mt-4 w-full rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00FF85]/10"
      >
        {isLoading ? "SAVING..." : "RESET PASSWORD"}
        <ArrowRight className="w-5 h-5" />
      </Button>

      <div className="mt-8 pt-6 border-t border-slate-800/80 flex justify-center text-sm">
        <Link 
          href="/auth" 
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-semibold"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Login
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00FF85]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#0080FF]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-10">
          <div className="text-3xl font-display font-black tracking-tighter text-white flex items-center gap-3 relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00FF85] to-[#0080FF] rounded-xl rotate-12 flex items-center justify-center shadow-lg shadow-[#00FF85]/20">
              <div className="w-4 h-4 bg-[#050814] rounded-sm -rotate-12" />
            </div>
            Digital Fortuna
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0B1021]/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-800/50 shadow-2xl relative"
        >
          <Suspense fallback={<div className="text-center text-slate-400 py-10">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
