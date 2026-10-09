import { Price } from "@/components/site/price";

/**
 * The launch banner, working as a call to action. Desktop: the button sits on the banner
 * (in the empty space under the tagline). Phones and tablets: the banner
 * switches to a tall crop and the button drops into a bar beneath it, so nothing covers the books.
 */
export default function LaunchBanner({ href = "#editions", variant = "book" }: { href?: string; variant?: "book" | "home" }) {
  const pre = variant === "home" ? "home" : "launch";
  return (
    <section className="launch-banner" aria-label={variant === "home" ? "Eryeza Kalalu" : "The Influential Spirit is out now"}>
      <div className="launch-banner__frame">
        <picture>
          <source media="(max-width: 700px)" srcSet={`/images/banner/${pre}-mobile-720.webp`} />
          <source media="(max-width: 1200px)" srcSet={`/images/banner/${pre}-1100.webp`} />
          <img
            src={`/images/banner/${pre}-1920.webp`}
            width={1920}
            height={600}
            alt={variant === "home" ? "Eryeza Kalalu, pastor, author and speaker. Depth you can experience: books, the Devotion In Season podcast, Eryeza Writes letters and speaking." : "Eryeza Kalalu, pastor and author. The Influential Spirit is out now, with Unedited Christmas next and four more books in 2027."}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="launch-banner__bar">
          <a className="btn btn-primary launch-banner__cta" href={href}>
            Get the book <span className="launch-banner__from">from <Price launch="$12" full="$15" /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
