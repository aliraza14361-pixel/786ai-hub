"use client";
import { useState, useEffect } from "react";

const PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook Page",
    handle: "Follow on Facebook",
    reward: 5,
    url: "https://www.facebook.com/share/1E36qmfERf/",
    icon: "📘"
  },
  {
    id: "youtube",
    name: "YouTube Channel",
    handle: "Subscribe on YouTube",
    reward: 5,
    url: "https://www.youtube.com",
    icon: "▶️"
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "Follow on Instagram",
    reward: 5,
    url: "https://www.instagram.com",
    icon: "📸"
  },
  {
    id: "tiktok",
    name: "TikTok",
    handle: "Follow on TikTok",
    reward: 5,
    url: "https://www.tiktok.com",
    icon: "🎵"
  }
];

export default function SocialRewardModal() {
  const [open, setOpen] = useState(false);
  const [claimed, setClaimed] = useState([]);
  const [verifying, setVerifying] = useState(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    try {
      const savedClaimed = JSON.parse(localStorage.getItem("786ai_claimed_socials") || "[]");
      const savedCredits = Number(localStorage.getItem("786ai_bonus_credits") || "0");
      setClaimed(Array.isArray(savedClaimed) ? savedClaimed : []);
      setCredits(savedCredits);

      const hasAuth = Object.keys(localStorage).some(
        (k) => k.startsWith("sb-") && k.endsWith("-auth-token") && localStorage.getItem(k)
      );
      const alreadyPrompted = localStorage.getItem("786ai_reward_prompted");
      if (hasAuth && !alreadyPrompted && savedClaimed.length < PLATFORMS.length) {
        const timer = setTimeout(() => {
          setOpen(true);
          localStorage.setItem("786ai_reward_prompted", "1");
        }, 1400);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleFollowAndClaim = (platform) => {
    if (claimed.includes(platform.id) || verifying === platform.id) return;
    window.open(platform.url, "_blank", "noopener,noreferrer");
    setVerifying(platform.id);

    setTimeout(() => {
      setClaimed((prev) => {
        if (prev.includes(platform.id)) return prev;
        const nextClaimed = [...prev, platform.id];
        const nextCredits = nextClaimed.length * 5;
        setCredits(nextCredits);
        try {
          localStorage.setItem("786ai_claimed_socials", JSON.stringify(nextClaimed));
          localStorage.setItem("786ai_bonus_credits", String(nextCredits));
          window.dispatchEvent(
            new CustomEvent("786ai-credits-updated", { detail: { credits: nextCredits } })
          );
        } catch {}
        return nextClaimed;
      });
      setVerifying(null);
    }, 2800);
  };

  const maxCredits = PLATFORMS.length * 5;
  const remainingCredits = Math.max(0, maxCredits - credits);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-[9990] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111827]/95 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-[11px] font-extrabold shadow-lg backdrop-blur-xs transition"
      >
        <span>🎁</span>
        <span>
          {remainingCredits > 0 ? "+" + remainingCredits + " Free Credits" : credits + " Bonus Credits"}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[10080] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0d1320] border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
            <div className="px-5 py-4 bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-blue-600/15 border-b border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1.5">
                  🎁 Community Reward
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  Follow &amp; Unlock +{maxCredits} Studio Credits
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Follow our official channels to claim extra free AI chat &amp; image credits in 786AI Studio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-3 bg-[#090d16] border-b border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Unlocked Studio Bonus:</span>
              <span className="font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                ✨ {credits} / {maxCredits} Credits Active
              </span>
            </div>

            <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
              {PLATFORMS.map((p) => {
                const isClaimed = claimed.includes(p.id);
                const isVerifying = verifying === p.id;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/90"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0">
                        {p.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{p.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{p.handle}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isClaimed || isVerifying}
                      onClick={() => handleFollowAndClaim(p)}
                      className={
                        isClaimed
                          ? "px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold shrink-0"
                          : isVerifying
                          ? "px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[11px] font-bold animate-pulse shrink-0"
                          : "px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white text-[11px] font-extrabold shadow-sm shrink-0 transition"
                      }
                    >
                      {isClaimed
                        ? "✓ +" + p.reward + " Claimed"
                        : isVerifying
                        ? "Verifying..."
                        : "Follow +" + p.reward}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3.5 bg-[#090d16] border-t border-slate-800/80 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Credits apply automatically in Studio
              </span>
              <a
                href="/studio"
                onClick={() => setOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition"
              >
                Open 786AI Studio →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
