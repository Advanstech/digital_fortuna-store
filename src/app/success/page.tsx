export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-8">Success Stories</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-lg mb-8">See how founders from Africa and around the world successfully exited their micro-SaaS businesses using Digital Fortuna Computing.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#131A2E]/60 border border-slate-800 p-6 rounded-2xl">
              <div className="text-[#00FF85] font-mono text-sm mb-2">Acquired for $120k</div>
              <h3 className="text-xl text-white font-bold mb-2">PayAPI Integration Hub</h3>
              <p className="text-slate-400">A solo founder in Lagos built a unified MoMo API aggregator. Listed on Fortuna and acquired by a European fintech within 14 days.</p>
            </div>
            <div className="bg-[#131A2E]/60 border border-slate-800 p-6 rounded-2xl">
              <div className="text-[#00FF85] font-mono text-sm mb-2">Acquired for $85k</div>
              <h3 className="text-xl text-white font-bold mb-2">AI Ad Creative Tool</h3>
              <p className="text-slate-400">Built specifically for Instagram merchants in Ghana, this AdGenie-like tool found a strategic buyer looking to expand into the African SME market.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
