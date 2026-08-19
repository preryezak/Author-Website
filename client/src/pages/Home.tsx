import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Shield, Compass, ChevronRight, CheckCircle2, Sparkles, Feather } from "lucide-react";

export default function Home() {
  const [selectedFormat, setSelectedFormat] = useState<"ebook" | "bundle">("ebook");

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1A1A1A] font-sans selection:bg-[#C5A059] selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-[#1E293B] text-[#F8FAFC] py-2.5 px-4 text-center text-xs tracking-widest font-medium uppercase border-b border-[#C5A059]/30">
        <span className="text-[#C5A059] font-bold">THE DEEP ENCOUNTER LIBRARY</span> &bull; VOL. I &bull; BY PASTOR ERYEZA KALALU
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#F7F4EF]/95 backdrop-blur-md border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center text-[#C5A059] font-serif font-bold text-2xl shadow-md border-2 border-[#C5A059]/40">
              EK
            </div>
            <div>
              <span className="font-serif font-bold text-2xl tracking-tight text-[#1E293B] block leading-none">Eryeza Kalalu</span>
              <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block mt-1">Author &amp; Pastor</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-10 text-sm font-semibold text-[#334155] tracking-wide">
            <a href="#overview" className="hover:text-[#C5A059] transition-colors">Overview</a>
            <a href="#about-book" className="hover:text-[#C5A059] transition-colors">The 30-Day Path</a>
            <a href="#author" className="hover:text-[#C5A059] transition-colors">Author</a>
            <a href="#formats" className="hover:text-[#C5A059] transition-colors">Editions</a>
          </nav>
          <div>
            <a href="#formats">
              <Button className="bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold px-6 py-5 shadow-sm transition-all tracking-wide text-sm">
                Secure Your Copy
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden border-b border-[#E6E0D4]">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-[#EFECE6] border border-[#C5A059]/40 rounded-full px-5 py-2 text-xs font-bold text-[#1E293B] tracking-widest uppercase">
                <Feather className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Flagship Devotional Release &bull; Book 1</span>
              </div>
              
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1E293B] leading-[1.08]">
                The Influential <span className="text-[#C5A059] italic font-normal">Spirit</span>
              </h1>
              
              <p className="font-serif text-xl sm:text-2xl font-semibold text-[#4B5563] tracking-tight leading-snug">
                30 Days to a Life of Kingdom Authority, Character, and Marketplace Impact.
              </p>
              
              <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl font-sans">
                A daily discipleship engine built for Christian professionals and leaders who refuse to separate spiritual depth from everyday execution. Grounded strictly in Biblical truth and forged in real-world leadership.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 pt-2">
                <a href="#formats">
                  <Button size="lg" className="bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold px-9 py-7 text-base shadow-xl border border-[#C5A059]/30">
                    Acquire Master Editions
                    <ChevronRight className="ml-2 w-5 h-5 text-[#C5A059]" />
                  </Button>
                </a>
                <a href="#about-book">
                  <Button size="lg" variant="outline" className="border-[#1E293B]/20 hover:bg-[#EFECE6] text-[#1E293B] font-semibold px-8 py-7 text-base">
                    Explore The 30-Day Blueprint
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-8 border-t border-[#E6E0D4] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-[#4B5563]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">✓</div>
                  <span>Scriptural Authority</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">✓</div>
                  <span>Instant PDF & EPUB Delivery</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">✓</div>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>

            {/* Right Cover Mockup in Manuscript Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#C5A059]/30 via-transparent to-[#1E293B]/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-[#FAF8F5] p-6 rounded-2xl shadow-2xl border-2 border-[#C5A059]/40 max-w-sm">
                  <div className="absolute top-3 right-3 text-[#C5A059] font-serif text-xs tracking-widest uppercase font-bold">The Deep Encounter Library VOL. 01</div>
                  <img 
                    src="/manus-storage/influence_cover_definitive_master_v2_d28be92f.png" 
                    alt="The Influential Spirit Book Cover" 
                    className="w-full h-auto rounded shadow-lg border border-[#E6E0D4] object-cover"
                  />
                  <div className="mt-4 text-center space-y-1">
                    <span className="text-xs text-[#1E293B] font-serif font-bold tracking-widest block uppercase">Definitive Master Edition</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ornamental Divider */}
      <div className="py-6 bg-[#EFECE6] border-b border-[#E6E0D4] text-center text-[#C5A059] font-serif tracking-[0.3em] text-sm uppercase">
        &bull; &bull; &bull; THE DEEP ENCOUNTER FRAMEWORK &bull; &bull; &bull;
      </div>

      {/* The 3 Pillars Section */}
      <section id="about-book" className="py-24 bg-[#EFECE6] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">Architectural Foundation</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">
              Three Pillars of Kingdom Influence
            </h2>
            <p className="text-[#4B5563] text-lg leading-relaxed font-serif italic">
              "True spiritual influence is neither accidental nor borrowed. It is forged when divine authority meets unshakeable character in the daily marketplace."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-[#FAF8F5] border-2 border-[#E6E0D4] p-8 rounded-xl shadow-sm hover:border-[#C5A059] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-[#C5A059]/10"></div>
              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#C5A059] shadow-md border border-[#C5A059]/40 font-serif font-bold text-xl">
                  I
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E293B]">Kingdom Authority</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed font-sans">
                  Stepping out of spiritual passivity and operating from heavenly governance. You will learn to exercise the authority of Christ over mental strongholds, operational chaos, and spiritual resistance in your sphere.
                </p>
                <div className="pt-4 border-t border-[#E6E0D4] text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                  &bull; Days 1 to 10 &bull;
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FAF8F5] border-2 border-[#E6E0D4] p-8 rounded-xl shadow-sm hover:border-[#C5A059] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-[#C5A059]/10"></div>
              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#C5A059] shadow-md border border-[#C5A059]/40 font-serif font-bold text-xl">
                  II
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E293B]">Formed Character</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed font-sans">
                  Private integrity that sustains public weight. Discover why testing in the secret place precedes elevation, ensuring your character outlasts your gifting and withstands the pressures of success.
                </p>
                <div className="pt-4 border-t border-[#E6E0D4] text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                  &bull; Days 11 to 20 &bull;
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FAF8F5] border-2 border-[#E6E0D4] p-8 rounded-xl shadow-sm hover:border-[#C5A059] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-[#C5A059]/10"></div>
              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#C5A059] shadow-md border border-[#C5A059]/40 font-serif font-bold text-xl">
                  III
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E293B]">Marketplace Impact</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed font-sans">
                  Bridging the sacred-secular divide. Transform boardrooms, enterprises, and professional communities into altars of godly excellence, ethical leadership, and undeniable wisdom.
                </p>
                <div className="pt-4 border-t border-[#E6E0D4] text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                  &bull; Days 21 to 30 &bull;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section id="author" className="py-24 bg-[#F7F4EF] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#C5A059] font-extrabold">
                <Sparkles className="w-4 h-4" />
                <span>Authorial Fingerprint</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">
                Pastor Eryeza Kalalu
              </h2>
              <p className="font-serif text-lg text-[#4B5563] italic">
                Pastor, Author, Publishing Consultant, & Pastor at Rivers of Life Healing Centre-Kawuku
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed font-sans">
                Operating from Kawuku-Entebbe, Uganda, Pastor Eryeza builds rigorous discipleship systems that scale. Through THE CCN DAILY, he equips Christian professionals to integrate deep theological truth with practical daily execution.
              </p>
            </div>

            <div className="lg:col-span-7 bg-[#FAF8F5] p-8 sm:p-12 rounded-2xl border-2 border-[#E6E0D4] shadow-md relative">
              <div className="absolute top-6 right-6 text-[#C5A059] font-serif text-6xl opacity-20">“</div>
              <div className="space-y-6 relative z-10">
                <span className="text-xs uppercase tracking-widest text-[#1E293B] font-bold block">The Author's Mandate</span>
                <blockquote className="font-serif text-xl sm:text-2xl text-[#1E293B] italic leading-relaxed">
                  "We are not called to imitate secular hustle with a Bible verse attached. We are called to carry the unbroken weight of Kingdom governance into every room we enter."
                </blockquote>
                <div className="pt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <div>
                    <strong className="text-[#1E293B] block font-sans">Series Masterplan</strong>
                    The Deep Encounter Library
                  </div>
                  <div>
                    <strong className="text-[#1E293B] block font-sans">Devotional Series</strong>
                    Book 1
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Formats & Payhip Integration Section */}
      <section id="formats" className="py-24 bg-[#1E293B] text-[#F8FAFC] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">Collectible Editions</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">
              Choose Your Edition
            </h2>
            <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed font-sans">
              Acquire the definitive digital master files instantly or secure your library copy. Every purchase directly sponsors ongoing discipleship literature.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Option 1: Digital Ebook */}
            <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-10 border-2 border-slate-800 hover:border-[#C5A059] transition-all flex flex-col justify-between shadow-2xl relative">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#C5A059] text-white font-semibold px-3 py-1">Instant Access</Badge>
                  <span className="font-serif text-3xl font-bold text-white">$15.00</span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Digital Master Ebook</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Complete 30-day devotional in high-resolution PDF and EPUB formats, optimized for Kindle, Apple Books, and all reading devices.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-[#CBD5E1] pt-2 border-t border-slate-800">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> 4K Optimized Cover File Included</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Instant Secure Download</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Formatted for E-Readers & Tablets</li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-800">
                <div className="space-y-3 text-center">
                  <a href="https://payhip.com/ccndaily" target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold py-7 text-base shadow-lg transition-transform active:scale-[0.98]">
                      Acquire Ebook ($15.00)
                    </Button>
                  </a>
                  <p className="text-[11px] text-[#64748B]">Secured via Payhip &bull; Major Cards Accepted</p>
                </div>
              </div>
            </div>

            {/* Option 2: Complete Author Bundle */}
            <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-10 border-2 border-[#C5A059] shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-1.5 rounded-bl-xl shadow-sm">
                Recommended Master Bundle
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between pt-2">
                  <Badge className="bg-slate-800 text-[#C5A059] border border-[#C5A059]/40 font-semibold px-3 py-1">Complete Package</Badge>
                  <span className="font-serif text-3xl font-bold text-white">$27.00</span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">The Influential Bundle</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    The ultimate discipleship package: Ebook edition (PDF/EPUB) plus the complete 30-Day Audio Companion series.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-[#CBD5E1] pt-2 border-t border-slate-800">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Complete Ebook (PDF & EPUB)</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Audio Companion Series (MP3)</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Printable 30-Day Reflection Journal</li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-800">
                <div className="space-y-3 text-center">
                  <a href="https://payhip.com/ccndaily" target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold py-7 text-base shadow-lg transition-transform active:scale-[0.98]">
                      Acquire Master Bundle ($27.00)
                    </Button>
                  </a>
                  <p className="text-[11px] text-[#64748B]">Instant digital delivery &bull; Lifetime access</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-[#94A3B8] py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#C5A059] font-serif font-bold text-lg border border-[#C5A059]/40">
              EK
            </div>
            <div>
              <span className="text-sm font-semibold text-white tracking-wide block">THE CCN DAILY</span>
              <span className="text-[10px] text-[#64748B] block">books.theccndaily.com</span>
            </div>
          </div>
          <p className="text-xs text-[#64748B] text-center md:text-left font-serif italic">
            &copy; 2026 Pastor Eryeza Kalalu &bull; All Rights Reserved.
          </p>
          <div className="text-xs text-[#C5A059] font-medium tracking-wide">
            Grounded in Scripture &bull; Forged for Impact
          </div>
        </div>
      </footer>
    </div>
  );
}
