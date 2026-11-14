export default function ToolDetailsGuide({ tool }) {
  if (!tool || typeof tool !== "object") return null;
  const name = tool.name || tool.title || "This AI Tool";
  const slug = String(tool.slug || name).toLowerCase();
  const pricing = String(tool.pricing || "Freemium").trim();
  const cat = typeof tool.category === "string" ? tool.category : tool.category?.name || "AI Productivity";
  const presets = {
    gemini: { bestFor: "Students, writers, researchers, and developers needing fast multimodal AI help across text, code, and images.", freeLimit: "100% Free tier with a Google account offering daily prompts, file summaries, and coding assistance.", features: ["Multimodal reasoning across text, code, images, and documents", "Smooth workflow with Google Docs, Gmail, and Search", "Fast responses for study notes, brainstorming, and debugging", "Easy web and mobile access with zero setup"] },
    elevenlabs: { bestFor: "YouTubers, podcasters, and faceless video creators needing natural, human-like AI voiceovers.", freeLimit: "Freemium plan includes ~10,000 free characters per month with access to standard voices.", features: ["Ultra-realistic text-to-speech with natural emotion and pacing", "Support for 29+ languages and global accents", "Voice cloning and custom voice design tools", "Fast MP3 audio export ready for video editors"] },
    make: { bestFor: "Creators, marketers, and builders automating repetitive workflows between apps and AI models.", freeLimit: "Freemium plan includes 1,000 free operations/month and up to 2 active scenarios forever.", features: ["Visual drag-and-drop builder with 1,500+ app integrations", "Direct connectors for Gemini, OpenAI, Google Sheets, and social apps", "Real-time execution logs, routers, and conditional filters", "No coding needed for multi-step automations"] },
    jasper: { bestFor: "Marketing teams, bloggers, and copywriters creating brand-consistent articles, ads, and social posts.", freeLimit: "Free 7-day trial to test templates, brand voice settings, and long-form writing tools.", features: ["Custom Brand Voice memory to match your exact tone", "50+ templates for blogs, ads, emails, and product copy", "SEO-friendly long-form editor and campaign workflows", "Multi-language content generation for global audiences"] }
  };
  const key = Object.keys(presets).find((k) => slug.includes(k));
  const m = key ? presets[key] : null;
  const isFree = pricing.toLowerCase().includes("free") && !pricing.toLowerCase().includes("freemium");
  const bestFor = m ? m.bestFor : "Creators, students, and professionals looking for a reliable " + cat + " tool to save time and boost output.";
  const freeLimit = m ? m.freeLimit : isFree ? name + " is 100% Free, letting you use its core features directly without a paid subscription." : name + " uses a " + pricing + " model — start with its free tier or trial credits before upgrading.";
  const features = m ? m.features : ["Purpose-built AI workflow for " + cat + " tasks", "Clean browser-based interface ready to use immediately", "Automates repetitive manual steps to speed up your work", "Direct access via the Launch Tool button"];
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <section className="mt-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-left">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">{name} — Quick Overview & Guide</h2>
          <p className="text-xs text-slate-400 mt-1">Key details to help you decide if {name} fits your workflow.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800"><h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">Best For</h3><p className="text-sm text-slate-300 leading-relaxed">{bestFor}</p></div>
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800"><h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">Free Plan Limit ({pricing})</h3><p className="text-sm text-slate-300 leading-relaxed">{freeLimit}</p></div>
        </div>
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">Key Features</h3>
          <ul className="space-y-2 text-sm text-slate-300">{features.map((f, i) => (<li key={i} className="flex items-start gap-2.5"><span className="text-cyan-400 font-bold">✓</span><span>{f}</span></li>))}</ul>
        </div>
      </section>
    </div>
  );
}