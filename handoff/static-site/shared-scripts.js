/**
 * Shared review-page scripts:
 *   – IntersectionObserver-driven [data-reveal] animation
 *   – Beehiiv RSS → letter feed renderer
 *   – Sticky mobile bar visibility toggle (landing page)
 */

// ---------- Reveal on scroll ----------
// Belt-and-braces: content is CSS-visible by default. We only enable
// the reveal animation once we've confirmed the engine can run, and
// we always force-reveal after a short timeout in case IO never fires.
// Watches BOTH [data-reveal] (section-level fades) and
// [data-reveal-stagger] (grid parents whose children ripple in).
(function () {
  var els = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal], [data-reveal-stagger]")
  );
  if (!els.length) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    // Never engage the reveal system — leave content in the default visible state.
    return;
  }

  // Only now do we opt in to the animation layer.
  document.documentElement.classList.add("js-reveal");

  function markVisible(el) {
    el.classList.add("is-visible");
  }

  // First pass: anything already in viewport at script-run time is
  // marked visible immediately (so the top of the page doesn't sit
  // hidden waiting for IO to notice it).
  var vh = window.innerHeight || document.documentElement.clientHeight;
  els.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) markVisible(el);
  });

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        markVisible(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach(function (el) { obs.observe(el); });

  // Safety net: if IntersectionObserver never fires (sandboxed iframes,
  // pathological browsers, etc.) force-reveal every element after 500ms.
  setTimeout(function () {
    els.forEach(markVisible);
    obs.disconnect();
  }, 500);
})();

// ---------- Beehiiv RSS letter feed ----------
window.EK = window.EK || {};
window.EK.RSS_URL = "https://rss.beehiiv.com/feeds/m7Wi8T8MXS.xml";

function ekFormatDate(iso) {
  try {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch (_) { return ""; }
}

function ekStripHtml(input) {
  return (input || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function ekFetchLetters() {
  var tries = [
    window.EK.RSS_URL,
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(window.EK.RSS_URL),
    "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(window.EK.RSS_URL),
  ];
  for (var i = 0; i < tries.length; i++) {
    try {
      var res = await fetch(tries[i], { headers: { Accept: "application/rss+xml,application/xml,application/json,*/*" } });
      if (!res.ok) continue;
      var contentType = res.headers.get("content-type") || "";
      if (contentType.indexOf("json") > -1 || tries[i].indexOf("rss2json") > -1) {
        var data = await res.json();
        if (data && data.items && data.items.length) {
          return data.items.slice(0, 12).map(function (it) {
            return {
              title: it.title || "Untitled",
              link:  it.link  || "#",
              pubDate: it.pubDate || "",
              description: ekStripHtml(it.description || it.content || ""),
            };
          });
        }
        continue;
      }
      var xml = await res.text();
      var doc = new DOMParser().parseFromString(xml, "application/xml");
      if (doc.querySelector("parsererror")) continue;
      var nodes = Array.prototype.slice.call(doc.querySelectorAll("item")).slice(0, 12);
      if (!nodes.length) continue;
      return nodes.map(function (node) {
        return {
          title: (node.querySelector("title") || {}).textContent || "Untitled",
          link:  (node.querySelector("link")  || {}).textContent || "#",
          pubDate: (node.querySelector("pubDate") || {}).textContent || "",
          description: ekStripHtml((node.querySelector("description") || {}).textContent || ""),
        };
      });
    } catch (_) { /* try next */ }
  }
  return [];
}

async function ekRenderLetterFeed(container, limit) {
  if (!container) return;
  limit = limit || 6;
  container.innerHTML =
    '<div class="letter-item"><div><div class="date">&nbsp;</div><div class="title">Loading recent letters…</div><div class="excerpt">Fetching the archive from Beehiiv.</div></div></div>';
  var items = await ekFetchLetters();
  if (!items.length) {
    container.innerHTML =
      '<div class="letter-empty">' +
        '<p class="body body-lg" style="max-width: 52ch; font-family: var(--font-display); font-style: italic; color: var(--ink-500);">' +
          'No letters yet. This is a live feed &mdash; every letter Pastor Eryeza publishes on Beehiiv will appear here automatically.' +
        '</p>' +
        '<p class="caption" style="margin-top: 16px;">' +
          '<a href="#letter" style="color: var(--ink-700); text-decoration: underline; text-decoration-color: var(--gold-300); text-underline-offset: 3px;">Subscribe to be first to read &rarr;</a>' +
        '</p>' +
      '</div>';
    return;
  }
  var html = "";
  items.slice(0, limit).forEach(function (it) {
    var excerpt = it.description.length > 220
      ? it.description.slice(0, 220).trimEnd() + "…"
      : it.description;
    html += ''
      + '<a class="letter-item" href="' + it.link + '" target="_blank" rel="noopener">'
      + '  <div>'
      + '    <div class="date">' + (ekFormatDate(it.pubDate) || "Letter") + '</div>'
      + '    <div class="title">' + it.title + '</div>'
      + (excerpt ? '    <p class="excerpt">' + excerpt + '</p>' : '')
      + '  </div>'
      + '  <svg class="arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>'
      + '</a>';
  });
  container.innerHTML = html;
}
window.EK.renderLetterFeed = ekRenderLetterFeed;

// ---------- Podcast episode feed (Devotion In Season) ----------
// Anchor / Spotify for Podcasters exposes an RSS feed at the show's anchor URL.
// The DIS show ID is `devotioninseason` (per user's Spotify for Podcasters link).
window.EK.PODCAST_RSS = "https://anchor.fm/s/103e4e254/podcast/rss";
// Fallback: the iHeart show has its own feed exposed as a static "episodes" page,
// but we can't reliably parse it CORS-free. We keep a static list as ultimate fallback.
window.EK.PODCAST_FALLBACK = [
  { title: "Recent episodes appear here once the feed loads.", link: "https://www.iheart.com/podcast/269-devotion-in-season-198850928", pubDate: "" }
];

async function ekFetchEpisodes() {
  var tries = [
    "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(window.EK.PODCAST_RSS),
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(window.EK.PODCAST_RSS),
    window.EK.PODCAST_RSS
  ];
  for (var i = 0; i < tries.length; i++) {
    try {
      var res = await fetch(tries[i]);
      if (!res.ok) continue;
      var ct = res.headers.get("content-type") || "";
      if (ct.indexOf("json") > -1 || tries[i].indexOf("rss2json") > -1) {
        var data = await res.json();
        if (data && data.items && data.items.length) {
          return data.items.slice(0, 8).map(function (it) {
            return { title: it.title || "Untitled", link: it.link || "#", pubDate: it.pubDate || "" };
          });
        }
        continue;
      }
      var xml = await res.text();
      var doc = new DOMParser().parseFromString(xml, "application/xml");
      if (doc.querySelector("parsererror")) continue;
      var nodes = Array.prototype.slice.call(doc.querySelectorAll("item")).slice(0, 8);
      if (!nodes.length) continue;
      return nodes.map(function (n) {
        return {
          title: (n.querySelector("title") || {}).textContent || "Untitled",
          link:  (n.querySelector("link")  || {}).textContent || "#",
          pubDate: (n.querySelector("pubDate") || {}).textContent || ""
        };
      });
    } catch (_) { /* try next */ }
  }
  return [];
}

async function ekRenderPodcastEpisodes(container, limit) {
  if (!container) return;
  limit = limit || 3;
  var items = await ekFetchEpisodes();
  if (!items.length) {
    // Graceful static fallback: link to iHeart show
    container.innerHTML =
      '<li><div>' +
        '<div class="meta">Devotion In Season &middot; iHeart</div>' +
        '<h4 class="title">Episode list loads live in-browser. Open the show to see all episodes.</h4>' +
      '</div>' +
      '<a class="play" href="https://www.iheart.com/podcast/269-devotion-in-season-198850928" target="_blank" rel="noopener">All episodes &nearr;</a>' +
      '</li>';
    return;
  }
  var html = "";
  items.slice(0, limit).forEach(function (it) {
    var date = "";
    try {
      var d = new Date(it.pubDate);
      if (!isNaN(d.getTime())) date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch (_) {}
    html += ''
      + '<li>'
      + '  <div>'
      + '    <div class="meta">' + (date || "Episode") + '</div>'
      + '    <h4 class="title">' + it.title + '</h4>'
      + '  </div>'
      + '  <a class="play" href="' + it.link + '" target="_blank" rel="noopener">Play &nearr;</a>'
      + '</li>';
  });
  container.innerHTML = html;
}
window.EK.renderPodcastEpisodes = ekRenderPodcastEpisodes;

// ---------- Sticky mobile bar (landing page) ----------
(function () {
  var bar = document.querySelector("[data-sticky-bar]");
  if (!bar) return;
  var formats = document.querySelector("#editions");
  function tick() {
    var top = window.scrollY;
    var isVisible = false;
    if (formats) {
      var r = formats.getBoundingClientRect();
      isVisible = r.top < window.innerHeight && r.bottom > 0;
    }
    var show = top > 400 && !isVisible;
    bar.style.transform = show ? "translateY(0)" : "translateY(100%)";
    bar.style.opacity   = show ? "1" : "0";
    bar.style.transition = "transform 260ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 260ms";
    bar.style.pointerEvents = show ? "auto" : "none";
  }
  tick();
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
})();
