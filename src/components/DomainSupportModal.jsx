"use client";
import { useState, useEffect } from "react";

const GUMROAD_SUPPORT_URL = "https://razaexpress6.gumroad.com/l/bvugf";

const BANK_DETAILS = [
  {
    id: "intl-bank",
    label: "Direct Bank Transfer (Wise / Remitly / RAAST)",
    bankName: "Allied Bank Limited (Pakistan)",
    accountTitle: "ALI RAZA",
    number: "PK09ABPA0010036228870013",
    swift: "ABPAPKKA",
    icon: "🏦",
  },
];

export default function DomainSupportModal() {
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-domain-support", openHandler);
    return () => window.removeEventListener("open-domain-support", openHandler);
  }, []);

  const handleCopy = async (id, text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {}
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100099] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0d1320] border border-slate-700 shadow-2xl overflow-hidden text-slate-100">
        <div className="px-5 py-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-purple-500/20 border-b border-slate-800 flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-1.5">
              🌐 Custom Domain Goal
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
              Support 786 AI Hub
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Pay any amount you wish to help us buy an official custom domain and keep AI tools free.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-blue-500/15 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-base shrink-0">
                💳
              </div>
              <div>
                <div className="text-xs font-extrabold text-white">
                  Pay Any Amount (Worldwide)
                </div>
                <div className="text-[11px] text-slate-300">
                  Debit Card • Credit Card • Apple Pay • Google Pay
                </div>
              </div>
            </div>
            <a
              href={GUMROAD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <span>💖 Support with Card (Any Amount) →</span>
            </a>
          </div>

          {BANK_DETAILS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-base shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {item.bankName} • {item.accountTitle}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#090d16] border border-slate-800/80">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase text-slate-400">IBAN</div>
                    <div className="font-mono text-xs text-cyan-300 select-all break-all">
                      {item.number}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${item.id}-iban`, item.number)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold shrink-0"
                  >
                    {copiedId === `${item.id}-iban` ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                {item.swift && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#090d16] border border-slate-800/80">
                    <div>
                      <div className="text-[10px] uppercase text-slate-400">SWIFT / BIC</div>
                      <div className="font-mono text-xs text-amber-300 select-all">
                        {item.swift}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${item.id}-swift`, item.swift)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold shrink-0"
                    >
                      {copiedId === `${item.id}-swift` ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3.5 bg-[#090d16] border-t border-slate-800/80 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            100% goes toward custom domain & hosting
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
