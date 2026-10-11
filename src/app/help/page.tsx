export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-8">Help Center</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-lg">Need assistance with your listing, escrow transfer, or JARVIS configuration? We're here to help.</p>
          
          <div className="mt-8 space-y-4">
            <h3 className="text-white font-bold text-xl">Contact Support</h3>
            <p className="text-slate-400">Email us directly at <strong>support@digitalfortuna.com</strong>. We aim to respond to all inquiries within 12 hours.</p>
            
            <h3 className="text-white font-bold text-xl mt-8">FAQs</h3>
            <ul className="list-disc pl-5 text-slate-400 space-y-2">
              <li>How long does the escrow process take? (Usually 3-5 business days)</li>
              <li>Can I list an app with zero revenue? (Yes, if the codebase has proven value or active free users)</li>
              <li>Do you support Mobile Money payouts? (Yes, across Ghana, Nigeria, and Kenya)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
