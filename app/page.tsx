import ToolDirectory from '../components/ToolDirectory';

const SAMPLE_TOOLS = [
  { name: 'ChatGPT', icon: '🤖', rating: '5.0', description: 'Advanced AI language model for interaction, creativity, and writing.', pricing: 'Freemium', category: 'Writing/LLMs', url: 'https://chatgpt.com/' },
  { name: 'Claude AI', icon: '🧠', rating: '4.9', description: 'Next-gen assistant by Anthropic for long-context analysis and code.', pricing: 'Freemium', category: 'Writing/LLMs', url: 'https://claude.ai/' },
  { name: 'Perplexity AI', icon: '🔍', rating: '4.8', description: 'AI-powered live answer search engine with verifiable citations.', pricing: 'Freemium', category: 'Writing/LLMs', url: 'https://www.perplexity.ai/' },
  { name: 'Midjourney', icon: '🎨', rating: '4.9', description: 'Generative AI platform for photorealistic artwork generation.', pricing: 'Paid', category: 'Image', url: 'https://www.midjourney.com/' },
  { name: 'Cursor Editor', icon: '🚀', rating: '4.9', description: 'AI-first code editor designed for rapid full-stack engineering.', pricing: 'Freemium', category: 'Coding', url: 'https://cursor.com/' }
];

export default function HomePage() {
  return (
    <div className="py-6">
      <section className="text-center my-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Unleash the <span className="text-cyan-400">Power of AI</span>
        </h1>
        <p className="text-slate-400">Global Tools Directory, Native Processors & Automation Studio.</p>
      </section>
      <ToolDirectory tools={SAMPLE_TOOLS} />
    </div>
  );
}
