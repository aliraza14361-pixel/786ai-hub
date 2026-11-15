export default function sitemap() {
  const baseUrl = "https://786ai-hub.vercel.app";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: baseUrl + "/studio", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: baseUrl + "/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: baseUrl + "/privacy-policy", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: baseUrl + "/terms-of-service", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: baseUrl + "/affiliate-disclosure", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 }
  ];
}
