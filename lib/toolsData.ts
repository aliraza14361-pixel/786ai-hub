export interface ToolItem {
  slug: string;
  name: string;
  icon: string;
  rating: string;
  description: string;
  pricing: string;
  category: string;
  url: string;
  features: string[];
  pros: string[];
  cons: string[];
}

export const TOOLS_DATA: ToolItem[] = [
  // Writing & LLMs (7)
  {
    slug: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖',
    rating: '5.0',
    description: 'Advanced AI language model for interaction, creativity, and writing.',
    pricing: 'Freemium',
    category: 'Writing/LLMs',
    url: 'https://chatgpt.com/',
    features: ['GPT-4o reasoning capabilities', 'Voice & multimodal interaction', 'Custom GPTs creation', 'Code execution & data analysis'],
    pros: ['Extremely versatile across domain tasks', 'Fast response generation', 'Huge plugin & tool ecosystem'],
    cons: ['Requires Plus subscription for peak model access', 'Occasional hallucinations']
  },
  {
    slug: 'claude-ai',
    name: 'Claude AI',
    icon: '🧠',
    rating: '4.9',
    description: 'Next-gen assistant by Anthropic for long-context analysis and code.',
    pricing: 'Freemium',
    category: 'Writing/LLMs',
    url: 'https://claude.ai/',
    features: ['200K token context window', 'Artifacts interactive code preview', 'Nuanced prose writing', 'Doc & PDF analysis'],
    pros: ['Best-in-class coding & logic outputs', 'Natural tone', 'Excellent document parsing'],
    cons: ['Free tier rate limits apply quickly', 'No web search integration natively']
  },
  {
    slug: 'perplexity-ai',
    name: 'Perplexity AI',
    icon: '🔍',
    rating: '4.8',
    description: 'AI-powered live answer search engine with verifiable citations.',
    pricing: 'Freemium',
    category: 'Writing/LLMs',
    url: 'https://www.perplexity.ai/',
    features: ['Real-time web citations', 'Pro Search multi-step research', 'Collection spaces', 'Model switching (Claude/GPT-4)'],
    pros: ['Verifiable source citations', 'Replaces standard Google search', 'Clean UI'],
    cons: ['Requires Pro for full model choices', 'Can output niche indexing errors']
  },
  {
    slug: 'jasper-ai',
    name: 'Jasper AI',
    icon: '✍️',
    rating: '4.7',
    description: 'Enterprise-grade copywriter for blog posts and social marketing.',
    pricing: 'Paid',
    category: 'Writing/LLMs',
    url: 'https://www.jasper.ai/',
    features: ['Brand Voice training', 'SEO Mode integration', 'Marketing campaign workflows', 'Multi-channel assets'],
    pros: ['Tailored for marketing teams', 'Extensive copy templates', 'Built-in plagiarism checker'],
    cons: ['Higher price point', 'Steeper learning curve for solo creators']
  },
  {
    slug: 'notion-ai',
    name: 'Notion AI',
    icon: '📝',
    rating: '4.8',
    description: 'Integrated workspace assistant for notes, docs, and team tasks.',
    pricing: 'Paid',
    category: 'Writing/LLMs',
    url: 'https://www.notion.so/',
    features: ['Q&A across workspace docs', 'Automated page summaries', 'Drafting & rewriting assistant', 'Database autofill'],
    pros: ['Seamlessly embedded in Notion', 'Saves manual doc organization', 'Contextual workspace search'],
    cons: ['Add-on subscription fee per seat', 'Limited standalone prompt customization']
  },
  {
    slug: 'copy-ai',
    name: 'Copy.ai',
    icon: '📄',
    rating: '4.7',
    description: 'GTM & marketing copywriting platform for high-converting content.',
    pricing: 'Freemium',
    category: 'Writing/LLMs',
    url: 'https://www.copy.ai/',
    features: ['Go-To-Market AI OS', 'Automated sales outreach', 'Social post generation', 'Workflow builder'],
    pros: ['High converting sales copy', 'Simple UI for marketers', 'Good team collaboration tools'],
    cons: ['Requires fine-tuning for technical topics', 'Limited free plan word counts']
  },
  {
    slug: 'google-gemini',
    name: 'Google Gemini',
    icon: '✨',
    rating: '4.9',
    description: 'Multimodal AI assistant built by Google for reasoning & tasks.',
    pricing: 'Freemium',
    category: 'Writing/LLMs',
    url: 'https://gemini.google.com/',
    features: ['1M+ context window (Gemini 1.5 Pro)', 'Google Workspace deep integration', 'Native multimodal reasoning', 'YouTube & Maps extensions'],
    pros: ['Massive context window length', 'Free access to advanced features', 'Live Google ecosystem connection'],
    cons: ['Interface occasionally lags on huge uploads', 'Strict safety Guardrails']
  },

  // Image Generation (7)
  {
    slug: 'midjourney',
    name: 'Midjourney',
    icon: '🎨',
    rating: '4.9',
    description: 'Generative AI platform for photorealistic artwork generation.',
    pricing: 'Paid',
    category: 'Image',
    url: 'https://www.midjourney.com/',
    features: ['V6.1 hyper-realistic rendering', 'Web editor interface', 'Inpainting & Outpainting', 'Parameter tuning (--v, --ar)'],
    pros: ['Industry-leading aesthetic output', 'Exceptional lighting & texture detail', 'Active Discord community'],
    cons: ['No permanent free plan', 'Discord workflow can be messy for beginners']
  },
  {
    slug: 'leonardo-ai',
    name: 'Leonardo AI',
    icon: '🖼️',
    rating: '4.8',
    description: 'Production-quality visual assets and gaming graphics creator.',
    pricing: 'Freemium',
    category: 'Image',
    url: 'https://leonardo.ai/',
    features: ['Custom AI model training', 'Real-time Canvas generation', '3D texture creation', 'Motion generator'],
    pros: ['Daily free generation tokens', 'High control over art styles', 'Great for game developers'],
    cons: ['Credit system consumes tokens fast for high-res', 'Complex dashboard UI']
  },
  {
    slug: 'stable-diffusion',
    name: 'Stable Diffusion',
    icon: '🔮',
    rating: '4.8',
    description: 'Open-source latent image diffusion model by Stability AI.',
    pricing: '100% Free',
    category: 'Image',
    url: 'https://stability.ai/',
    features: ['Open-source weights', 'ControlNet pose guidance', 'LoRA fine-tuning support', 'Local execution support'],
    pros: ['100% free & open-source', 'Full privacy & zero censorship', 'Unlimited local generations'],
    cons: ['Requires powerful GPU setup', 'Technical installation process']
  },
  {
    slug: 'flux-1-ai',
    name: 'FLUX.1 AI',
    icon: '⚡',
    rating: '4.9',
    description: 'State-of-the-art open image model with supreme realism.',
    pricing: '100% Free',
    category: 'Image',
    url: 'https://blackforestlabs.ai/',
    features: ['12B parameter transformer model', 'Flawless typography in images', 'Photorealistic skin & anatomy', 'Schnell & Dev open weights'],
    pros: ['Rivals Midjourney v6 quality', 'Perfect text rendering inside photos', 'Open models available'],
    cons: ['Demands high VRAM for local execution', 'Commercial licensing tiers']
  },
  {
    slug: 'remove-bg',
    name: 'Remove.bg',
    icon: '🧼',
    rating: '4.9',
    description: 'Instant AI background removal for photos in 1-click.',
    pricing: '100% Free',
    category: 'Image',
    url: 'https://www.remove.bg/',
    features: ['1-click background eraser', 'API integration', 'Bulk image processing', 'Subject isolation'],
    pros: ['Lightning fast output', 'Handles hair & complex edges well', 'No login needed for basic edits'],
    cons: ['High-res exports require credits', 'Simple single-purpose utility']
  },
  {
    slug: 'photoroom',
    name: 'Photoroom',
    icon: '📸',
    rating: '4.8',
    description: 'Studio-quality photo editing & product image generator.',
    pricing: 'Freemium',
    category: 'Image',
    url: 'https://www.photoroom.com/',
    features: ['E-commerce product backgrounds', 'Batch shadow generation', 'Magic Eraser tool', 'Custom canvas templates'],
    pros: ['Best tool for online sellers & Amazon', 'Mobile & web cross-sync', 'Clean studio lighting filters'],
    cons: ['Watermark on free tier', 'Pro subscription for high-batch export']
  },
  {
    slug: 'canva-ai',
    name: 'Canva AI',
    icon: '🎨',
    rating: '4.7',
    description: 'Magic Studio suites for graphic creation, presentations & edits.',
    pricing: 'Freemium',
    category: 'Image',
    url: 'https://www.canva.com/',
    features: ['Magic Grab & Edit', 'Text-to-Image generator', 'AI Presentation maker', 'Magic Expand canvas'],
    pros: ['All-in-one graphic suite', 'Zero design skills required', 'Massive asset library'],
    cons: ['Output looks template-driven if unedited', 'Pro tier required for top AI tools']
  },

  // Video Synthesis (5)
  {
    slug: 'runway-gen-2',
    name: 'Runway Gen-2',
    icon: '🎬',
    rating: '4.8',
    description: 'Generative AI video suite transforming text and images into film clips.',
    pricing: 'Freemium',
    category: 'Video',
    url: 'https://runwayml.com/',
    features: ['Gen-2 & Gen-3 Alpha video synthesis', 'Motion Brush directional control', 'Camera control simulation', 'Lip-sync audio matching'],
    pros: ['Hollywood-grade cinematic quality', 'Granular motion control', 'Browser-based suite'],
    cons: ['Video credits burn rapidly', '4-second generation limits per render']
  },
  {
    slug: 'luma-dream-machine',
    name: 'Luma Dream Machine',
    icon: '✨',
    rating: '4.9',
    description: 'High-fidelity video synthesis powered by deep neural networks.',
    pricing: 'Freemium',
    category: 'Video',
    url: 'https://lumalabs.ai/',
    features: ['Realistic physics simulation', 'Keyframe-to-video morphing', 'Dynamic camera pans', 'High character consistency'],
    pros: ['Extremely accurate motion physics', 'Fast render times', 'Free monthly generation tier'],
    cons: ['Queue wait times during peak hours', 'Occasional distortion on fast movements']
  },
  {
    slug: 'capcut-ai',
    name: 'CapCut AI',
    icon: '📲',
    rating: '4.8',
    description: 'Smart video editor with automated captions, effects, and tracking.',
    pricing: '100% Free',
    category: 'Video',
    url: 'https://www.capcut.com/',
    features: ['Auto-caption generator', 'AI text-to-speech voices', 'Background remover', 'Auto-reframe 9:16'],
    pros: ['Essential for TikTok & Reels creators', '100% free feature access', 'Loaded with trending effects'],
    cons: ['Desktop app requires decent specs', 'Cloud sync limits on free accounts']
  },
  {
    slug: 'kling-ai',
    name: 'Kling AI',
    icon: '📽️',
    rating: '4.8',
    description: 'Advanced cinematic AI video generation engine.',
    pricing: 'Freemium',
    category: 'Video',
    url: 'https://klingai.com/',
    features: ['1080p 30fps video generation', 'Up to 2-minute video length support', 'Complex physics simulation', '3D spatial motion'],
    pros: ['Generates longer video clips', 'Realistic human motion', 'High resolution output'],
    cons: ['Phone verification required', 'Server queue during high traffic']
  },
  {
    slug: 'pika-ai',
    name: 'Pika AI',
    icon: '🎥',
    rating: '4.7',
    description: 'Idea-to-video platform bringing 3D animations and shots to life.',
    pricing: 'Freemium',
    category: 'Video',
    url: 'https://pika.art/',
    features: ['Pika 1.0 animation engine', 'Modify region (Inpaint)', 'Expand canvas ratio', 'Sound effect generation'],
    pros: ['Great for 3D cartoon & stylized videos', 'Easy region editing', 'Built-in audio effects'],
    cons: ['Photorealistic humans need fine-tuning', 'Free credits expire monthly']
  },

  // Audio (4)
  {
    slug: 'elevenlabs',
    name: 'ElevenLabs',
    icon: '🎙️',
    rating: '4.9',
    description: 'Human-quality AI voice synthesis, text-to-speech, and voice cloning.',
    pricing: 'Freemium',
    category: 'Audio',
    url: 'https://elevenlabs.io/',
    features: ['Instant voice cloning', 'Emotional inflection tuning', 'Multi-language dubbing', 'Voice Library marketplace'],
    pros: ['Undetectable natural voice realism', 'Supports 29+ languages', 'Low latency API'],
    cons: ['Free character quota is low', 'Voice cloning requires verification']
  },
  {
    slug: 'suno-ai',
    name: 'Suno AI',
    icon: '🎵',
    rating: '4.8',
    description: 'Generate complete songs with realistic vocals and instrumentals.',
    pricing: 'Freemium',
    category: 'Audio',
    url: 'https://suno.com/',
    features: ['Full 2-minute song synthesis', 'Custom lyrics support', 'Genre blending (Pop, Rock, EDM)', 'Stem isolation'],
    pros: ['Produces radio-ready song tracks', 'Simple prompt to music', '50 free daily credits'],
    cons: ['Commercial rights require paid plan', 'Occasional vocal artifacting']
  },
  {
    slug: 'voice-ai',
    name: 'Voice.ai',
    icon: '🎤',
    rating: '4.6',
    description: 'Real-time AI voice changer for streaming and gaming.',
    pricing: '100% Free',
    category: 'Audio',
    url: 'https://voice.ai/',
    features: ['Real-time voice modulation', 'Custom voice builder', 'Discord & Twitch integration', 'User-generated voice universe'],
    pros: ['Zero latency voice changing', 'Fun library of celebrity voices', 'Free to use'],
    cons: ['Installer requires software driver permissions', 'High CPU consumption']
  },
  {
    slug: 'udio',
    name: 'Udio',
    icon: '🎼',
    rating: '4.8',
    description: 'High-fidelity AI music creation & vocal song synthesis.',
    pricing: 'Freemium',
    category: 'Audio',
    url: 'https://www.udio.com/',
    features: ['High-fidelity audio production', 'Track extension & outro builder', 'Advanced genre control', 'Vocal harmony styling'],
    pros: ['Superior audio clarity & production quality', 'Extensible song structures', 'Generous beta tiers'],
    cons: ['Slightly more complex prompt controls', 'Longer generation wait times']
  },

  // Coding (5)
  {
    slug: 'cursor-editor',
    name: 'Cursor Editor',
    icon: '🚀',
    rating: '4.9',
    description: 'AI-first code editor designed for rapid full-stack engineering.',
    pricing: 'Freemium',
    category: 'Coding',
    url: 'https://cursor.com/',
    features: ['Repo-wide codebase indexing (@codebase)', 'Multi-file edits (Composer)', 'Terminal command debugging', 'Custom model choice (Claude 3.5 Sonnet)'],
    pros: ['10x speed boost for full-stack developers', 'Seamless VS Code fork transition', 'Best inline code suggestions'],
    cons: ['Requires Pro plan for heavy Claude 3.5 queries', 'Indexing large repos uses memory']
  },
  {
    slug: 'v0-dev',
    name: 'v0.dev',
    icon: '⚡',
    rating: '4.9',
    description: 'Generative UI system by Vercel for React and Tailwind components.',
    pricing: 'Freemium',
    category: 'Coding',
    url: 'https://v0.dev/',
    features: ['React + Tailwind CSS generation', 'Shadcn UI component output', 'Live interactive component preview', 'Figma to code conversion'],
    pros: ['Clean production-ready JSX code', 'Created by Vercel engineering team', 'Instant copy-paste code'],
    cons: ['Limited monthly generation credits', 'Focuses primarily on frontend UI']
  },
  {
    slug: 'codeium',
    name: 'Codeium',
    icon: '⌨️',
    rating: '4.8',
    description: 'Free AI code autocomplete extension supporting all modern IDEs.',
    pricing: '100% Free',
    category: 'Coding',
    url: 'https://codeium.com/',
    features: ['70+ programming languages supported', 'VS Code, JetBrains, Vim extensions', 'Codeium Windsurf IDE', 'Repository indexing'],
    pros: ['100% free for individual developers', 'Blazing fast auto-completion', 'Low latency latency'],
    cons: ['Context window smaller than Claude 3.5', 'Windsurf requires dedicated IDE download']
  },
  {
    slug: 'github-copilot',
    name: 'GitHub Copilot',
    icon: '💻',
    rating: '4.8',
    description: 'Your AI pair programmer integrated directly inside VS Code.',
    pricing: 'Paid',
    category: 'Coding',
    url: 'https://github.com/features/copilot',
    features: ['GitHub Copilot Chat', 'CLI terminal command explanations', 'Pull request summarization', 'Multi-file context'],
    pros: ['Native GitHub integration', 'Proven accuracy across repositories', 'Enterprise security compliance'],
    cons: ['Paid subscription required ($10/mo)', 'Can suggest legacy syntax if unguided']
  },
  {
    slug: 'replit-agent',
    name: 'Replit Agent',
    icon: '🤖',
    rating: '4.9',
    description: 'Autonomous coding agent for full application development.',
    pricing: 'Paid',
    category: 'Coding',
    url: 'https://replit.com/',
    features: ['Autonomous full-stack building', 'Database auto-provisioning', 'One-click cloud deployment', 'Natural language spec execution'],
    pros: ['Builds apps from simple text prompts', 'Zero local setup needed', 'Instant live deployments'],
    cons: ['Requires Replit Core membership', 'Can run into loops on complex backend logic']
  },

  // Automation (4)
  {
    slug: 'thunderbit',
    name: 'Thunderbit',
    icon: '🌐',
    rating: '4.7',
    description: 'No-code browser AI automation and web data scraping platform.',
    pricing: 'Freemium',
    category: 'Automation',
    url: 'https://www.thunderbit.com/',
    features: ['1-click web scraping', 'Subpage data extraction', 'Auto-filling web forms', 'Notion & Airtable export'],
    pros: ['No coding required for web scrapers', 'Browser extension convenience', 'Smart column mapping'],
    cons: ['Credits used fast on large multi-page scrapes', 'Needs page layout consistency']
  },
  {
    slug: 'n8n-io',
    name: 'n8n.io',
    icon: '⚙️',
    rating: '4.8',
    description: 'Fair-code workflow automation tool with native AI integrations.',
    pricing: '100% Free',
    category: 'Automation',
    url: 'https://n8n.io/',
    features: ['Self-hosted workflow engine', 'LangChain AI agent nodes', '400+ native app integrations', 'Visual node editor'],
    pros: ['100% free when self-hosted', 'Full data privacy & control', 'Advanced AI agent building'],
    cons: ['Requires server hosting setup (Docker/VPS)', 'Slightly higher technical entry bar']
  },
  {
    slug: 'make-com',
    name: 'Make.com',
    icon: '🔄',
    rating: '4.9',
    description: 'Visual automation platform connecting AI models to business apps.',
    pricing: 'Freemium',
    category: 'Automation',
    url: 'https://www.make.com/',
    features: ['Visual drag-and-drop scenario builder', 'OpenAI & Claude API modules', 'Webhooks & JSON parsing', 'Error handling routes'],
    pros: ['Highly visual scenario workflow', 'Affordable plan limits', 'Powerful data transformation options'],
    cons: ['Learning curve for data mapping', 'Execution operations cap on free plan']
  },
  {
    slug: 'zapier-ai',
    name: 'Zapier AI',
    icon: '⚡',
    rating: '4.8',
    description: 'Automate workflows across 7,000+ business applications.',
    pricing: 'Freemium',
    category: 'Automation',
    url: 'https://zapier.com/',
    features: ['7,000+ app integrations', 'Zapier Central AI bots', 'Canvas workflow planner', 'Tables database system'],
    pros: ['Largest app ecosystem in the world', 'Easiest setup for non-technical users', 'Reliable execution'],
    cons: ['Expensive premium pricing tiers', 'Single task steps consume credits quickly']
  }
];

export function getToolBySlug(slug: string): ToolItem | undefined {
  return TOOLS_DATA.find((t) => t.slug.toLowerCase() === slug.toLowerCase());
}
