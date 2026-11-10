'use client';

interface SocialShareProps {
  title: string;
  slug: string;
}

export default function SocialShare({ title, slug }: SocialShareProps) {
  const fullUrl = `https://786ai-hub.vercel.app/tool/${slug}`;
  const shareText = encodeURIComponent(`Check out ${title} on 786 AI Hub!`);
  const shareUrl = encodeURIComponent(fullUrl);

  const platforms = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      href: `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`,
    },
    {
      name: 'X',
      icon: '𝕏',
      color: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700',
      href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    },
    {
      name: 'Threads',
      icon: '🌀',
      color: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700',
      href: `https://www.threads.net/intent/post?text=${shareText}%20${shareUrl}`,
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700 hover:bg-blue-600 text-white',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
  ];

  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Share this AI Tool</p>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${platform.color}`}
          >
            <span>{platform.icon}</span>
            <span>{platform.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
