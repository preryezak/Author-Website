"use client";

/**
 * Book card.
 *
 * Lifted verbatim from the home page's library so the /books route shows the
 * same card, not a lookalike. One definition, two pages, no drift.
 *
 * `anchorMode` exists because the home page links to in-page sections
 * (#influential-spirit) while a standalone route must link to the real page
 * (/influential-spirit). Same card, correct destination in each context.
 */
export type LibraryBook = {
  status: string;
  caption: string;
  title: string;
  role: string;
  excerpt: string;
  cta: string;
  href: string;
  cover: string;
};

export default function BookCard({
  book,
  anchorMode = "section",
}: {
  book: LibraryBook;
  anchorMode?: "section" | "route";
}) {
  const href =
    anchorMode === "route" && book.href.startsWith("#")
      ? "/" + book.href.slice(1)
      : book.href;

  return (
      <article className="col-4 book-card book-card--dark" >
                        {book.cover === "cover" ? (
                          <a href={href} className="cover-slot" aria-label={`${book.title} book cover`}>
                            <img
                              src="/images/cover-640.webp"
                              srcSet="/images/cover-640.webp 640w"
                              sizes="(max-width: 1024px) 45vw, 300px"
                              width={640}
                              height={960}
                              alt={`${book.title} book cover`}
                              loading="lazy"
                              decoding="async"
                            />
                          </a>
                        ) : (
                          <div className="cover-slot" aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 8, background: book.cover === "oxblood" ? "var(--oxblood-500)" : "var(--forest-500)", boxShadow: "inset 0 0 0 1px rgba(228,199,187,0.28), 0 8px 24px rgba(30,26,22,0.18)" }}>
                            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "8px 4px", border: `1px solid ${book.cover === "oxblood" ? "rgba(228,199,187,0.35)" : "rgba(196,207,199,0.35)"}` }}>
                              <span style={{ fontFamily: "var(--font-sans)", fontSize: 8, letterSpacing: "0.2em", color: book.cover === "oxblood" ? "var(--oxblood-100)" : "var(--forest-100)", textTransform: "uppercase" }}>{book.cover === "oxblood" ? "Vol. II" : "2027"}</span>
                              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, lineHeight: 1.1, color: "var(--paper-50)" }}>{book.cover === "oxblood" ? <>Unedited<br />Christmas</> : <>Forth-<br />coming</>}</span>
                              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: book.cover === "oxblood" ? "var(--oxblood-100)" : "var(--forest-100)", fontSize: 14, lineHeight: 1 }}>§</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="meta-row"><span className="eyebrow">{book.status}</span><span className="caption">{book.caption}</span></div>
                          <h3 className="display" style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.005em" }}>{book.title}</h3>
                          <p className="role-line">{book.role}</p>
                          <p className="excerpt">{book.excerpt}</p>
                          <div className="card-cta"><a className="btn btn-ghost btn-sm" href={href}>{book.cta}</a></div>
                        </div>
                      </article>
  );
}
