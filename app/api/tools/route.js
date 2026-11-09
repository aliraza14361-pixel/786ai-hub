export const dynamic = 'force-dynamic';

const FULL_MASTER_DATA = [
  // Text & Writing (15 Tools)
  { id: '1', name: 'ChatGPT', description: 'Advanced AI language model for writing, coding, and logical reasoning.', category: 'Text & Writing', rating: '5.0', pricing: 'Freemium', icon: '🤖', url: 'https://chatgpt.com' },
  { id: '2', name: 'Claude AI', description: 'Next-gen assistant by Anthropic for long-context analysis and code.', category: 'Text & Writing', rating: '4.9', pricing: 'Freemium', icon: '🧠', url: 'https://claude.ai' },
  { id: '3', name: 'Perplexity AI', description: 'AI-powered live answer search engine with verifiable citations.', category: 'Text & Writing', rating: '4.8', pricing: 'Freemium', icon: '🔍', url: 'https://www.perplexity.ai' },
  { id: '4', name: 'Gemini', description: 'Google powerful multimodal AI model for writing, reasoning, and research.', category: 'Text & Writing', rating: '4.9', pricing: 'Freemium', icon: '✨', url: 'https://gemini.google.com' },
  { id: '5', name: 'Jasper AI', description: 'Enterprise-grade copywriter for blog posts and social marketing.', category: 'Text & Writing', rating: '4.7', pricing: 'Paid', icon: '✍️', url: 'https://jasper.ai' },
  { id: '6', name: 'Copy.ai', description: 'AI copywriting tool for social media posts, ads, and email campaigns.', category: 'Text & Writing', rating: '4.7', pricing: 'Freemium', icon: '📝', url: 'https://copy.ai' },
  { id: '7', name: 'Writesonic', description: 'Generative AI platform for SEO articles and content creation.', category: 'Text & Writing', rating: '4.6', pricing: 'Freemium', icon: '🚀', url: 'https://writesonic.com' },
  { id: '8', name: 'Rytr', description: 'AI assistant that generates high-quality content in seconds.', category: 'Text & Writing', rating: '4.5', pricing: 'Freemium', icon: '🖋️', url: 'https://rytr.me' },
  { id: '9', name: 'Grammarly AI', description: 'AI writing assistant for grammar, tone rewrite, and clarity.', category: 'Text & Writing', rating: '4.8', pricing: 'Freemium', icon: '✅', url: 'https://grammarly.com' },
  { id: '10', name: 'QuillBot', description: 'AI paraphrasing tool and grammar checker for smart rewriting.', category: 'Text & Writing', rating: '4.7', pricing: 'Freemium', icon: '🪶', url: 'https://quillbot.com' },

  // Image & Design (15 Tools)
  { id: '11', name: 'Midjourney', description: 'Generative AI platform for photorealistic artwork generation.', category: 'Image Generator', rating: '4.9', pricing: 'Paid', icon: '🎨', url: 'https://midjourney.com' },
  { id: '12', name: 'Leonardo AI', description: 'Production-quality visual assets and gaming graphics creator.', category: 'Image Generator', rating: '4.8', pricing: 'Freemium', icon: '🖼️', url: 'https://leonardo.ai' },
  { id: '13', name: 'Canva Magic', description: 'AI-driven graphics tool with auto background removal and edit.', category: 'Image Generator', rating: '4.7', pricing: 'Freemium', icon: '✨', url: 'https://canva.com' },
  { id: '14', name: 'DALL-E 3', description: 'OpenAI state-of-the-art text-to-image generator.', category: 'Image Generator', rating: '4.8', pricing: 'Paid', icon: '👁️', url: 'https://openai.com/dall-e-3' },
  { id: '15', name: 'Stable Diffusion', description: 'Open-source latent image diffusion model by Stability AI.', category: 'Image Generator', rating: '4.8', pricing: 'Free', icon: '🔮', url: 'https://stability.ai' },
  { id: '16', name: 'FLUX.1 AI', description: 'State-of-the-art open image model with supreme realism.', category: 'Image Generator', rating: '4.9', pricing: 'Free', icon: '⚡', url: 'https://blackforestlabs.ai' },
  { id: '17', name: 'Remove.bg', description: 'Instant AI background removal for photos in 1-click.', category: 'Image Generator', rating: '4.9', pricing: 'Free', icon: '🧼', url: 'https://remove.bg' },
  { id: '18', name: 'Ideogram AI', description: 'AI image generator famous for reliable typography in images.', category: 'Image Generator', rating: '4.8', pricing: 'Freemium', icon: '🔤', url: 'https://ideogram.ai' },

  // Video Generation (15 Tools)
  { id: '19', name: 'Runway Gen-2', description: 'Generative AI video suite transforming text and images into film clips.', category: 'Video Generator', rating: '4.8', pricing: 'Freemium', icon: '🎥', url: 'https://runwayml.com' },
  { id: '20', name: 'Luma Dream Machine', description: 'High-fidelity video synthesis powered by deep neural networks.', category: 'Video Generator', rating: '4.9', pricing: 'Freemium', icon: '🎬', url: 'https://lumalabs.ai/dream-machine' },
  { id: '21', name: 'CapCut AI', description: 'Smart video editor with automated captions, effects, and tracking.', category: 'Video Generator', rating: '4.8', pricing: 'Free', icon: '📲', url: 'https://capcut.com' },
  { id: '22', name: 'Pika Labs', description: 'Idea-to-video platform for 3D animation and cinematic outputs.', category: 'Video Generator', rating: '4.8', pricing: 'Freemium', icon: '🍿', url: 'https://pika.art' },
  { id: '23', name: 'HeyGen', description: 'AI avatar video generator for automated video localization.', category: 'Video Generator', rating: '4.8', pricing: 'Freemium', icon: '🗣️', url: 'https://heygen.com' },

  // Voice & Music (10 Tools)
  { id: '24', name: 'ElevenLabs', description: 'Human-quality AI voice synthesis, text-to-speech, and voice cloning.', category: 'Voice & Music', rating: '4.9', pricing: 'Freemium', icon: '🎙️', url: 'https://elevenlabs.io' },
  { id: '25', name: 'Suno AI', description: 'Generate complete songs with realistic vocals and instrumentals.', category: 'Voice & Music', rating: '4.8', pricing: 'Freemium', icon: '🎵', url: 'https://suno.com' },
  { id: '26', name: 'Voice.ai', description: 'Real-time AI voice changer for streaming and gaming.', category: 'Voice & Music', rating: '4.6', pricing: 'Free', icon: '🎤', url: 'https://voice.ai' },

  // Coding Tools (10 Tools)
  { id: '27', name: 'v0.dev', description: 'Generative UI system by Vercel for React and Tailwind components.', category: 'Coding Tools', rating: '4.9', pricing: 'Freemium', icon: '⚡', url: 'https://v0.dev' },
  { id: '28', name: 'Codeium', description: 'Free AI code autocomplete extension supporting all modern IDEs.', category: 'Coding Tools', rating: '4.8', pricing: 'Free', icon: '⌨️', url: 'https://codeium.com' },
  { id: '29', name: 'Cursor Editor', description: 'AI-first code editor designed for rapid full-stack engineering.', category: 'Coding Tools', rating: '4.9', pricing: 'Freemium', icon: '🚀', url: 'https://cursor.com' },

  // Automation & Business (10 Tools)
  { id: '30', name: 'Thunderbit', description: 'No-code browser AI automation and web data scraping platform.', category: 'AI Automation', rating: '4.7', pricing: 'Freemium', icon: '🌐', url: 'https://thunderbit.com' },
  { id: '31', name: 'n8n.io', description: 'Fair-code workflow automation tool with native AI integrations.', category: 'AI Automation', rating: '4.8', pricing: 'Free', icon: '⚙️', url: 'https://n8n.io' },
  { id: '32', name: 'Make.com', description: 'Visual automation platform connecting AI models to business apps.', category: 'AI Automation', rating: '4.9', pricing: 'Freemium', icon: '🔄', url: 'https://make.com' }
];

export async function GET() {
  return Response.json(FULL_MASTER_DATA, {
    headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
  });
}
