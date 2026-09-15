import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Award, Shield, Compass, ChevronRight, Feather, Star, Menu, X, BookOpen, MessageCircle, UsersRound, Footprints, HeartHandshake, Crown, Flame, Gauge, HandHeart, BriefcaseBusiness, House, GraduationCap, Eye } from "lucide-react";

// Neo-Monastic commerce reminder: keep the International Payhip experience calm, direct, and visible by default; reveal Selar only through an explicit regional choice.
const bundleOptions = [
  { name: "Reader Edition", usd: 15, ugx: 45000, description: "Designed digital reading edition with reflowable EPUB and PDF delivery.", popular: false },
  { name: "Formation Bundle", usd: 29, ugx: 90000, description: "Digital edition, author-narrated audiobook, six-session Group Study Guide, and 30-Day Reading Plan & Challenge.", popular: true },
  { name: "Complete Formation", usd: 49, ugx: 150000, description: "Everything in Formation, plus the Companion Journal, bonus audio declarations and prayers, and the digital resource library.", popular: false },
] as const;

function PayhipEmbed() {
  // Neo-Monastic commerce reminder: let the reader compare the full formation path clearly, then make the Payhip hand-off calm and explicit.
  const [selectedName, setSelectedName] = useState<(typeof bundleOptions)[number]["name"]>("Formation Bundle");
  const selectedBundle = bundleOptions.find((bundle) => bundle.name === selectedName) ?? bundleOptions[1];

  return (
    <div className="payhip-embed-shell mx-auto max-w-5xl bg-[#F7F4EF] border border-[#C5A059]/40 p-5 sm:p-8 lg:p-10 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
      <div className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#C5A059] font-extrabold"><span className="inline-block h-2 w-2 rounded-full bg-[#C5A059]" /> Payhip preorder</span>
          <h4 className="font-serif text-3xl sm:text-4xl text-[#1E293B] font-bold leading-tight">Choose the edition that fits your season.</h4>
          <p className="text-[#6B7280] text-base leading-relaxed">Compare the three editions here, then continue to Payhip to confirm your choice and complete your preorder.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="group" aria-label="Payhip edition prices">
          {bundleOptions.map((bundle) => {
            const isSelected = bundle.name === selectedName;
            return (
              <button
                key={bundle.name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedName(bundle.name)}
                className={`text-left p-5 border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] ${isSelected ? "border-2 border-[#C5A059] bg-[#FFFDF9] shadow-[0_12px_28px_rgba(30,41,59,0.12)]" : "border-[#D8CCB9] bg-[#EFECE6]/60 hover:border-[#C5A059]/70 hover:bg-[#FFFDF9]"}`}
              >
                <span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">{isSelected ? "Selected edition" : "Digital edition"}</span>
                <strong className="block font-serif text-xl text-[#1E293B] mt-3">{bundle.name}</strong>
                <span className="block font-serif text-3xl text-[#1E293B] font-bold mt-3">${bundle.usd}</span>
                <span className="block text-xs text-[#6B7280] leading-relaxed mt-3">{bundle.description}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-t border-[#D8CCB9] pt-6">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Your selection</span>
            <strong className="block font-serif text-2xl text-[#1E293B] mt-1">{selectedBundle.name} · ${selectedBundle.usd}</strong>
            <span className="block text-xs text-[#6B7280] mt-1">Payhip will ask you to confirm this edition on its product page.</span>
          </div>
          <a href="https://payhip.com/b/CidbX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold px-7 py-4 text-sm shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]">
            Continue with {selectedBundle.name}
            <ChevronRight className="w-4 h-4 text-[#C5A059]" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [marketRoute, setMarketRoute] = useState<"international" | "africa" | "">("international");
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInfluenceCircle, setShowInfluenceCircle] = useState(false);
  const kitFormRef = useRef<HTMLDivElement | null>(null);

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
    if (!showInfluenceCircle) return;
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
  }, [showInfluenceCircle]);

  useEffect(() => {
    if (!showInfluenceCircle) return;
    window.requestAnimationFrame(() => {
      document.getElementById("influence-circle")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [showInfluenceCircle]);


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
            <div className="seal-hover w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center text-[#C5A059] shadow-md border-2 border-[#C5A059]/40 relative" aria-label="Eryeza Kalalu publishing seal">
              <Crown className="absolute w-4 h-4 top-1.5" />
              <span className="font-serif font-bold text-lg mt-2">EK</span>
            </div>
            <div>
              <span className="font-serif font-bold text-2xl tracking-tight text-[#1E293B] block leading-none">Eryeza Kalalu</span>
              <span className="text-[10px] tracking-[0.18em] text-[#C5A059] uppercase font-bold block mt-1">Author · Pastor · Christian Communicator · Publishing Consultant</span>
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

      <section id="preview" data-reveal="preview" className="py-20 bg-[#F7F4EF] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">A First Look Inside</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">See what you’ll practice.</h2>
              <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed">Before you decide to pre-order, spend a few quiet minutes with the journey. The opening pages will give you a feel for the voice, pace, and work this devotional invites.</p>
              <p className="font-serif italic text-xl leading-relaxed text-[#1E293B] border-l-2 border-[#C5A059] pl-5">“Who are you becoming while you become visible?”</p>
            </div>
            <div className="rule-glow lg:col-span-7 bg-[#EFECE6] border border-[#C5A059]/40 p-7 sm:p-10 relative">
              <div className="absolute top-0 left-0 w-20 h-1 bg-[#C5A059]"></div>
              <div className="flex items-center gap-3 mb-6">
                <span className="seal-hover inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A059] text-[#C5A059] font-serif font-bold"><Eye className="w-4 h-4" /></span>
                <div><span className="block text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">A quiet first look</span><span className="text-xs text-[#6B7280] font-semibold">Read before you decide</span></div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1E293B] mb-3">A sample reading from the 30-day devotional</h3>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl">Receive a carefully chosen sample from the opening of the devotional by email. It is designed for an easy read on your phone and a simple return when you need to sit with a thought again.</p>
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="preview-feature"><BookOpen className="w-4 h-4 text-[#C5A059]" /><span>Get the sample</span></div>
                <div className="preview-feature"><MessageCircle className="w-4 h-4 text-[#C5A059]" /><span>Receive it by email</span></div>
                <div className="preview-feature"><HeartHandshake className="w-4 h-4 text-[#C5A059]" /><span>Begin with honesty</span></div>
              </div>
              <a href="#influence-circle" className="inline-flex items-center gap-2 mt-7 text-sm font-bold text-[#1E293B] underline decoration-[#C5A059] decoration-2 underline-offset-4 hover:text-[#8D6D2F]">Send me the sample <ChevronRight className="w-4 h-4 text-[#C5A059]" /></a>
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
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="journey-card"><div className="flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Days 1–5</span><Footprints className="w-5 h-5 text-[#C5A059]" /></div><span className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] font-semibold mt-4">The Invitation</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Come close before you lead.</p><p className="text-sm text-[#6B7280] leading-relaxed mt-2">The journey begins with Jesus, not a platform.</p></div>
              <div className="journey-card"><div className="flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Days 6–15</span><Flame className="w-5 h-5 text-[#C5A059]" /></div><span className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] font-semibold mt-4">The Transformation</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Let Christ reshape you.</p><p className="text-sm text-[#6B7280] leading-relaxed mt-2">Character, prayer, obedience, service, and dependence become the work.</p></div>
              <div className="journey-card"><div className="flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Days 16–20</span><Gauge className="w-5 h-5 text-[#C5A059]" /></div><span className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] font-semibold mt-4">The Crucible</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Pressure reveals what visibility hides.</p><p className="text-sm text-[#6B7280] leading-relaxed mt-2">Offense, praise, delay, and difficulty expose what has been formed.</p></div>
              <div className="journey-card"><div className="flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Days 21–30</span><HandHeart className="w-5 h-5 text-[#C5A059]" /></div><span className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] font-semibold mt-4">The Multiplication</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Turn what you've been given outward.</p><p className="text-sm text-[#6B7280] leading-relaxed mt-2">Influence becomes stewardship.</p></div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-[#E6E0D4] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4"><span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">This Book Is for You If…</span><h3 className="font-serif text-3xl font-bold text-[#1E293B] mt-3">You are already influencing someone.</h3></div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#4B5563] leading-relaxed"><div className="audience-item"><BriefcaseBusiness className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span>You sense God has called you toward influence and want to be ready for what it asks of you.</span></div><div className="audience-item"><House className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span>You are trying to live faithfully at your desk, not only on Sunday.</span></div><div className="audience-item"><UsersRound className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span>You are building a business, ministry, or family, and it is already shaping other people.</span></div><div className="audience-item"><GraduationCap className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span>You disciple people who will go on to lead.</span></div><div className="audience-item"><Flame className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span>You are young, ambitious, and wondering how faith should shape that ambition.</span></div><div className="audience-item"><Eye className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span>You are already visible and beginning to feel what visibility costs.</span></div><div className="audience-item"><HeartHandshake className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span>You want your ordinary life to carry the weight of Christ’s name well.</span></div><div className="audience-item"><Footprints className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span>You do not need a title to begin. Your workplace, your home, your church, and your street are already places where your life is speaking.</span></div></div>
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
                <div className="explore-panel grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#4B5563] leading-relaxed"><div className="explore-item"><Crown className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span><strong className="text-[#1E293B]">Character</strong> · who you are when no one's watching.</span></div><div className="explore-item"><BookOpen className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span><strong className="text-[#1E293B]">Prayer</strong> · whether your public life stays tethered to a private one.</span></div><div className="explore-item"><Flame className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span><strong className="text-[#1E293B]">The Holy Spirit</strong> · what dependence on God looks like outside the dramatic moments.</span></div><div className="explore-item"><Gauge className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span><strong className="text-[#1E293B]">Competence</strong> · how excellence and reliance on God work together, not against each other.</span></div><div className="explore-item"><UsersRound className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span><strong className="text-[#1E293B]">Leadership</strong> · whether you can lead before anyone hands you a title.</span></div><div className="explore-item"><Shield className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span><strong className="text-[#1E293B]">Pressure</strong> · what difficulty reveals about who you've actually become.</span></div><div className="explore-item"><HandHeart className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span><strong className="text-[#1E293B]">Service</strong> · what happens when influence turns into lifting someone else.</span></div><div className="explore-item"><Award className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span><strong className="text-[#1E293B]">Legacy</strong> · what's left standing after the applause stops.</span></div></div>
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
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSddMgY2w4tZhIwLXIVWtyPQ8mRFAzdAGlE4YwYb0U02_zXHCw/viewform" target="_blank" rel="noreferrer">
                <Button className="bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold px-8 py-6 text-sm shadow-md border border-[#C5A059]/30">
                  Share Your Reflection
                  <ChevronRight className="ml-2 w-4 h-4 text-[#C5A059]" />
                </Button>
              </a>
              <p className="text-xs text-[#6B7280] mt-3 max-w-md">The form opens in a new tab. Every submission is reviewed privately before any reflection is considered for publication.</p>
            </div>
          </div>

          {/* Author-Focused Endorsements */}
          <div className="mb-14">
            <h3 className="font-serif text-2xl font-bold text-[#1E293B] mb-6 text-center">Perspectives on the Author's Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="review-card relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="quote-mark">“</div>
                  <blockquote className="font-serif text-lg text-[#1E293B] italic leading-relaxed">
                    "The principles Pastor Eryeza writes daily can influence a chef on the kitchen table to the judge on the verdict table."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">Martin Nangoli</span>
                  <span className="bg-[#EFECE6] px-3 py-1 rounded text-[#1E293B] font-semibold">Specialty Coffee Producer</span>
                </div>
              </div>

              <div className="review-card relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="quote-mark">“</div>
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
              
              {/* Review 1: Vine Voice */}
              <div className="review-card relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-base text-[#1E293B] italic leading-relaxed">
                    "I felt that the message of this book was encouraging and timely for our day and age. You can read the book as a daily devotional or read it all at once for a spiritual tune up."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">Vine Voice</span>
                  <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">Amazon Verified Purchase</span>
                </div>
              </div>

              {/* Review 2: Jeff Mutenga (UK) */}
              <div className="review-card relative flex flex-col justify-between">
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
              <div className="review-card relative flex flex-col justify-between">
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

              {/* Review 4: Rev. Derry Flay (UK) */}
              <div className="review-card relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-base text-[#1E293B] italic leading-relaxed">
                    "This book is well written and biblically sound."
                  </blockquote>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold text-[#1E293B]">Rev. Derry Flay</span>
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
                Pastor · Author · Christian Communicator · Publishing Consultant
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed font-sans">
                Pastor Eryeza Kalalu is passionate about helping people follow Christ faithfully and live with purpose in every season of life. Through his writing, teaching, and podcast, he explores faith, spiritual formation, leadership, calling, and the practical realities of walking with God. He is the host of <em>Devotion In Season</em> and founder of THE CCN DAILY, a devotional ministry creating resources that help people cultivate a deeper, more meaningful life with Christ.
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
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section data-reveal="experience" className="py-24 bg-[#F7F4EF] border-b border-[#E6E0D4]"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="max-w-3xl space-y-5 mb-12"><span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">The 30-Day Experience Doesn't End With the Last Page</span><h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">Day 30 is not the finish line. It's a hand-off.</h2><p className="text-[#6B7280] text-base sm:text-lg leading-relaxed">The devotional opens a path you can keep walking. Each resource gives the lesson another place to take root.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div className="experience-card"><BookOpen className="w-5 h-5 text-[#C5A059]" /><strong>Read</strong><span>the complete 30-day devotional.</span></div><div className="experience-card"><MessageCircle className="w-5 h-5 text-[#C5A059]" /><strong>Listen</strong><span>narrated in the author's own voice.</span></div><div className="experience-card"><Eye className="w-5 h-5 text-[#C5A059]" /><strong>Reflect</strong><span>with the companion Journal.</span></div><div className="experience-card"><UsersRound className="w-5 h-5 text-[#C5A059]" /><strong>Gather</strong><span>with the six-session Group Study Guide.</span></div><div className="experience-card"><Footprints className="w-5 h-5 text-[#C5A059]" /><strong>Practice</strong><span>with the Reading Plan and Challenge.</span></div><div className="experience-card"><MessageCircle className="w-5 h-5 text-[#C5A059]" /><strong>Continue</strong><span>through a 30-day WhatsApp journey.</span></div><div className="experience-card"><Compass className="w-5 h-5 text-[#C5A059]" /><strong>Go Deeper</strong><span>through the devotional app.</span></div></div></div></section>

      {/* Editions & Regional Routes */}
      <section id="formats" data-reveal="formats" className="py-24 bg-[#1E293B] text-[#F8FAFC] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">Pre-order now &bull; Digital delivery 15 September 2026</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">Choose How You Want to Enter the Journey</h2>
            <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed font-sans">Choose the package that fits your season. Pre-order through the route that serves you best; the digital files will be delivered on 15 September 2026.</p>
          </div>

          <Accordion type="single" collapsible value={marketRoute} onValueChange={(value) => setMarketRoute(value === "international" || value === "africa" ? value : "")} className="max-w-6xl mx-auto space-y-3" aria-label="Choose your buying route">
            <AccordionItem value="international" className="border border-[#C5A059]/40 bg-[#0F172A]/55 overflow-hidden">
              <AccordionTrigger className="px-5 py-5 text-left hover:no-underline [&>svg]:text-[#C5A059]">
                <span><span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">International</span><span className="font-serif text-xl text-white font-bold">Payhip</span><span className="block text-xs text-[#94A3B8] mt-1">Secure digital checkout · compare editions below</span></span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-5 pt-0 sm:px-5">
                <div data-reveal="payhip" className="space-y-4">
                  <div className="max-w-3xl mx-auto text-center space-y-2">
                    <span className="text-xs uppercase tracking-[0.22em] text-[#C5A059] font-bold">International checkout</span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-white font-bold">Choose your edition on Payhip.</h3>
                    <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">The live Payhip product page is ready below with all three digital formation editions and secure checkout.</p>
                  </div>
                  <PayhipEmbed />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="africa" className="border border-[#C5A059]/40 bg-[#0F172A]/55 overflow-hidden">
              <AccordionTrigger className="px-5 py-5 text-left hover:no-underline [&>svg]:text-[#C5A059]">
                <span><span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Africa</span><span className="font-serif text-xl text-white font-bold">Selar</span><span className="block text-xs text-[#94A3B8] mt-1">Mobile money and card payment · UGX pricing</span></span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-5 pt-0 sm:px-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
                  {bundleOptions.map((bundle) => <div key={bundle.name} className={`lift-card bundle-card border ${bundle.popular ? "border-2 border-[#C5A059]" : "border-[#C5A059]/40"} bg-[#0F172A] p-6 relative flex flex-col`}><div className="flex items-start justify-between gap-4"><div><span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Library edition</span><span className="block text-xs text-[#94A3B8] mt-1">Volume I · Digital formation</span></div><span className="edition-seal" aria-hidden="true"><Crown className="w-4 h-4" /></span></div>{bundle.popular && <span className="self-start mt-4 bg-[#C5A059] text-white text-[10px] uppercase tracking-[0.18em] px-3 py-1 font-bold">Most popular</span>}<span className="block font-serif text-lg text-[#C5A059] mt-4">{bundle.name}</span><h3 className="font-serif text-2xl text-white font-bold mt-3">UGX {bundle.ugx.toLocaleString("en-UG")}</h3><p className="text-sm text-[#CBD5E1] leading-relaxed mt-3 flex-1">{bundle.description}</p><a href="https://selar.com/8818840887" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 mt-6 border border-[#C5A059]/60 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C5A059] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]">Pre-order via Selar<ChevronRight className="w-4 h-4 text-[#C5A059]" /></a></div>)}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </div>
      </section>

      {/* Canonical library roadmap, FAQ, and closing invitation. */}
      <section data-reveal="library" className="py-24 bg-[#EFECE6] border-t border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5 mb-14"><span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">The Deep Encounter Library</span><h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">One library. Different doors into the same encounter with God.</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20"><div className="lift-card border-t-2 border-[#C5A059] bg-[#F7F4EF] p-6"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Now</span><h3 className="font-serif text-2xl font-bold text-[#1E293B] mt-2">The Influential Spirit</h3><p className="text-sm text-[#6B7280] mt-2">Formation before platform.</p></div><div className="lift-card border-t-2 border-[#1E293B] bg-[#F7F4EF] p-6"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Coming next</span><h3 className="font-serif text-2xl font-bold text-[#1E293B] mt-2">Unedited Christmas</h3><p className="text-sm text-[#6B7280] mt-2">A fresh encounter with the mystery of the incarnation.</p></div><div className="lift-card border-t-2 border-[#1E293B] bg-[#F7F4EF] p-6"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Coming 2027</span><p className="font-serif text-xl font-bold text-[#1E293B] mt-2">Holy Week Every Week · Prayer Craft · Discerning God's Whisper · The Spiritual Health Solution</p></div></div>
          <div className="max-w-4xl"><span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">Frequently Asked Questions</span><h2 className="font-serif text-4xl font-bold text-[#1E293B] mt-3 mb-8">Questions readers are already asking.</h2><Accordion type="single" collapsible className="faq-shell"><AccordionItem value="leadership" className="faq-item"><AccordionTrigger className="faq-trigger">Is this a leadership book?</AccordionTrigger><AccordionContent className="faq-content">It's more than that. The Influential Spirit is a devotional about spiritual formation. Leadership, work, and influence are where that formation gets tested.</AccordionContent></AccordionItem><AccordionItem value="platforms" className="faq-item"><AccordionTrigger className="faq-trigger">Is the book against platforms?</AccordionTrigger><AccordionContent className="faq-content">No. Ambition, visibility, leadership, none of that is the target here. The question underneath the whole book is simpler and harder: who are you becoming while you become visible?</AccordionContent></AccordionItem><AccordionItem value="leader" className="faq-item"><AccordionTrigger className="faq-trigger">Do I need to be a leader to read it?</AccordionTrigger><AccordionContent className="faq-content">No. Influence here has nothing to do with a title. It's about ordinary responsibility, character, and the people who are already watching your life.</AccordionContent></AccordionItem><AccordionItem value="pastors" className="faq-item"><AccordionTrigger className="faq-trigger">Is it only for pastors?</AccordionTrigger><AccordionContent className="faq-content">No. It's written for professionals, entrepreneurs, ministry leaders, young adults, and anyone trying to live out their faith where they actually spend their week.</AccordionContent></AccordionItem><AccordionItem value="group" className="faq-item"><AccordionTrigger className="faq-trigger">Can I use it with a group?</AccordionTrigger><AccordionContent className="faq-content">Yes. The Formation Bundle and Complete Formation Edition both include the six-session Group Study Guide.</AccordionContent></AccordionItem><AccordionItem value="audio" className="faq-item"><AccordionTrigger className="faq-trigger">Can I listen instead of read?</AccordionTrigger><AccordionContent className="faq-content">Yes. The Formation Bundle includes the author-narrated audiobook.</AccordionContent></AccordionItem><AccordionItem value="journal" className="faq-item"><AccordionTrigger className="faq-trigger">Is there a journal?</AccordionTrigger><AccordionContent className="faq-content">Yes, in the Complete Formation Edition.</AccordionContent></AccordionItem></Accordion></div>
        </div>
      </section>

      <section data-reveal="final" className="py-24 bg-[#1E293B] text-white text-center border-t border-[#C5A059]/30"><div className="max-w-3xl mx-auto px-4 sm:px-6"><h2 className="font-serif text-4xl sm:text-5xl font-bold">Your influence does not start when you get the platform.</h2><p className="text-[#CBD5E1] text-lg leading-relaxed mt-5">It starts with who you're becoming right now, before anyone's watching.</p><div className="flex flex-col sm:flex-row justify-center gap-4 mt-8"><a href="#formats"><Button className="bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold px-8 py-6">Begin the 30-Day Journey <ChevronRight className="ml-2 w-5 h-5 inline" /></Button></a><Button type="button" variant="outline" aria-controls="influence-circle" aria-expanded={showInfluenceCircle} onClick={() => setShowInfluenceCircle(true)} className="border-[#C5A059]/60 text-white hover:bg-white/10 font-semibold px-8 py-6">{showInfluenceCircle ? "Influence Circle below" : "Join the Influence Circle"}</Button></div><p className="text-xs uppercase tracking-[0.22em] text-[#C5A059] mt-8">Grounded in Scripture · Forged for Impact</p></div></section>

      {showInfluenceCircle && <section id="influence-circle" data-reveal="circle" className="is-visible py-24 bg-[#0F172A] text-[#F8FAFC] border-t border-[#C5A059]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">The Launch Community</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">Join the Influence Circle</h2>
              <p className="text-[#CBD5E1] text-lg leading-relaxed max-w-2xl font-sans">Get a downloadable sample from <span className="font-serif italic text-white">The Influential Spirit</span>, launch updates, access to the 30-day journey resources, and first notice of new releases from The Deep Encounter Library.</p>
              <div className="rule-glow flex items-center gap-3 pt-4 border-t border-[#C5A059]/30"><span className="seal-hover inline-flex h-9 w-9 items-center justify-center border border-[#C5A059] text-[#C5A059] font-serif font-bold text-sm">EK</span><span className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">Formation Before Platform</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6"><div className="border-l-2 border-[#C5A059] pl-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">01</span><strong className="block text-white font-serif">Preview</strong><span className="text-xs text-[#94A3B8]">A first look inside the book.</span></div><div className="border-l-2 border-[#C5A059] pl-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">02</span><strong className="block text-white font-serif">Journey</strong><span className="text-xs text-[#94A3B8]">Resources for the 30 days.</span></div><div className="border-l-2 border-[#C5A059] pl-4"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">03</span><strong className="block text-white font-serif">Library</strong><span className="text-xs text-[#94A3B8]">News of what comes next.</span></div></div>
            </div>
            <div className="lift-card lg:col-span-5 bg-[#F7F4EF] text-[#1E293B] p-6 sm:p-8 rounded-md border border-[#C5A059]/50 shadow-2xl"><div className="border-b border-[#C5A059]/40 pb-4 mb-5"><span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">Library Dispatch</span><h3 className="font-serif text-2xl font-bold text-[#1E293B] mt-1">Stay close to the journey.</h3></div><div ref={kitFormRef} className="min-h-[112px]" aria-label="Influence Circle signup form"></div><p className="text-[11px] text-[#6B7280] leading-relaxed mt-4 border-t border-[#C5A059]/30 pt-4">By joining, you are signing up for Influence Circle launch and library communications. Find the Devotional newsletter and other resources at <a href="https://theccndaily.com" target="_blank" rel="noreferrer" className="text-[#1E293B] underline underline-offset-2 hover:text-[#C5A059]">theccndaily.com</a>.</p></div>
          </div>
        </div>
      </section>}

      {/* Footer */}
      <footer className="bg-[#111827] text-[#94A3B8] py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="seal-hover w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#C5A059] border border-[#C5A059]/40 relative" aria-label="Eryeza Kalalu publishing seal">
              <Crown className="absolute w-3 h-3 top-1" />
              <span className="font-serif font-bold text-sm mt-2">EK</span>
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white tracking-tight block">Eryeza Kalalu</span>
              <span className="font-serif text-[11px] text-[#94A3B8] block">eryezakalalu.com</span>
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
      <a href="#formats" className="fixed bottom-4 left-4 right-4 z-40 md:hidden inline-flex items-center justify-center gap-2 bg-[#C5A059] text-white font-bold px-5 py-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.24)] border border-[#F7F4EF]/60" aria-label="View editions and preorder options">
        View Editions <ChevronRight className="w-4 h-4" />
      </a>
    </div>
  );
}
