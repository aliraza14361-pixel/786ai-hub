import Link from 'next/link';

const CATEGORIES = [
  { name: 'Writing & LLMs', icon: '🤖', count: 7, desc: 'ChatGPT, Claude, Gemini, Notion AI & Copywriting assistants.' },
  { name: 'Image Generation', icon: '🎨', count: 7, desc: 'Midjourney, Stable Diffusion, Flux.1, Leonardo & Photoroom.' },
  { name: 'Video Synthesis', icon: '🎬', count: 5, desc: 'Runway Gen-2, Luma Dream Machine, CapCut & Pika AI.' },
  { name: 'Audio & Music', icon: '🎙️', count: 4, desc: 'ElevenLabs voice cloning, Suno AI music & Udio song synthesis.' },
  { name: 'Coding & Dev Tools', icon: '🚀', count: 5, desc: 'Cursor Editor, Vercel v0, Codeium & GitHub Copilot.' },
  { name: 'Automation Workflows', icon: '⚙️', count: 4, desc: 'n8n.io, Make.com, Thunderbit & Zapier AI automation.' },
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

export default function CategoriesPage() {
  return (
    <div className="py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Explore AI Tool Categories</h1>
        <p className="text-slate-400">Browse curated artificial intelligence tools by workflow specialization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, i) => (
          <Link key={i} href={`/#tools`} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition">
            <span className="text-4xl">{cat.icon}</span>
            <h2 className="text-xl font-bold text-white mt-4">{cat.name}</h2>
            <p className="text-xs text-cyan-400 font-medium mt-1">{cat.count} Live Tools</p>
            <p className="text-sm text-slate-400 mt-2">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
