import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Award, Shield, Compass, ChevronRight, CheckCircle2, Sparkles, Feather, Star, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [selectedFormat, setSelectedFormat] = useState<"ebook" | "bundle">("ebook");
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EF] text-[#1A1A1A] font-sans selection:bg-[#C5A059] selection:text-white">
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
            <a href="#about-book" className="hover:text-[#C5A059] transition-colors">The 30-Day Journey</a>
            <a href="#reviews" className="hover:text-[#C5A059] transition-colors">Reader Reviews</a>
            <a href="#author" className="hover:text-[#C5A059] transition-colors">Why I Wrote This</a>
            <a href="#formats" className="hover:text-[#C5A059] transition-colors">Editions</a>
          </nav>
          <div>
            <a href="#formats">
              <Button className="bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold px-6 py-5 shadow-sm transition-all tracking-wide text-sm">
                Acquire Your Copy
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden border-b border-[#E6E0D4]">
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
                Friend, if you have ever felt the quiet ache of wanting your daily work to carry eternal weight without chasing empty titles or superficial applause, this book was written for you. Let us walk through thirty days of practical, scriptural transformation together.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 pt-2">
                <a href="#formats">
                  <Button size="lg" className="bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold px-9 py-7 text-base shadow-xl border border-[#C5A059]/30">
                    Get Instant Digital Access ($15)
                    <ChevronRight className="ml-2 w-5 h-5 text-[#C5A059]" />
                  </Button>
                </a>
                <a href="#about-book">
                  <Button size="lg" variant="outline" className="border-[#1E293B]/20 hover:bg-[#EFECE6] text-[#1E293B] font-semibold px-8 py-7 text-base">
                    See What You'll Practice
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
                  <span>Instant PDF & EPUB Delivery</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">✓</div>
                  <span>Secure Payhip Checkout</span>
                </div>
              </div>
            </div>

            {/* Right Cover Mockup */}
            <div className="lg:col-span-5 flex justify-center items-center py-6">
              <div className="relative group perspective-1000">
                <div className="absolute -inset-6 bg-gradient-to-tr from-[#C5A059]/35 via-[#1E293B]/10 to-transparent rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition duration-700"></div>
                
                <div className="relative bg-[#F3EEE3] p-5 sm:p-7 rounded-2xl shadow-2xl border border-[#C5A059]/40 max-w-sm transform group-hover:-translate-y-1 transition duration-500">
                  <div className="absolute top-4 right-5 text-[#C5A059] font-serif text-[11px] tracking-[0.2em] uppercase font-semibold">VOL. 01</div>
                  
                  <div className="relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] rounded-md overflow-hidden border border-[#D4C4A8]">
                    <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 to-transparent pointer-events-none z-10"></div>
                    <img 
                      src="/manus-storage/influence_cover_definitive_master_v2_d28be92f.png" 
                      alt="The Influential Spirit Book Cover by Eryeza Kalalu" 
                      className="w-full h-auto object-cover transform scale-100 group-hover:scale-[1.02] transition duration-500"
                    />
                  </div>

                  <div className="mt-5 text-center space-y-1.5 border-t border-[#E6E0D4]/80 pt-4">
                    <span className="text-xs text-[#1E293B] font-serif font-bold tracking-[0.2em] block uppercase">Digital Master Edition</span>
                    <span className="text-[11px] text-[#6B7280] font-sans font-medium">PDF &amp; EPUB Available Now &bull; Print &amp; Audio Forthcoming</span>
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
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold">Your 30-Day Transformation Path</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">
              Three Pillars of Kingdom Influence
            </h2>
            <p className="text-[#4B5563] text-lg leading-relaxed font-serif italic">
              "True spiritual influence is never accidental. It is forged when divine authority meets steady character in the ordinary spaces of your workday."
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
                  Step out of spiritual passivity. Learn to anchor your daily decisions in heavenly governance, bringing the claims of Christ to workplace pressures, professional choices, and daily friction.
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
                  Private integrity that sustains public weight. Discover why testing in the secret place precedes elevation, ensuring your character outlasts your gifting and holds firm under pressure.
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

      {/* Verified First-Edition Amazon Reviews Section */}
      <section id="reviews" className="py-24 bg-[#F7F4EF] border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center space-x-1.5 text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-extrabold block">Reader Responses</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">
              Verified First-Edition Reviews
            </h2>
            <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed font-sans">
              Authentic 5-star reviews from verified readers and leaders on Amazon for the first edition of <span className="italic font-serif">The Influential Spirit</span>.
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
                      Have you journeyed through <span className="italic font-serif">The Influential Spirit</span>? Share your reflection below. Submitted reviews are verified by our editorial team before publication.
                    </DialogDescription>
                  </DialogHeader>

                  {reviewSubmitted ? (
                    <div className="bg-[#EFECE6] border border-[#C5A059] p-6 rounded-xl text-center space-y-3 mt-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Review 1 */}
            <div className="bg-[#FAF8F5] border-2 border-[#E6E0D4] p-8 rounded-xl shadow-sm relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-[#C5A059]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="font-serif text-lg text-[#1E293B] italic leading-relaxed">
                  "I felt that the message of this book was encouraging and timely for our day and age. You can read the book as a daily devotional or read it all at once for a spiritual tune up."
                </blockquote>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-bold text-[#1E293B]">Vine Voice</span>
                <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">Verified Amazon Review</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#FAF8F5] border-2 border-[#E6E0D4] p-8 rounded-xl shadow-sm relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-[#C5A059]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="font-serif text-lg text-[#1E293B] italic leading-relaxed">
                  "Practical and full of wisdom gained from experience. This is not a dry theological treatise but is a clear explanation of the steps needed to follow Christ and be a good influence in this world."
                </blockquote>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-bold text-[#1E293B]">Chris Gould</span>
                <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">UK &bull; Verified Amazon Review</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-[#FAF8F5] border-2 border-[#E6E0D4] p-8 rounded-xl shadow-sm relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-[#C5A059]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="font-serif text-lg text-[#1E293B] italic leading-relaxed">
                  "This is well written and biblically sound."
                </blockquote>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-bold text-[#1E293B]">Rev. Derry Flay</span>
                <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">UK &bull; Verified Amazon Review</span>
              </div>
            </div>

            {/* Review 4 */}
            <div className="bg-[#FAF8F5] border-2 border-[#E6E0D4] p-8 rounded-xl shadow-sm relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-[#C5A059]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="font-serif text-lg text-[#1E293B] italic leading-relaxed">
                  "This book is simple and practical and yet very instructive and inspiring."
                </blockquote>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E6E0D4] flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-bold text-[#1E293B]">Jeff Mutenga</span>
                <span className="bg-[#EFECE6] px-2.5 py-1 rounded text-[#1E293B] font-semibold">UK &bull; Verified Amazon Review</span>
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
                <span>Author Perspective</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E293B]">
                Pastor Eryeza Kalalu
              </h2>
              <p className="font-serif text-lg text-[#4B5563] italic">
                Pastor at Rivers of Life Healing Centre-Kawuku, Author, & Publishing Consultant
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed font-sans">
                Operating from Kawuku-Entebbe, Uganda, my burden is straightforward: to help believers stop managing their faith at the surface and start carrying the genuine weight of scriptural discipleship into every room they enter.
              </p>
            </div>

            <div className="lg:col-span-7 bg-[#FAF8F5] p-8 sm:p-12 rounded-2xl border-2 border-[#E6E0D4] shadow-md relative">
              <div className="absolute top-6 right-6 text-[#C5A059] font-serif text-6xl opacity-20">“</div>
              <div className="space-y-6 relative z-10">
                <span className="text-xs uppercase tracking-widest text-[#1E293B] font-bold block">Why I Wrote This Book</span>
                <blockquote className="font-serif text-xl sm:text-2xl text-[#1E293B] italic leading-relaxed">
                  "We are not called to whisper our faith in the corner while the world dictates the culture. When your inner life is anchored in Christ, your quiet competence carries more authority than any title ever could."
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
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">Digital Edition Release</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">
              Choose Your Edition
            </h2>
            <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed font-sans">
              Acquire the definitive digital master files instantly. Print and audiobook editions are currently in preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-xl mx-auto">
            
            {/* Option 1: Digital Ebook */}
            <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-10 border-2 border-[#C5A059] transition-all flex flex-col justify-between shadow-2xl relative">
              <div className="absolute top-0 right-0 bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-1.5 rounded-bl-xl shadow-sm">
                Available Now
              </div>
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#C5A059] text-white font-semibold px-3 py-1">Instant Access</Badge>
                  <span className="font-serif text-3xl font-bold text-white">$15.00</span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Digital Master Ebook</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Complete 30-day devotional in high-resolution PDF and EPUB formats, optimized for Kindle, Apple Books, tablets, and reading apps.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-[#CBD5E1] pt-2 border-t border-slate-800">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Complete 30-Day Devotional (PDF &amp; EPUB)</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Instant Secure Download via Payhip</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#C5A059] mr-3 shrink-0" /> Formatted for All Major E-Readers</li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-800">
                <div className="space-y-3 text-center">
                  <a href="https://payhip.com/ccndaily" target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-[#C5A059] hover:bg-[#B38F4D] text-white font-semibold py-7 text-base shadow-lg transition-transform active:scale-[0.98]">
                      Acquire Ebook ($15.00)
                    </Button>
                  </a>
                  <p className="text-[11px] text-[#64748B]">Secured via Payhip &bull; Automatic Download Delivery</p>
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
