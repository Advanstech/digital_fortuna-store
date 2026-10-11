export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-sm text-slate-500 mb-8">Last updated: October 10, 2026</p>
          <h2 className="text-2xl text-white font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using Digital Fortuna Computing ("the Platform"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Platform.</p>
          
          <h2 className="text-2xl text-white font-bold mt-8 mb-4">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Digital Fortuna Computing's website for personal, non-commercial transitory viewing only.</p>
          
          <h2 className="text-2xl text-white font-bold mt-8 mb-4">3. Escrow and Transactions</h2>
          <p>All platform transactions must utilize our proprietary escrow service. Attempting to bypass the escrow system to avoid success fees will result in immediate permanent account termination.</p>
        </div>
      </div>
    </main>
  );
}
