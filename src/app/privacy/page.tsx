export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-sm text-slate-500 mb-8">Last updated: October 10, 2026</p>
          
          <p>Your privacy is critically important to us. At Digital Fortuna Computing, we have a few fundamental principles:</p>
          
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>We don't ask you for personal information unless we truly need it.</li>
            <li>We don't share your personal information with anyone except to comply with the law, develop our products, or protect our rights.</li>
            <li>We don't store personal information on our servers unless required for the on-going operation of one of our services.</li>
          </ul>

          <h2 className="text-2xl text-white font-bold mt-8 mb-4">Website Visitors</h2>
          <p>Like most website operators, Digital Fortuna Computing collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request.</p>
          
          <h2 className="text-2xl text-white font-bold mt-8 mb-4">Financial Data</h2>
          <p>When you connect payment gateways for due diligence verification, we utilize read-only tokens. We do not store or process your customers' raw credit card information on our servers.</p>
        </div>
      </div>
    </main>
  );
}
