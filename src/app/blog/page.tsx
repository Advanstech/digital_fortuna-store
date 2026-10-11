export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-8">Blog & Updates</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-lg mb-8">Latest news, feature releases, and market insights from the Digital Fortuna Computing team.</p>
          
          <div className="space-y-6">
            <article className="bg-[#131A2E]/60 border border-slate-800 p-6 rounded-2xl">
              <span className="text-xs text-slate-500 font-mono">October 10, 2026</span>
              <h3 className="text-xl text-white font-bold mt-2 mb-2">Introducing Automated AI Due Diligence</h3>
              <p className="text-slate-400">We've just rolled out our proprietary AI engine that automatically audits P&L statements and GitHub repositories to speed up the escrow process by 40%.</p>
            </article>
            <article className="bg-[#131A2E]/60 border border-slate-800 p-6 rounded-2xl">
              <span className="text-xs text-slate-500 font-mono">September 15, 2026</span>
              <h3 className="text-xl text-white font-bold mt-2 mb-2">Why Africa is the Next Frontier for Micro-SaaS</h3>
              <p className="text-slate-400">An in-depth look at the exploding creator economy in Ghana and Nigeria, and why global buyers are hunting for localized SaaS assets.</p>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}
