export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-8">Pricing</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-lg">Digital Fortuna Computing is free to browse. We take a standard flat commission only when an acquisition successfully closes through our escrow.</p>
          <ul className="mt-8 space-y-4">
            <li><strong>SaaS Listing:</strong> Free to list.</li>
            <li><strong>Success Fee:</strong> 8% of the final sale price.</li>
            <li><strong>JARVIS Retainer:</strong> Starting at $250/mo.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
