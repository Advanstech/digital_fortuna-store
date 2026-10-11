export default function SellerAgreementPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-8">Seller Agreement</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-sm text-slate-500 mb-8">Last updated: October 10, 2026</p>
          
          <div className="bg-[#131A2E]/60 border border-slate-800 p-8 rounded-2xl">
            <h2 className="text-2xl text-white font-bold mb-4">Seller Obligations</h2>
            <p className="mb-4">As a Seller on the Digital Fortuna Computing marketplace, you agree to the following legally binding terms:</p>
            
            <ol className="list-decimal pl-5 space-y-4">
              <li><strong>Accuracy of Information:</strong> All financial data, P&L statements, and analytics provided must be strictly accurate. Falsification of data is grounds for legal action and permanent ban.</li>
              <li><strong>Asset Transfer:</strong> Upon successful escrow funding, you must transfer all domains, codebase rights, and social media handles associated with the listed project within 5 business days.</li>
              <li><strong>Non-Compete:</strong> Sellers agree to a 12-month non-compete clause, stipulating that they will not launch a direct competitor to the sold asset within the same geographic market.</li>
              <li><strong>Commission:</strong> Digital Fortuna Computing deducts a flat 8% success fee from the final sale amount prior to releasing the funds from escrow to your account.</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
