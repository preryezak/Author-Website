import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Award, Shield, Compass, ChevronRight, CheckCircle2, Feather, Star, MessageSquarePlus, Menu, X } from "lucide-react";
import { toast } from "sonner";

const bundleOptions = [
  { name: "Reader Edition", usd: 15, ugx: 45000, description: "Designed digital reading edition with reflowable EPUB and PDF delivery.", popular: false },
  { name: "Formation Bundle", usd: 29, ugx: 90000, description: "Digital edition, author-narrated audiobook, six-session Group Study Guide, and 30-Day Reading Plan & Challenge.", popular: true },
  { name: "Complete Formation", usd: 49, ugx: 150000, description: "Everything in Formation, plus the Companion Journal, bonus audio declarations and prayers, and the digital resource library.", popular: false },
] as const;

const selarAfricanCurrencies = ["UGX", "NGN", "KES", "GHS", "TZS", "XOF", "XAF", "ZMW", "RWF", "ZAR"] as const;

const currencyLocales: Record<string, string> = {
  UGX: "en-UG", NGN: "en-NG", KES: "en-KE", GHS: "en-GH", TZS: "sw-TZ", XOF: "fr-SN", XAF: "fr-CM", ZMW: "en-ZM", RWF: "rw-RW", ZAR: "en-ZA",
};

const roundForCurrency = (currency: string, amount: number) => {
  const increments: Record<string, number> = { UGX: 5000, NGN: 500, KES: 100, GHS: 10, TZS: 1000, XOF: 500, XAF: 500, ZMW: 10, RWF: 500, ZAR: 10 };
  const increment = increments[currency] ?? 1;
  return Math.max(increment, Math.round(amount / increment) * increment);
};

const formatCurrencyEstimate = (currency: string, amount: number) => new Intl.NumberFormat(currencyLocales[currency] ?? "en", { style: "currency", currency, maximumFractionDigits: 0 }).format(roundForCurrency(currency, amount));

const inferAfricanCurrency = () => {
  if (typeof navigator === "undefined") return "UGX" as const;
  const locale = navigator.language.toLowerCase();
  const localeCurrency: Record<string, (typeof selarAfricanCurrencies)[number]> = { ng: "NGN", ke: "KES", gh: "GHS", tz: "TZS", sn: "XOF", ci: "XOF", cm: "XAF", zm: "ZMW", rw: "RWF", za: "ZAR", ug: "UGX" };
  const country = locale.split("-")[1] ?? "";
  return localeCurrency[country] ?? "UGX";
};

export default function Home() {
  const [selectedFormat, setSelectedFormat] = useState<"ebook" | "bundle">("ebook");
  const [marketRoute, setMarketRoute] = useState<"international" | "africa">("international");
  const [africaCurrency, setAfricaCurrency] = useState<(typeof selarAfricanCurrencies)[number]>(() => inferAfricanCurrency());
  const [ugxRates, setUgxRates] = useState<Record<string, number>>({ UGX: 1 });
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const kitFormRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://open.er-api.com/v6/latest/UGX")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Rate service unavailable")))
      .then((payload: { rates?: Record<string, number> }) => {
        if (!cancelled && payload.rates) setUgxRates({ UGX: 1, ...payload.rates });
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    const container = kitFormRef.current;
    if (!container || container.dataset.kitLoaded === "true") return;

    const script = document.createElement("script");
    script.async = true;
    script.dataset.uid = "6fecaf7182";
    script.src = "https://eryeza-kalalu.kit.com/6fecaf7182/index.js";
    container.appendChild(script);
    container.dataset.kitLoaded = "true";

    return () => {
      container.innerHTML = "";
      delete container.dataset.kitLoaded;
    };
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      toast.error("Please enter your name and review before submitting.");
      return;
    }
    setReviewSubmitted(true);
    toast.success("Thank you! Your review has been received for editorial moderation.");
    setReviewName("");
    setReviewRole("");
    setReviewText("");
    setTimeout(() => {
      setIsDialogOpen(false);
      setReviewSubmitted(false);
    }, 2500);
  };

  const activeAfricanRate = ugxRates[africaCurrency] ?? 1;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EF] text-[#1A1A1A] font-sans selection:bg-[#C5A059] selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-[#1E293B] text-[#F8FAFC] py-2.5 px-4 text-center text-xs tracking-widest font-medium uppercase border-b border-[#C5A059]/30">
        <span className="text-[#C5A059] font-bold">THE DEEP ENCOUNTER LIBRARY</span> &bull; VOL. I &bull; BY PASTOR ERYEZA KALALU
      </div>

      {/* Navigation */}
      <header className={`sticky top-0 z-50 relative transition-shadow duration-300 ${hasScrolled ? "bg-[#F7F4EF]/98 shadow-[0_12px_30px_rgba(30,41,59,0.08)]" : "bg-[#F7F4EF]/95"} backdrop-blur-md border-b border-[#E6E0D4]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="seal-hover w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center text-[#C5A059] font-serif font-bold text-2xl shadow-md border-2 border-[#C5A059]/40">
              EK
            </div>
            <div>
              <span className="font-serif font-bold text-2xl tracking-tight text-[#1E293B] block leading-none">Eryeza Kalalu</span>
              <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block mt-1">Author &amp; Pastor</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-10 text-sm font-semibold text-[#334155] tracking-wide">
            <a href="#overview" className="nav-link">Overview</a>
            <a href="#about-book" className="nav-link">The 30-Day Journey</a>
            <a href="#reviews" className="nav-link">Reader Responses</a>
            <a href="#author" className="nav-link">Why I Wrote This</a>
            <a href="#formats" className="nav-link">Editions</a>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" className="md:hidden inline-flex h-11 w-11 items-center justify-center border border-[#C5A059]/40 text-[#1E293B] transition-colors hover:bg-[#EFECE6]" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a href="#formats">
              <Button data-slot="button" className="bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold px-5 sm:px-6 py-5 shadow-sm transition-all tracking-wide text-sm">
                <span className="hidden sm:inline">Pre-Order</span><span className="sm:hidden">Order</span>
              </Button>
            </a>
          </div>
          {mobileMenuOpen && <nav className="absolute left-0 right-0 top-full border-b border-[#E6E0D4] bg-[#F7F4EF] p-4 shadow-xl md:hidden"><div className="flex flex-col gap-1 text-sm font-semibold text-[#334155]"><a href="#overview" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Overview</a><a href="#about-book" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>The 30-Day Journey</a><a href="#reviews" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Reader Responses</a><a href="#author" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Why I Wrote This</a><a href="#formats" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Editions</a></div></nav>}
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" data-reveal="hero" className="relative pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden border-b border-[#E6E0D4]">
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
              
              <p className="text-sm uppercase tracking-[0.18em] text-[#C5A059] font-bold">A devotional about the formation of the person behind the influence.</p>
              <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl font-sans">
                Friend, if you have ever wanted your daily work to carry eternal weight, not empty titles, not applause you can screenshot, this book was written for you.
              </p>
              <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl font-sans">
                You are asking God for a bigger platform. A wider reach. A seat at a table you have not sat at yet. Here is a harder question, and it will not let you go once you ask it honestly.
              </p>
              <p className="font-serif italic text-xl sm:text-2xl leading-relaxed text-[#1E293B] border-l-2 border-[#C5A059] pl-5 max-w-2xl">Who are you becoming while you become visible?</p>
              <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl font-sans">
                The Influential Spirit is a 30-day devotional for the part of you nobody applauds, the part Christ is shaping while you wait for the door to open. Character. Dependence on the Spirit. The kind of competence that holds up when no one is watching. Let us walk through it together, thirty days at a time.
              </p>
              <p className="font-serif text-lg font-bold text-[#1E293B]">Formation Before Platform.</p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 pt-2">
                <a href="#formats">
                  <Button size="lg" className="bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold px-9 py-7 text-base shadow-xl border border-[#C5A059]/30">
                    Pre-Order Your Edition
                    <ChevronRight className="ml-2 w-5 h-5 text-[#C5A059]" />
                  </Button>
                </a>
                  <a href="#preview">
                  <Button size="lg" variant="outline" className="border-[#1E293B]/20 hover:bg-[#EFECE6] text-[#1E293B] font-semibold px-8 py-7 text-base">
                    See What You’ll Practice
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-8 border-t border-[#E6E0D4] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-[#4B5563]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">✓</div>
                  <span>Grounded in Scripture</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">✓</div>
                  <span>PDF &amp; EPUB on 15 September</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">✓</div>
                  <span>Payhip &amp; Selar Pre-order Routes</span>
                </div>
              </div>
            </div>

            {/* Right Cover Mockup */}
            <div className="lg:col-span-5 flex justify-center items-center py-6">
              <div className="relative group perspective-1000">
                <div className="absolute -inset-6 bg-gradient-to-tr from-[#C5A059]/35 via-[#1E293B]/10 to-transparent rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition duration-700"></div>
                
                <div className="book-object relative bg-[#F3EEE3] p-5 sm:p-7 rounded-2xl shadow-2xl border border-[#C5A059]/40 max-w-sm transform group-hover:-translate-y-1 transition duration-500">
                  <div className="absolute top-4 right-5 text-[#C5A059] font-serif text-[11px] tracking-[0.2em] uppercase font-semibold">VOL. 01</div>
                  
                  <div className="relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] rounded-md overflow-hidden border border-[#D4C4A8]">
                    <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 to-transparent pointer-events-none z-10"></div>
                    <img 
                      src="/assets/images/cover.jpg" 
                      alt="The Influential Spirit Book Cover by Eryeza Kalalu" 
                      width={1400}
                      height={2100}
                      loading="eager"
                      decoding="async"
                      className="w-full h-auto object-cover transform scale-100 group-hover:scale-[1.02] transition duration-500"
                    />
                  </div>

                  <div className="mt-5 text-center space-y-1.5 border-t border-[#E6E0D4]/80 pt-4">
                    <span className="text-xs text-[#1E293B] font-serif font-bold tracking-[0.2em] block uppercase">Digital Pre-order Edition</span>
                    <span className="text-[11px] text-[#6B7280] font-sans font-medium">PDF &amp; EPUB delivered 15 September &bull; Audiobook in Formation bundles</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Preview placement: reserve this editorial module for the approved sample PDF or HTML excerpt. */}
      <section id="preview" data-reveal="preview" className="py-20 bg-[#F7F4EF] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">A First Look Inside</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">See what you’ll practice.</h2>
              <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed">The preview will give you a few pages of the journey before you decide to pre-order. It will sit here as a quiet reading experience, not a sales interruption.</p>
              <p className="font-serif italic text-xl leading-relaxed text-[#1E293B] border-l-2 border-[#C5A059] pl-5">“Who are you becoming while you become visible?”</p>
            </div>
            <div className="rule-glow lg:col-span-7 bg-[#EFECE6] border border-[#C5A059]/40 p-7 sm:p-10 relative">
              <div className="absolute top-0 left-0 w-20 h-1 bg-[#C5A059]"></div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">Preview module</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#6B7280] font-semibold">5–7 pages recommended</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1E293B] mb-3">A sample reading from the 30-day devotional</h3>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl">Recommended format: a mobile-friendly HTML reading view with an optional lightweight PDF download. HTML keeps the first encounter readable on a phone; the PDF gives readers a simple file to save and print.</p>
              <div className="mt-7 pt-5 border-t border-[#C5A059]/30 text-xs uppercase tracking-[0.18em] text-[#6B7280] font-semibold">Preview file will be added before the pre-order campaign opens</div>
            </div>
          </div>
        </div>
      </section>

      {/* Canonical positioning sections: influence is formed before it is seen. */}
      <section data-reveal="positioning" className="py-20 bg-[#F7F4EF] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-5">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">Influence Begins Deeper Than Visibility</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">Who you are matters before anyone sees what you can do.</h2>
            <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed">We live in a world that mistakes visibility for influence. Titles. Followers. Recognition. A promotion. Applause you can screenshot.</p>
            <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed">A platform can put someone in front of a crowd without doing a single thing to their character. God is not just handing out platforms. He is shaping the people who will stand on them, because unformed hands break what they hold.</p>
            <p className="font-serif italic text-xl leading-relaxed text-[#1E293B] border-l-2 border-[#C5A059] pl-5">That is the tension this book lives inside: not whether you should be visible, but who you are before, and while, you become that way.</p>
          </div>
          <div className="rule-glow space-y-5 border-t-2 border-[#C5A059] pt-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">The Person Behind the Influence</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">Christ forms the person.</h2>
            <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed">The Spirit does the empowering. Everything you actually want, credibility, weight, a voice people trust, grows out of that, never the other way around.</p>
            <p className="font-serif text-xl leading-relaxed text-[#1E293B]">These pages will not teach you how to get noticed. They walk with you toward becoming someone worth following.</p>
          </div>
        </div>
      </section>

      {/* Library Divider */}
      <div className="py-5 bg-[#EFECE6] border-b border-[#E6E0D4] text-center text-[#C5A059]">
        <div className="flex items-center justify-center gap-4 text-[10px] font-sans tracking-[0.28em] uppercase">
          <span className="h-px w-16 bg-[#C5A059]/60"></span>
          <span className="seal-hover inline-flex h-7 w-7 items-center justify-center border border-[#C5A059] font-serif font-bold tracking-normal text-[#1E293B]">EK</span>
          <span className="text-[#1E293B]">The Deep Encounter Framework &bull; Volume I</span>
          <span className="h-px w-16 bg-[#C5A059]/60"></span>
        </div>
      </div>

      {/* The 3 Pillars Section */}
      <section id="about-book" data-reveal="pillars" className="py-24 bg-[#EFECE6] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">Your 30-Day Transformation Path</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">
              Three Pillars of Kingdom Influence
            </h2>
            <p className="text-[#4B5563] text-lg leading-relaxed font-serif italic">
              "Christlike influence is forged when divine authority meets steady character in the ordinary spaces of your workday."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="lift-card bg-[#FAF8F5]/60 border-y border-[#C5A059]/40 p-8 sm:p-10 rounded-none shadow-none hover:bg-[#F7F4EF] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-[#C5A059]/10"></div>
              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#C5A059] shadow-md border border-[#C5A059]/40 font-serif font-bold text-xl">
                  I
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E293B]">Kingdom Authority</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed font-sans">
                  Step out of spiritual passivity. Learn to anchor your daily decisions in heavenly governance, bringing the claims of Christ to workplace pressures, professional choices, and daily friction.
                </p>
                <div className="pt-4 border-t border-[#E6E0D4] text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                  &bull; Days 1 to 10 &bull;
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="lift-card bg-[#FAF8F5]/60 border-y border-[#C5A059]/40 p-8 sm:p-10 rounded-none shadow-none hover:bg-[#F7F4EF] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-[#C5A059]/10"></div>
              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#C5A059] shadow-md border border-[#C5A059]/40 font-serif font-bold text-xl">
                  II
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E293B]">Formed Character</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed font-sans">
                  Private integrity that sustains public weight. Discover why testing in the secret place precedes elevation, ensuring your character outlasts your gifting and holds firm under pressure.
                </p>
                <div className="pt-4 border-t border-[#E6E0D4] text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                  &bull; Days 11 to 20 &bull;
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="lift-card bg-[#FAF8F5]/60 border-y border-[#C5A059]/40 p-8 sm:p-10 rounded-none shadow-none hover:bg-[#F7F4EF] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-[#C5A059]/10"></div>
              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#C5A059] shadow-md border border-[#C5A059]/40 font-serif font-bold text-xl">
                  III
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E293B]">Marketplace Impact</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed font-sans">
                  Bridge the sacred-secular divide. Treat your office, business, or board meetings as a place of faithful obedience, ethical leadership, and quiet, steady witness.
                </p>
                <div className="pt-4 border-t border-[#E6E0D4] text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                  &bull; Days 21 to 30 &bull;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formation pathway: the supplied copy’s 30-day journey and audience fit. */}
      <section data-reveal="formation" className="py-24 bg-[#F7F4EF] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">A 30-Day Journey of Formation</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">The work begins before the platform.</h2>
              <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed">The journey starts with Jesus, not a platform. Through prayer, obedience, service, dependence, and pressure, Christ forms the person who can carry influence without being carried away by it.</p>
              <p className="font-serif italic text-xl leading-relaxed text-[#1E293B] border-l-2 border-[#C5A059] pl-5">Your workplace, your home, your church, and your street are already places where your life is speaking.</p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
              <div className="border-t border-[#C5A059] pt-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">The Invitation · Days 1–5</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Come close before you lead.</p><p className="text-sm text-[#6B7280] leading-relaxed mt-2">The journey begins with Jesus, not a platform.</p></div>
              <div className="border-t border-[#C5A059] pt-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">The Transformation · Days 6–15</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Let Christ reshape you.</p><p className="text-sm text-[#6B7280] leading-relaxed mt-2">Character, prayer, obedience, service, and dependence become the work.</p></div>
              <div className="border-t border-[#C5A059] pt-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">The Crucible · Days 16–20</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Pressure reveals what visibility hides.</p><p className="text-sm text-[#6B7280] leading-relaxed mt-2">Offense, praise, delay, and difficulty expose what has been formed.</p></div>
              <div className="border-t border-[#C5A059] pt-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">The Multiplication · Days 21–30</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Turn what you've been given outward.</p><p className="text-sm text-[#6B7280] leading-relaxed mt-2">Influence becomes stewardship.</p></div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-[#E6E0D4] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4"><span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">This Book Is for You If…</span><h3 className="font-serif text-3xl font-bold text-[#1E293B] mt-3">You are already influencing someone.</h3></div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#4B5563] leading-relaxed"><p>• You sense God has called you toward influence and want to be ready for what it asks of you.</p><p>• You are trying to live faithfully at your desk, not only on Sunday.</p><p>• You are building a business, ministry, or family, and it is already shaping other people.</p><p>• You disciple people who will go on to lead.</p><p>• You are young, ambitious, and wondering how faith should shape that ambition.</p><p>• You are already visible and beginning to feel what visibility costs.</p><p>• You want your ordinary life to carry the weight of Christ’s name well.</p><p>• You do not need a title to begin. Your workplace, your home, your church, and your street are already places where your life is speaking.</p></div>
          </div>
          <div className="mt-20 pt-10 border-t border-[#E6E0D4] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">From Sunday to Monday</span>
              <h3 className="font-serif text-3xl font-bold text-[#1E293B]">Your faith does not get smaller when you leave the building.</h3>
              <p className="text-[#6B7280] text-base leading-relaxed">The desk. The classroom. The clinic. The boardroom. The market stall. The ministry office. The kitchen table.</p>
              <p className="text-[#6B7280] text-base leading-relaxed">These are the places where your character actually shows. Your work can be worship. Your competence can be a form of love for the people you serve. Your character, more than your sermon, is what your coworkers will actually remember.</p>
            </div>
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">What You Will Explore</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-[#4B5563] leading-relaxed"><p><strong className="text-[#1E293B]">Character</strong> · who you are when no one's watching.</p><p><strong className="text-[#1E293B]">Prayer</strong> · whether your public life stays tethered to a private one.</p><p><strong className="text-[#1E293B]">The Holy Spirit</strong> · what dependence on God looks like outside the dramatic moments.</p><p><strong className="text-[#1E293B]">Competence</strong> · how excellence and reliance on God work together, not against each other.</p><p><strong className="text-[#1E293B]">Leadership</strong> · whether you can lead before anyone hands you a title.</p><p><strong className="text-[#1E293B]">Pressure</strong> · what difficulty reveals about who you've actually become.</p><p><strong className="text-[#1E293B]">Service</strong> · what happens when influence turns into lifting someone else.</p><p><strong className="text-[#1E293B]">Legacy</strong> · what's left standing after the applause stops.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Influence Circle Capture */}
      <section id="influence-circle" data-reveal="circle" className="py-24 bg-[#1E293B] text-[#F8FAFC] border-b border-[#C5A059]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">The Launch Community</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">Join the Influence Circle</h2>
              <p className="text-[#CBD5E1] text-lg leading-relaxed max-w-2xl font-sans">
                Get a preview of <span className="font-serif italic text-white">The Influential Spirit</span>, launch updates, access to the 30-day journey resources, and first notice of new releases from The Deep Encounter Library.
              </p>
              <div className="rule-glow flex items-center gap-3 pt-4 border-t border-[#C5A059]/30">
                <span className="seal-hover inline-flex h-9 w-9 items-center justify-center border border-[#C5A059] text-[#C5A059] font-serif font-bold text-sm">EK</span>
                <span className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">Formation Before Platform</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="border-l-2 border-[#C5A059] pl-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">01</span><strong className="block text-white font-serif">Preview</strong><span className="text-xs text-[#94A3B8]">A first look inside the book.</span></div>
                <div className="border-l-2 border-[#C5A059] pl-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">02</span><strong className="block text-white font-serif">Journey</strong><span className="text-xs text-[#94A3B8]">Resources for the 30 days.</span></div>
                <div className="border-l-2 border-[#C5A059] pl-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">03</span><strong className="block text-white font-serif">Library</strong><span className="text-xs text-[#94A3B8]">News of what comes next.</span></div>
              </div>
            </div>
            <div className="lift-card lg:col-span-5 bg-[#F7F4EF] text-[#1E293B] p-6 sm:p-8 rounded-md border border-[#C5A059]/50 shadow-2xl">
              <div className="border-b border-[#C5A059]/40 pb-4 mb-5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">Library Dispatch</span>
                <h3 className="font-serif text-2xl font-bold text-[#1E293B] mt-1">A word before launch day.</h3>
              </div>
              <div ref={kitFormRef} className="min-h-[112px]" aria-label="Influence Circle signup form"></div>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed mt-4 border-t border-[#C5A059]/30 pt-4">By joining, you are signing up for Influence Circle launch and library communications. THE CCN DAILY weekly newsletter remains on Substack.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reader Responses & Verified Amazon Reviews Section */}
      <section id="reviews" data-reveal="reviews" className="py-24 bg-[#F7F4EF] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold block">Reader Responses</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">
              Words from Readers &amp; Friends
            </h2>
            <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed font-sans">
              Reflections on Pastor Eryeza Kalalu's writing and verified Amazon purchase reviews for the first edition.
            </p>

            <div className="pt-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold px-8 py-6 text-sm shadow-md border border-[#C5A059]/30">
                    <MessageSquarePlus className="mr-2 w-4 h-4 text-[#C5A059]" />
                    Share Your Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#FAF8F5] border border-[#C5A059]/40 text-[#1E293B] max-w-lg p-6 sm:p-8">
                  <DialogHeader className="space-y-2">
                    <DialogTitle className="font-serif text-2xl font-bold text-[#1E293B]">Submit Your Reader Review</DialogTitle>
                    <DialogDescription className="text-sm text-[#6B7280] font-sans">
                      Have you journeyed through <span className="italic font-serif">The Influential Spirit</span> or followed Pastor Eryeza's daily writing? Share your reflection below. Submitted reviews are verified by our editorial team before publication.
                    </DialogDescription>
                  </DialogHeader>

                  {reviewSubmitted ? (
                    <div className="bg-[#EFECE6] border border-[#C5A059] p-6 rounded-md text-center space-y-3 mt-4">
                      <CheckCircle2 className="w-10 h-10 text-[#C5A059] mx-auto" />
                      <h4 className="font-serif font-bold text-lg text-[#1E293B]">Thank You for Your Feedback</h4>
                      <p className="text-sm text-[#4B5563]">
                        Your review has been successfully submitted and queued for editorial inclusion.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4 mt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">Your Name *</label>
                        <Input 
                          placeholder="e.g., Sarah Jenkins" 
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="bg-white border-[#E6E0D4] text-[#1E293B]"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">Role / Location (Optional)</label>
                        <Input 
                          placeholder="e.g., Accountant, Kampala" 
                          value={reviewRole}
                          onChange={(e) => setReviewRole(e.target.value)}
                          className="bg-white border-[#E6E0D4] text-[#1E293B]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">Your Review / Reflection *</label>
                        <Textarea 
                          placeholder="Share how the 30-day journey impacted your spiritual formation and daily work..." 
                          rows={4}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="bg-white border-[#E6E0D4] text-[#1E293B]"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold py-6 text-base mt-2">
                        Submit Review for Moderation
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Author-Focused Endorsements */}
          <div className="mb-14">
            <h3 className="font-serif text-2xl font-bold text-[#1E293B] mb-6 text-center">Perspectives on the Author's Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-[#FAF8F5]/70 border-t border-[#C5A059]/70 p-8 rounded-none shadow-none relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-[#C5A059] font-serif text-5xl opacity-30 leading-none">“</div>
                  <blockquote className="font-serif text-lg text-[#1E293B] italic leading-relaxed">
                    "The principles Pastor Eryeza writes daily can influence a chef on the kitchen table to the judge on the verdict table."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">Martin Nangoli</span>
                  <span className="bg-[#EFECE6] px-3 py-1 rounded text-[#1E293B] font-semibold">Specialty Coffee Producer</span>
                </div>
              </div>

              <div className="bg-[#FAF8F5]/70 border-t border-[#C5A059]/70 p-8 rounded-none shadow-none relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-[#C5A059] font-serif text-5xl opacity-30 leading-none">“</div>
                  <blockquote className="font-serif text-lg text-[#1E293B] italic leading-relaxed">
                    "In every generation, I believe God chooses to reveal Himself. Pastor Eryeza is one of those that God has set apart to shine a light on His people in these dark, turbulent times. He exudes a lot of charisma, with excellent oratory and writing skills."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">Babirye Agatha</span>
                  <span className="bg-[#EFECE6] px-3 py-1 rounded text-[#1E293B] font-semibold">Ugandan Reader</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amazon Verified Purchase Reviews */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1E293B] mb-3 text-center">What Readers Said About the First Edition</h3>
            <p className="text-center text-sm text-[#6B7280] max-w-2xl mx-auto mb-6">Becoming an Influence, the book this devotional grew from and expanded, earned these responses:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Review 1: The Rebecca Review (US) */}
              <div className="bg-[#FAF8F5]/70 border-t border-[#C5A059]/70 p-8 rounded-none shadow-none relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-base text-[#1E293B] italic leading-relaxed">
                    "Each devotional in this book is thoughtful and has a conclusion and a short prayer which is meaningful. I felt that the message of this book was encouraging and timely for our day and age."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">The Rebecca Review</span>
                  <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">United States &bull; Amazon Verified Purchase</span>
                </div>
              </div>

              {/* Review 2: Jeff Mutenga (UK) */}
              <div className="bg-[#FAF8F5]/70 border-t border-[#C5A059]/70 p-8 rounded-none shadow-none relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-base text-[#1E293B] italic leading-relaxed">
                    "This book is simple and practical and yet very instructive and inspiring."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">Jeff Mutenga</span>
                  <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">United Kingdom &bull; Amazon Verified Purchase</span>
                </div>
              </div>

              {/* Review 3: Chris Gould (UK) */}
              <div className="bg-[#FAF8F5]/70 border-t border-[#C5A059]/70 p-8 rounded-none shadow-none relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-base text-[#1E293B] italic leading-relaxed">
                    "Practical and full of wisdom gained from experience. This is not a dry theological treatise but is a clear explanation of the steps needed to follow Christ and be a good influence in this world."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">Chris Gould</span>
                  <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">United Kingdom &bull; Amazon Verified Purchase</span>
                </div>
              </div>

              {/* Review 4: SP80 (UK) */}
              <div className="bg-[#FAF8F5]/70 border-t border-[#C5A059]/70 p-8 rounded-none shadow-none relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-base text-[#1E293B] italic leading-relaxed">
                    "This book is well written and biblically sound. If you follow the principles of this book, it will put you on the right path."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">SPBO</span>
                  <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">United Kingdom &bull; Amazon Verified Purchase</span>
                </div>
              </div>

              {/* Review 5: Andrew T (UK) */}
              <div className="bg-[#FAF8F5]/70 border-t border-[#C5A059]/70 p-8 rounded-none shadow-none relative flex flex-col justify-between md:col-span-2 max-w-xl mx-auto w-full">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-base text-[#1E293B] italic leading-relaxed">
                    "A must read. This is an amazing book. Your life will be transformed."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">Andrew T</span>
                  <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">United Kingdom &bull; Amazon Verified Purchase</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Author Section */}
      <section id="author" data-reveal="author" className="py-24 bg-[#F7F4EF] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-extrabold">
                <span>Author Perspective</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">
                Pastor Eryeza Kalalu
              </h2>
              <p className="font-serif text-lg text-[#4B5563] italic">
                Pastor at Rivers of Life Healing Centre, Kawuku · Author
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed font-sans">
                Operating from Kawuku-Entebbe, Uganda, his burden is simple: help believers stop managing their faith at the surface and start carrying the real weight of scriptural discipleship into every room they enter.
              </p>
            </div>

            <div className="lg:col-span-7 bg-[#FAF8F5] p-8 sm:p-12 rounded-none border-l-2 border-t border-[#C5A059] shadow-none relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#C5A059]/40 shadow-lg shrink-0 bg-[#EFECE6]">
                  <img 
                    src="/assets/images/author.jpg" 
                    alt="Pastor Eryeza Kalalu" 
                    width={667}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="space-y-4 text-center sm:text-left">
                  <span className="text-xs uppercase tracking-widest text-[#1E293B] font-bold block">Why I Wrote This Book</span>
                  <blockquote className="font-serif text-lg sm:text-xl text-[#1E293B] italic leading-relaxed">
                    "We are not called to whisper our faith in the corner while the world dictates the culture. When your inner life is anchored in Christ, your quiet competence carries more authority than any title ever could."
                  </blockquote>
                  <div className="pt-4 border-t border-[#E6E0D4] flex flex-wrap items-center justify-center sm:justify-between text-xs text-[#6B7280] gap-4">
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
        </div>
      </section>

      {/* Canonical product experience section: the journey continues beyond the final devotional page. */}
      <section data-reveal="experience" className="py-20 bg-[#F7F4EF] border-b border-[#E6E0D4]"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="max-w-3xl space-y-5 mb-10"><span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">The 30-Day Experience Doesn't End With the Last Page</span><h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">Day 30 is not the finish line. It's a hand-off.</h2></div><div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm text-[#4B5563]"><div><strong className="block font-serif text-lg text-[#1E293B]">Read</strong><span>the complete 30-day devotional.</span></div><div><strong className="block font-serif text-lg text-[#1E293B]">Listen</strong><span>narrated in the author's own voice.</span></div><div><strong className="block font-serif text-lg text-[#1E293B]">Reflect</strong><span>the companion Journal.</span></div><div><strong className="block font-serif text-lg text-[#1E293B]">Gather</strong><span>the six-session Group Study Guide.</span></div><div><strong className="block font-serif text-lg text-[#1E293B]">Practice</strong><span>the Reading Plan and Challenge.</span></div><div><strong className="block font-serif text-lg text-[#1E293B]">Continue</strong><span>a 30-day WhatsApp journey.</span></div><div><strong className="block font-serif text-lg text-[#1E293B]">Go Deeper</strong><span>the devotional app.</span></div></div></div></section>

      {/* Editions & Regional Routes */}
      <section id="formats" data-reveal="formats" className="py-24 bg-[#1E293B] text-[#F8FAFC] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">Pre-order now &bull; Digital delivery 15 September 2026</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">Choose How You Want to Enter the Journey</h2>
            <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed font-sans">Choose the package that fits your season. Pre-order through the route that serves you best; the digital files will be delivered on 15 September 2026.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-10" role="tablist" aria-label="Choose your buying route">
            <button type="button" role="tab" aria-selected={marketRoute === "international"} onClick={() => setMarketRoute("international")} className={`flex-1 border px-5 py-4 text-left transition-colors ${marketRoute === "international" ? "border-[#C5A059] bg-[#0F172A]" : "border-[#C5A059]/30 bg-[#0F172A]/40 hover:border-[#C5A059]/70"}`}><span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Route I</span><span className="font-serif text-xl text-white font-bold">International</span><span className="block text-xs text-[#94A3B8] mt-1">Payhip · USD pricing</span></button>
            <button type="button" role="tab" aria-selected={marketRoute === "africa"} onClick={() => setMarketRoute("africa")} className={`flex-1 border px-5 py-4 text-left transition-colors ${marketRoute === "africa" ? "border-[#C5A059] bg-[#0F172A]" : "border-[#C5A059]/30 bg-[#0F172A]/40 hover:border-[#C5A059]/70"}`}><span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Route II</span><span className="font-serif text-xl text-white font-bold">Uganda &amp; Africa</span><span className="block text-xs text-[#94A3B8] mt-1">Selar · local currency pricing</span></button>
          </div>

          {marketRoute === "africa" && <div className="max-w-6xl mx-auto mb-8 border-y border-[#C5A059]/30 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Selar currency view</span><span className="text-sm text-[#CBD5E1]">UGX is the anchor price. Other amounts are rounded planning estimates until fixed in Selar.</span></div><label className="text-sm text-white flex items-center gap-3">Show currency<select value={africaCurrency} onChange={(event) => setAfricaCurrency(event.target.value as (typeof selarAfricanCurrencies)[number])} className="bg-[#0F172A] border border-[#C5A059]/60 text-white px-3 py-2 text-sm"><option value="UGX">UGX · Uganda shilling</option>{selarAfricanCurrencies.filter((currency) => currency !== "UGX").map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select></label></div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-10">
            {bundleOptions.map((bundle) => <div key={bundle.name} className={`lift-card border ${bundle.popular ? "border-2 border-[#C5A059]" : "border-[#C5A059]/40"} bg-[#0F172A] p-6 relative`}><span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">{bundle.name}</span>{bundle.popular && <span className="absolute -top-3 left-5 bg-[#C5A059] text-white text-[10px] uppercase tracking-[0.18em] px-3 py-1 font-bold">Most popular</span>}<h3 className="font-serif text-2xl text-white font-bold mt-2">{marketRoute === "international" ? `US$${bundle.usd}` : africaCurrency === "UGX" ? `UGX ${bundle.ugx.toLocaleString("en-UG")}` : formatCurrencyEstimate(africaCurrency, bundle.ugx * activeAfricanRate)}</h3><p className="text-sm text-[#CBD5E1] leading-relaxed mt-3">{bundle.description}</p></div>)}
          </div>

          <div className="max-w-5xl mx-auto border-t border-[#C5A059]/30 pt-10"><div className="bg-[#0F172A] rounded-none p-8 sm:p-10 border-l-2 border-t-2 border-[#C5A059] shadow-2xl flex flex-col lg:flex-row lg:items-end justify-between gap-8"><div className="space-y-5 max-w-2xl">{marketRoute === "africa" ? <><div className="flex items-center gap-4"><Badge className="bg-[#C5A059] text-white font-semibold px-3 py-1">Uganda &amp; Africa · Selar</Badge><span className="font-serif text-3xl font-bold text-white">{africaCurrency === "UGX" ? "UGX 45,000" : formatCurrencyEstimate(africaCurrency, 45000 * activeAfricanRate)}</span></div><div><h3 className="font-serif text-2xl font-bold text-white mb-2">Pre-order through Selar</h3><p className="text-sm text-[#94A3B8] leading-relaxed">Choose the currency that matches your Selar checkout. The selector gives you a rounded estimate from the UGX anchor price; Selar remains the final source of truth for the fixed amount.</p></div><p className="text-sm text-[#CBD5E1] border-t border-slate-800 pt-4">Want to help others discover the book? Become an affiliate through the Selar pathway.</p></> : <><div className="flex items-center gap-4"><Badge className="bg-[#C5A059] text-white font-semibold px-3 py-1">International · Payhip</Badge><span className="font-serif text-3xl font-bold text-white">US$15</span></div><div><h3 className="font-serif text-2xl font-bold text-white mb-2">Pre-order through Payhip</h3><p className="text-sm text-[#94A3B8] leading-relaxed">Use the international route for USD pricing and secure digital delivery. Payhip’s pre-order setup will deliver the final PDF and EPUB on 15 September 2026.</p></div><ul className="space-y-3 text-sm text-[#CBD5E1] border-t border-slate-800 pt-4"><li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> PDF and EPUB digital edition</li><li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Automatic download delivery</li><li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Author-narrated audiobook in Formation and Complete bundles; print forthcoming</li></ul></>}</div><div className="lg:w-72 shrink-0 space-y-3">{marketRoute === "africa" ? <><a href="#influence-circle" className="block"><Button className="w-full bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold py-7 text-base">Join for the Selar link <ChevronRight className="ml-2 w-5 h-5 inline" /></Button></a><p className="text-[11px] text-[#64748B] text-center">Final Selar product URL pending listing</p></> : <><a href="https://payhip.com/ccndaily" target="_blank" rel="noopener noreferrer" className="block"><Button className="w-full bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold py-7 text-base">Open Payhip pre-order <ChevronRight className="ml-2 w-5 h-5 inline" /></Button></a><p className="text-[11px] text-[#64748B] text-center">USD route · final product URL should replace the store homepage</p></>}</div></div></div>
        </div>
      </section>

      {/* Canonical library roadmap, FAQ, and closing invitation. */}
      <section data-reveal="library" className="py-24 bg-[#EFECE6] border-t border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5 mb-14"><span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">The Deep Encounter Library</span><h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">One library. Different doors into the same encounter with God.</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20"><div className="lift-card border-t-2 border-[#C5A059] bg-[#F7F4EF] p-6"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Now</span><h3 className="font-serif text-2xl font-bold text-[#1E293B] mt-2">The Influential Spirit</h3><p className="text-sm text-[#6B7280] mt-2">Formation before platform.</p></div><div className="lift-card border-t-2 border-[#1E293B] bg-[#F7F4EF] p-6"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Coming next</span><h3 className="font-serif text-2xl font-bold text-[#1E293B] mt-2">Unedited Christmas</h3><p className="text-sm text-[#6B7280] mt-2">A fresh encounter with the mystery of the incarnation.</p></div><div className="lift-card border-t-2 border-[#1E293B] bg-[#F7F4EF] p-6"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Coming 2027</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Holy Week Every Week · Prayer Craft · Discerning God's Whisper · The Spiritual Health Solution</p></div></div>
          <div className="max-w-4xl"><span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">Frequently Asked Questions</span><h2 className="font-serif text-4xl font-bold text-[#1E293B] mt-3 mb-8">Questions readers are already asking.</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-[#4B5563]"><div><h3 className="font-serif text-xl font-bold text-[#1E293B]">Is this a leadership book?</h3><p className="mt-2">It's more than that. The Influential Spirit is a devotional about spiritual formation. Leadership, work, and influence are where that formation gets tested.</p></div><div><h3 className="font-serif text-xl font-bold text-[#1E293B]">Is the book against platforms?</h3><p className="mt-2">No. Ambition, visibility, leadership, none of that is the target here. The question underneath the whole book is simpler and harder: who are you becoming while you become visible?</p></div><div><h3 className="font-serif text-xl font-bold text-[#1E293B]">Do I need to be a leader to read it?</h3><p className="mt-2">No. Influence here has nothing to do with a title. It's about ordinary responsibility, character, and the people who are already watching your life.</p></div><div><h3 className="font-serif text-xl font-bold text-[#1E293B]">Is it only for pastors?</h3><p className="mt-2">No. It's written for professionals, entrepreneurs, ministry leaders, young adults, and anyone trying to live out their faith where they actually spend their week.</p></div><div><h3 className="font-serif text-xl font-bold text-[#1E293B]">Can I use it with a group?</h3><p className="mt-2">Yes. The Formation Bundle and Complete Formation Edition both include the six-session Group Study Guide.</p></div><div><h3 className="font-serif text-xl font-bold text-[#1E293B]">Can I listen instead of read?</h3><p className="mt-2">Yes. The Formation Bundle includes the author-narrated audiobook.</p></div><div><h3 className="font-serif text-xl font-bold text-[#1E293B]">Is there a journal?</h3><p className="mt-2">Yes, in the Complete Formation Edition.</p></div></div></div>
        </div>
      </section>

      <section data-reveal="final" className="py-24 bg-[#1E293B] text-white text-center border-t border-[#C5A059]/30"><div className="max-w-3xl mx-auto px-4 sm:px-6"><h2 className="font-serif text-4xl sm:text-5xl font-bold">Your influence does not start when you get the platform.</h2><p className="text-[#CBD5E1] text-lg leading-relaxed mt-5">It starts with who you're becoming right now, before anyone's watching.</p><div className="flex flex-col sm:flex-row justify-center gap-4 mt-8"><a href="#formats"><Button className="bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold px-8 py-6">Begin the 30-Day Journey <ChevronRight className="ml-2 w-5 h-5 inline" /></Button></a><a href="#influence-circle"><Button variant="outline" className="border-[#C5A059]/60 text-white hover:bg-white/10 font-semibold px-8 py-6">Join the Influence Circle</Button></a></div><p className="text-xs uppercase tracking-[0.22em] text-[#C5A059] mt-8">Grounded in Scripture · Forged for Impact</p></div></section>

      {/* Footer */}
      <footer className="bg-[#111827] text-[#94A3B8] py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="seal-hover w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#C5A059] font-serif font-bold text-lg border border-[#C5A059]/40">
              EK
            </div>
            <div>
              <span className="text-sm font-semibold text-white tracking-wide block">ERYEZA KALALU</span>
              <span className="text-[10px] text-[#64748B] block">books.theccndaily.com</span>
            </div>
          </div>
          <p className="text-xs text-[#64748B] text-center md:text-left font-serif italic">
            &copy; 2026 Eryeza Kalalu &bull; All Rights Reserved.
          </p>
          <div className="text-xs text-[#C5A059] font-medium tracking-wide">
            Grounded in Scripture &bull; Forged for Impact
          </div>
        </div>
      </footer>
    </div>
  );
}
