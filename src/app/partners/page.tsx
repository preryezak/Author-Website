import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { OrnamentRule } from "@/components/site/ui-bits";

/**
 * Resources for Selar affiliates: how to find their link, the images to share,
 * the posts to copy, the facts and prices, and the launch challenge. Not indexed;
 * linked from the affiliate emails only.
 */
export const metadata: Metadata = {
  title: "Affiliate resources",
  description: "Images, posts and facts for affiliates sharing The Influential Spirit and Unscripted Christmas.",
  alternates: { canonical: "/partners" },
  robots: { index: false, follow: false },
};

const IMAGES = [
  { file: "ad1_your_pulpit_may_be_a_desk.jpg", label: "Your pulpit may be a desk", use: "For believers at work" },
  { file: "ad2_who_disciples_you.jpg", label: "Who disciples you?", use: "For pastors and leaders" },
  { file: "ad3_ugandan_pastor_30_mornings.jpg", label: "Thirty mornings", use: "With the author's photo" },
  { file: "influential_spirit_cover_square.jpg", label: "The cover", use: "For any post" },
  { file: "launch_challenge_1080_ngn.jpg", label: "The launch challenge", use: "For your fellow affiliates" },
  { file: "unscripted_christmas_preorder.jpg", label: "Unscripted Christmas", use: "The Advent pre-order" },
];

const POSTS = [
  { title: "WhatsApp status", text: "The Influential Spirit is a 30-day devotional for Christians whose influence is growing at work. It takes ten minutes each morning and gives you one practical step for the day: [your link]" },
  { title: "For leaders and pastors", text: "If you lead people, at church, at work or at home, The Influential Spirit is thirty mornings on the character Christ forms in a leader. The Formation Bundle has the audiobook and a six-session group guide for your team. [your link]" },
  { title: "For the workplace", text: "Someone took the credit for your work. Your manager is unfair. You are tired of being the only believer in the office. The Influential Spirit has a day for each of these, with one step to take at work that same day. [your link]" },
  { title: "The Formation Bundle", text: "The Formation Bundle of The Influential Spirit gives you the thirty mornings with the whole audiobook read by the author, for ₦27,000 (KSh 2,600, $19.99). [your link]" },
  { title: "Christmas pre-order", text: "Unscripted Christmas is a 24-day Advent devotional for grief, money stress, family tension and loneliness at Christmas. Pre-order it at 20% off before it is released on 16 November. [your link]" },
];

export default function PartnersPage() {
  return (
    <SiteShell active="/books">
      <section className="section surface-100">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <span className="eyebrow">For affiliates</span>
            <h1 className="page-head__title">Everything you need to share the books.</h1>
            <p>
              Thank you for sharing The Influential Spirit and Unscripted Christmas. You earn 30% of every sale through your
              link, and you can use everything on this page as it is or in your own words.
            </p>
            <OrnamentRule>§</OrnamentRule>

            <h2 className="display" style={{ fontSize: 26, fontWeight: 500 }}>1. Your link</h2>
            <p>
              Sign in to Selar, open your affiliate dashboard and copy your link for Eryeza Kalalu&rsquo;s store. Every sale
              made through it, of either book, is credited to you. Your link is also in the email we sent you.
            </p>

            <h2 className="display" style={{ fontSize: 26, fontWeight: 500, marginTop: 28 }}>2. The First Sale Challenge, 3 to 16 November</h2>
            <p>
              The first three affiliates to make one sale each win UGX 10,000 (about ₦3,166) and a free copy of The Complete
              Christmas Edition. Sales of both books count, and you keep your 30% commission on each one. The launch challenge
              closed on 31 October with no sales recorded, so no prizes were won.
            </p>

            <h2 className="display" style={{ fontSize: 26, fontWeight: 500, marginTop: 28 }}>3. Images to share</h2>
            <p className="caption">Tap an image to open it, then save it to your phone.</p>
          </div>
          <div className="grid-12" style={{ gap: 20, marginTop: 16 }}>
            {IMAGES.map((im) => (
              <a key={im.file} className="col-4" href={`/partners/${im.file}`} download style={{ textDecoration: "none", color: "inherit" }}>
                <img src={`/partners/${im.file}`} alt={im.label} loading="lazy" style={{ width: "100%", height: "auto", display: "block", boxShadow: "0 8px 24px rgba(30,26,22,0.15)" }} />
                <p style={{ margin: "8px 0 0", fontWeight: 600 }}>{im.label}</p>
                <p className="caption" style={{ marginTop: 2 }}>{im.use}</p>
              </a>
            ))}
          </div>
          <div className="mx-auto" style={{ maxWidth: 760, marginTop: 36 }}>
            <h2 className="display" style={{ fontSize: 26, fontWeight: 500 }}>4. Posts to copy</h2>
            <p className="caption">Replace [your link] with your own affiliate link.</p>
            {POSTS.map((p) => (
              <div key={p.title} style={{ background: "var(--paper-100, #FBF8F2)", border: "1px solid var(--paper-300, #E1D6C1)", padding: "14px 16px", margin: "12px 0" }}>
                <p style={{ fontWeight: 600, margin: "0 0 6px" }}>{p.title}</p>
                <p style={{ margin: 0 }}>{p.text}</p>
              </div>
            ))}

            <h2 className="display" style={{ fontSize: 26, fontWeight: 500, marginTop: 28 }}>5. The facts</h2>
            <ul>
              <li>The Influential Spirit: a 30-day devotional by Pastor Eryeza Kalalu, ten to fifteen minutes a morning.</li>
              <li>Reader Edition ₦13,000 (KSh 1,300, $9.99), Formation Bundle with the audiobook and Group Study Guide ₦27,000 (KSh 2,600, $19.99), Complete Formation Edition ₦41,000 (KSh 3,900, $29.99).</li>
              <li>Prices are set in US dollars and shown to each buyer in their own currency.</li>
              <li>Unscripted Christmas: pre-order at 20% off until 16 November, from ₦11,396 (UGX 36,000, $8).</li>
              <li>Buyers pay by mobile money or card, and every file downloads to keep.</li>
              <li>Anyone can read Day 1 free at eryezakalalu.com/influential-spirit.</li>
            </ul>
            <p className="caption" style={{ marginTop: 20 }}>Questions? Write to hello@eryezakalalu.com.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
