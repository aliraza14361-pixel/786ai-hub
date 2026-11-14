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
  { id: '32', name: 'Make.com', description: 'Visual automation platform connecting AI models to business apps.', category: 'AI Automation', rating: '4.9', pricing: 'Freemium', icon: '🔄', url: 'https://make.com' },
  {"id":"33","name":"NotebookLM","description":"100% free AI research assistant and study guide generator by Google for summarizing PDFs, notes, and YouTube videos with audio overviews.","category":"Text & Writing","rating":"4.9","pricing":"Free","icon":"📓","url":"https://notebooklm.google.com"},
  {"id":"34","name":"DeepSeek AI","description":"Free open-weight AI chatbot and reasoning assistant for coding, math problem solving, and long-form writing with zero daily paywall.","category":"Text & Writing","rating":"4.8","pricing":"Free","icon":"🐋","url":"https://chat.deepseek.com"},
  {"id":"35","name":"Gamma AI","description":"Free AI presentation maker and slide deck generator that turns text prompts and notes into clean visual slides in seconds.","category":"Text & Writing","rating":"4.8","pricing":"Freemium","icon":"📊","url":"https://gamma.app"},
  {"id":"36","name":"Photopea AI","description":"100% free online photo editor and Photoshop alternative in your browser with AI magic replace, background removal, and PSD support.","category":"Image & Design","rating":"4.8","pricing":"Free","icon":"🎨","url":"https://www.photopea.com"},
  {"id":"37","name":"Napkin AI","description":"Free AI diagram and infographic generator that transforms plain text articles and notes into clean visual charts for creators.","category":"Image & Design","rating":"4.8","pricing":"Freemium","icon":"✏️","url":"https://www.napkin.ai"},
  {"id":"38","name":"Recraft AI","description":"Free AI vector art, logo, and icon generator with crisp text rendering and consistent brand styles for graphic designers.","category":"Image & Design","rating":"4.8","pricing":"Freemium","icon":"🖌️","url":"https://www.recraft.ai"},
  {"id":"39","name":"Kling AI","description":"High-realism AI video generator with free daily credits for turning text prompts and still images into smooth 1080p video clips.","category":"Video Generation","rating":"4.8","pricing":"Freemium","icon":"🎬","url":"https://klingai.com"},
  {"id":"40","name":"Hailuo AI","description":"Free-tier text-to-video and image-to-video AI generator built for lifelike character motion and faceless YouTube storytelling.","category":"Video Generation","rating":"4.7","pricing":"Freemium","icon":"🎥","url":"https://hailuoai.video"},
  {"id":"41","name":"Vizard AI","description":"Free AI video clipper that automatically turns long YouTube videos and podcasts into viral TikTok, Reels, and Shorts with captions.","category":"Video Generation","rating":"4.7","pricing":"Freemium","icon":"✂️","url":"https://vizard.ai"},
  {"id":"42","name":"Udio AI","description":"Free-tier AI music and song generator creating studio-quality vocals, background tracks, and custom lyrics from simple text prompts.","category":"Voice & Music","rating":"4.8","pricing":"Freemium","icon":"🎶","url":"https://www.udio.com"},
  {"id":"43","name":"Adobe Podcast AI","description":"Free AI voice enhancer and background noise remover that makes mobile phone recordings sound like a professional studio mic.","category":"Voice & Music","rating":"4.8","pricing":"Freemium","icon":"🎙️","url":"https://podcast.adobe.com"},
  {"id":"44","name":"TTSMaker","description":"100% free text-to-speech AI voice generator supporting 100+ languages with commercial usage rights and instant MP3 download.","category":"Voice & Music","rating":"4.7","pricing":"Free","icon":"🔊","url":"https://ttsmaker.com"},
  {"id":"45","name":"Bolt.new","description":"Free-tier AI full-stack web app builder that generates, runs, and deploys Next.js and React projects directly in your browser.","category":"Coding Tools","rating":"4.9","pricing":"Freemium","icon":"⚡","url":"https://bolt.new"},
  {"id":"46","name":"Windsurf Editor","description":"Agentic AI code editor with generous free autocomplete and multi-file editing built for fast web and mobile app development.","category":"Coding Tools","rating":"4.8","pricing":"Freemium","icon":"🏄","url":"https://codeium.com/windsurf"},
  {"id":"47","name":"GroqCloud","description":"Ultra-fast AI inference platform with a free API tier for running Llama, Whisper, and open-source models at lightning speed.","category":"Coding Tools","rating":"4.9","pricing":"Freemium","icon":"🚀","url":"https://console.groq.com"},
  {"id":"48","name":"Notion AI","description":"All-in-one AI workspace and note-taking app with a free plan for organizing projects, docs, tasks, and knowledge bases.","category":"Automation & Business","rating":"4.8","pricing":"Freemium","icon":"📝","url":"https://www.notion.so"},
  {"id":"49","name":"Tally Forms AI","description":"100% free online form and survey builder with unlimited forms, unlimited submissions, and smart logic for creators and startups.","category":"Automation & Business","rating":"4.9","pricing":"Free","icon":"📋","url":"https://tally.so"},
  {"id":"50","name":"Zapier Free","description":"No-code AI workflow automation tool with a free forever tier connecting 7,000+ apps like Gmail, Google Sheets, and Slack.","category":"Automation & Business","rating":"4.8","pricing":"Freemium","icon":"🔗","url":"https://zapier.com"}
];

export async function GET() {
  return Response.json(FULL_MASTER_DATA, {
    headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
  });
}
