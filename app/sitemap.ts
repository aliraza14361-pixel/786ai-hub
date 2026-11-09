import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://786ai-hub.vercel.app'
  
  const tools = [
    'chatgpt', 'claude-ai', 'perplexity-ai', 'gemini', 'jasper-ai', 'copy-ai', 
    'writesonic', 'rytr', 'grammarly-ai', 'quillbot', 'midjourney', 'leonardo-ai', 
    'canva-magic', 'dall-e-3', 'stable-diffusion', 'flux-1-ai', 'remove-bg', 
    'ideogram-ai', 'runway-gen-2', 'luma-dream-machine', 'capcut-ai', 'pika-labs', 
    'heygen', 'elevenlabs', 'suno-ai', 'voice-ai', 'v0-dev', 'codeium', 
    'cursor-editor', 'thunderbit', 'n8n-io', 'make-com'
  ]

  const categories = [
    'text-writing', 'image-generator', 'video-generator', 
    'voice-music', 'coding-tools', 'ai-automation'
  ]

  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...categoryUrls,
    ...toolUrls,
  ]
}
