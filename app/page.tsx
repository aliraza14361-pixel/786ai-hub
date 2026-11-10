import ToolDirectory from '../components/ToolDirectory';

const TOOLS_DATA = [
  { name: 'ChatGPT', icon: '🤖', rating: '5.0', description: 'Advanced AI language model for interaction, creativity, and writing.', pricing: 'Freemium', category: 'Writing/LLMs', url: 'https://chatgpt.com/' },
  { name: 'Claude AI', icon: '🧠', rating: '4.9', description: 'Next-gen assistant by Anthropic for long-context analysis and code.', pricing: 'Freemium', category: 'Writing/LLMs', url: 'https://claude.ai/' },
  { name: 'Perplexity AI', icon: '🔍', rating: '4.8', description: 'AI-powered live answer search engine with verifiable citations.', pricing: 'Freemium', category: 'Writing/LLMs', url: 'https://www.perplexity.ai/' },
  { name: 'Jasper AI', icon: '✍️', rating: '4.7', description: 'Enterprise-grade copywriter for blog posts and social marketing.', pricing: 'Paid', category: 'Writing/LLMs', url: 'https://www.jasper.ai/' },
  { name: 'Midjourney', icon: '🎨', rating: '4.9', description: 'Generative AI platform for photorealistic artwork generation.', pricing: 'Paid', category: 'Image', url: 'https://www.midjourney.com/' },
  { name: 'Leonardo AI', icon: '🖼️', rating: '4.8', description: 'Production-quality visual assets and gaming graphics creator.', pricing: 'Freemium', category: 'Image', url: 'https://leonardo.ai/' },
  { name: 'Stable Diffusion', icon: '🔮', rating: '4.8', description: 'Open-source latent image diffusion model by Stability AI.', pricing: '100% Free', category: 'Image', url: 'https://stability.ai/' },
  { name: 'FLUX.1 AI', icon: '⚡', rating: '4.9', description: 'State-of-the-art open image model with supreme realism.', pricing: '100% Free', category: 'Image', url: 'https://blackforestlabs.ai/' },
  { name: 'Remove.bg', icon: '🧼', rating: '4.9', description: 'Instant AI background removal for photos in 1-click.', pricing: '100% Free', category: 'Image', url: 'https://www.remove.bg/' },
  { name: 'Runway Gen-2', icon: '🎬', rating: '4.8', description: 'Generative AI video suite transforming text and images into film clips.', pricing: 'Freemium', category: 'Video', url: 'https://runwayml.com/' },
  { name: 'Luma Dream Machine', icon: '✨', rating: '4.9', description: 'High-fidelity video synthesis powered by deep neural networks.', pricing: 'Freemium', category: 'Video', url: 'https://lumalabs.ai/' },
  { name: 'CapCut AI', icon: '📲', rating: '4.8', description: 'Smart video editor with automated captions, effects, and tracking.', pricing: '100% Free', category: 'Video', url: 'https://www.capcut.com/' },
  { name: 'ElevenLabs', icon: '🎙️', rating: '4.9', description: 'Human-quality AI voice synthesis, text-to-speech, and voice cloning.', pricing: 'Freemium', category: 'Audio', url: 'https://elevenlabs.io/' },
  { name: 'Suno AI', icon: '🎵', rating: '4.8', description: 'Generate complete songs with realistic vocals and instrumentals.', pricing: 'Freemium', category: 'Audio', url: 'https://suno.com/' },
  { name: 'Voice.ai', icon: '🎤', rating: '4.6', description: 'Real-time AI voice changer for streaming and gaming.', pricing: '100% Free', category: 'Audio', url: 'https://voice.ai/' },
  { name: 'v0.dev', icon: '⚡', rating: '4.9', description: 'Generative UI system by Vercel for React and Tailwind components.', pricing: 'Freemium', category: 'Coding', url: 'https://v0.dev/' },
  { name: 'Codeium', icon: '⌨️', rating: '4.8', description: 'Free AI code autocomplete extension supporting all modern IDEs.', pricing: '100% Free', category: 'Coding', url: 'https://codeium.com/' },
  { name: 'Cursor Editor', icon: '🚀', rating: '4.9', description: 'AI-first code editor designed for rapid full-stack engineering.', pricing: 'Freemium', category: 'Coding', url: 'https://cursor.com/' },
  { name: 'Thunderbit', icon: '🌐', rating: '4.7', description: 'No-code browser AI automation and web data scraping platform.', pricing: 'Freemium', category: 'Automation', url: 'https://www.thunderbit.com/' },
  { name: 'n8n.io', icon: '⚙️', rating: '4.8', description: 'Fair-code workflow automation tool with native AI integrations.', pricing: '100% Free', category: 'Automation', url: 'https://n8n.io/' },
  { name: 'Make.com', icon: '🔄', rating: '4.9', description: 'Visual automation platform connecting AI models to business apps.', pricing: 'Freemium', category: 'Automation', url: 'https://www.make.com/' }
];

export default function HomePage() {
  return (
    <div className="py-8 space-y-10">
      {/* Hero Banner */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Unleash the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Power of AI.</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Global Tools Directory, Native Processors & Automation Studio.
        </p>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
        <div>
          <p className="text-slate-400 text-xs">Affiliate Traffic</p>
          <p className="text-2xl font-bold text-cyan-400">18.4K</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Unique Clicks</p>
          <p className="text-2xl font-bold text-white">12.8K</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Approved Leads</p>
          <p className="text-2xl font-bold text-white">2.6K</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Conversion Rate</p>
          <p className="text-2xl font-bold text-emerald-400">7.3%</p>
        </div>
      </section>

      {/* Tools Directory & Dynamic Filters */}
      <ToolDirectory tools={TOOLS_DATA} />
    </div>
  );
}
