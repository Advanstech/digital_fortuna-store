export default function EscrowPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-8">Secure Escrow Service</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-lg">Our cryptographically secure escrow vault guarantees that capital and source code are protected during the transaction process.</p>
          <div className="bg-[#131A2E]/60 border border-slate-800 p-6 rounded-2xl mt-8">
            <h3 className="text-white font-bold mb-2">How it works:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-slate-400">
              <li>Buyer deposits funds into the Digital Fortuna escrow account.</li>
              <li>Seller uploads source code, database dumps, and transfers domains to the staging vault.</li>
              <li>Buyer verifies the assets.</li>
              <li>Funds are released to the Seller, and assets are fully unlocked for the Buyer.</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
