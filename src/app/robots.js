export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://786ai-hub.vercel.app/sitemap.xml"
  };
}
