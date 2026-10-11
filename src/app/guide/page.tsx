export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-8">Due Diligence Guide</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-lg mb-6">Our automated AI due-diligence engine reviews every asset before it's listed. Here is what we look for:</p>
          <div className="space-y-6">
            <div className="bg-[#131A2E]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-2">1. Code Quality & Security</h3>
              <p className="text-slate-400">We scan repositories for hardcoded secrets, known CVEs in dependencies, and overall architectural soundness.</p>
            </div>
            <div className="bg-[#131A2E]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-2">2. Financial Verification</h3>
              <p className="text-slate-400">Connecting directly to Stripe or equivalent payment gateways to verify MRR, churn, and LTV claims against the P&L.</p>
            </div>
            <div className="bg-[#131A2E]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-2">3. Traffic & Analytics</h3>
              <p className="text-slate-400">Read-only Google Analytics or Plausible access is used to verify active users and acquisition channels.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
