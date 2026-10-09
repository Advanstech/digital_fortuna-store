import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#050810] py-16 border-t border-white/5">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="text-lg font-bold font-display text-white tracking-tight">
                Digital Fortuna
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              The premium marketplace for production-ready startups, full-stack tools, and digital businesses. Built for Africa and the world.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/catalog" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Browse Marketplace</Link></li>
              <li><Link href="/sell" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">List a Business</Link></li>
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Escrow Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Due Diligence Guide</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-[#00FF85] transition-colors">Seller Agreement</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Digital Fortuna. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
