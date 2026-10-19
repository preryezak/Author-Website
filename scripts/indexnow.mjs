// Tells IndexNow search engines (Bing, which feeds ChatGPT search and Copilot; Yandex; Seznam; Naver)
// that pages changed. Run after a deploy: node scripts/indexnow.mjs
// The key file public/c621f579b4d691d49b0df57e5bd0229f.txt proves the site owns this key.
const KEY = "c621f579b4d691d49b0df57e5bd0229f";
const HOST = "eryezakalalu.com";
const urls = ["/", "/influential-spirit/", "/christmas/", "/books/", "/podcast/", "/resources/", "/about/", "/speaking/", "/letter/", "/llms.txt"].map((p) => `https://${HOST}${p}`);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log("IndexNow", res.status, res.statusText);
