import { NextResponse } from "next/server";

export const maxDuration = 60;

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 16000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function urlToDataUrl(imageUrl: string, timeoutMs = 16000): Promise<string | null> {
  try {
    const imgRes = await fetchWithTimeout(
      imageUrl,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; 786AIHub/1.0)" } },
      timeoutMs
    );
    if (!imgRes.ok) return null;
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return null;
    const arrayBuf = await imgRes.arrayBuffer();
    if (arrayBuf.byteLength < 2000) return null;
    const b64 = Buffer.from(arrayBuf).toString("base64");
    return `data:${contentType};base64,${b64}`;
  } catch {
    return null;
  }
}

async function generateFreeHuggingFaceFrame(
  hfToken: string,
  scenePrompt: string
): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Photorealistic cinematic movie frame, 4k ultra detailed, no text: ${scenePrompt}`,
        }),
      },
      18000
    );
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return null;
    const arrayBuf = await res.arrayBuffer();
    if (arrayBuf.byteLength < 2000) return null;
    return `data:${contentType};base64,${Buffer.from(arrayBuf).toString("base64")}`;
  } catch {
    return null;
  }
}

async function generateFreeFluxFrame(
  scenePrompt: string,
  aspectRatio: string,
  seed: number
): Promise<string | null> {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";
  const width = isPortrait ? 576 : isSquare ? 768 : 1024;
  const height = isPortrait ? 1024 : isSquare ? 768 : 576;
  const encoded = encodeURIComponent(scenePrompt);

  const endpoints = [
    `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`,
    `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed + 19}&model=turbo&nologo=true`,
  ];

  for (const url of endpoints) {
    const dataUrl = await urlToDataUrl(url, 16000);
    if (dataUrl) return dataUrl;
  }
  return null;
}

async function generateFreeGeminiSvgScenes(
  apiKey: string,
  prompt: string,
  aspectRatio: string
): Promise<string[]> {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const vb = isPortrait ? "0 0 720 1280" : "0 0 1280 720";

  for (const textModel of ["gemini-2.5-flash", "gemini-2.5-flash-lite"]) {
    try {
      const instruction = `Create 3 distinct, richly detailed SVG movie storyboard frames depicting: "${prompt}".
Shot 1: Wide establishing scene.
Shot 2: Closer dynamic action shot with movement.
Shot 3: Dramatic golden-hour closing shot.
Return ONLY valid JSON: {"scenes": ["<svg ...>...</svg>", "<svg ...>...</svg>", "<svg ...>...</svg>"]}.
Each SVG must include xmlns="http://www.w3.org/2000/svg" and viewBox="${vb}", multi-stop <defs> gradients, detailed foreground subjects matching "${prompt}", shadows, and lighting glows.`;

      const res = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${textModel}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: instruction }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        },
        15000
      );

      if (!res.ok) continue;
      const data = await res.json();
      const rawText: string =
        data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";

      const parsed = JSON.parse(rawText);
      const list: string[] = Array.isArray(parsed?.scenes) ? parsed.scenes : [];
      const svgDataUrls: string[] = [];

      for (const rawSvg of list.slice(0, 3)) {
        if (typeof rawSvg === "string" && rawSvg.includes("<svg")) {
          const cleanSvg = rawSvg.includes("xmlns=")
            ? rawSvg
            : rawSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
          const b64 = Buffer.from(cleanSvg, "utf8").toString("base64");
          svgDataUrls.push(`data:image/svg+xml;base64,${b64}`);
        }
      }

      if (svgDataUrls.length > 0) return svgDataUrls;
    } catch {
      // Try next free model
    }
  }
  return [];
}

function buildLocalCinematicSvgScenes(prompt: string, aspectRatio: string): string[] {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const w = isPortrait ? 720 : 1280;
  const h = isPortrait ? 1280 : 720;
  const lower = prompt.toLowerCase();

  const isNature = /forest|lion|tiger|jungle|tree|nature|mountain|bird|river/.test(lower);
  const palettes = isNature
    ? [
        ["#064e3b", "#059669", "#fbbf24"],
        ["#022c22", "#047857", "#f59e0b"],
        ["#14532d", "#15803d", "#fde047"],
      ]
    : [
        ["#090d16", "#1e1b4b", "#38bdf8"],
        ["#0f172a", "#312e81", "#f43f5e"],
        ["#020617", "#1d4ed8", "#22d3ee"],
      ];

  return palettes.map(([c1, c2, glow], idx) => {
    const sunX = Math.round(w * (0.28 + idx * 0.22));
    const sunY = Math.round(h * (0.42 - idx * 0.04));
    const shift = idx * 90;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="sky${idx}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="65%" stop-color="${c2}"/>
          <stop offset="100%" stop-color="${glow}"/>
        </linearGradient>
        <radialGradient id="orb${idx}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="40%" stop-color="${glow}" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#sky${idx})"/>
      <circle cx="${sunX}" cy="${sunY}" r="${Math.round(w * 0.22)}" fill="url(#orb${idx})"/>
      <path d="M0 ${Math.round(h * 0.72)} L${Math.round(w * 0.22 - shift * 0.2)} ${Math.round(h * 0.44)} L${Math.round(w * 0.48)} ${Math.round(h * 0.64)} L${Math.round(w * 0.76 + shift * 0.2)} ${Math.round(h * 0.40)} L${w} ${Math.round(h * 0.68)} L${w} ${h} L0 ${h} Z" fill="#09090b" opacity="0.65"/>
      <path d="M0 ${Math.round(h * 0.8)} Q${Math.round(w * 0.35)} ${Math.round(h * 0.68)} ${Math.round(w * 0.65)} ${Math.round(h * 0.78)} T${w} ${Math.round(h * 0.72)} L${w} ${h} L0 ${h} Z" fill="#050507"/>
    </svg>`;
    const b64 = Buffer.from(svg, "utf8").toString("base64");
    return `data:image/svg+xml;base64,${b64}`;
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || "").trim();
    const mode = String(body?.mode || "Text to Video");
    const model = String(body?.model || "Seedance 2.0");
    const aspectRatio = String(body?.aspectRatio || "16:9");
    const durationRaw = String(body?.duration || "5s").replace("s", "");
    const durationSec = Math.max(4, Math.min(10, Number(durationRaw) || 5));
    const imageBase64 = body?.imageBase64 ? String(body.imageBase64) : undefined;
    const imageMimeType = body?.imageMimeType ? String(body.imageMimeType) : "image/png";

    if (!prompt) {
      return NextResponse.json({ error: "Please enter a video prompt first." }, { status: 400 });
    }

    const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || "";
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      "";

    const scenePrompts = [
      `${prompt}, cinematic wide establishing shot, dramatic lighting, photorealistic 4k`,
      `${prompt}, dynamic mid-action motion shot, closer camera angle, ultra detailed`,
      `${prompt}, epic closing shot, golden hour cinematic glow, sharp focus`,
    ];

    const frames: string[] = [];
    let providerLabel = model;

    if (imageBase64) {
      frames.push(`data:${imageMimeType};base64,${imageBase64}`);
    }

    // 1. Free Hugging Face FLUX.1-schnell (if HF_TOKEN is set — 0 cost, no card)
    if (hfToken && frames.length < 2) {
      const needed = [0, 1].slice(0, 2 - frames.length);
      const hfResults = await Promise.all(
        needed.map((idx) => generateFreeHuggingFaceFrame(hfToken, scenePrompts[idx]))
      );
      for (const img of hfResults) {
        if (img) {
          frames.push(img);
          providerLabel = `${model} • Free FLUX HD`;
        }
      }
    }

    // 2. Free Keyless Flux / Turbo Photorealistic Keyframes
    if (frames.length < 2) {
      const baseSeed = Date.now() % 100000;
      const needed = [0, 1].slice(0, 2 - frames.length);
      const fluxResults = await Promise.all(
        needed.map((idx) =>
          generateFreeFluxFrame(scenePrompts[idx], aspectRatio, baseSeed + idx * 73)
        )
      );
      for (const img of fluxResults) {
        if (img) {
          frames.push(img);
          providerLabel = `${model} • Free AI HD`;
        }
      }
    }

    // 3. Free Gemini Text-to-Storyboard Scenes
    if (frames.length < 2 && geminiKey) {
      const svgScenes = await generateFreeGeminiSvgScenes(geminiKey, prompt, aspectRatio);
      for (const s of svgScenes) {
        if (frames.length < 3) frames.push(s);
      }
      if (svgScenes.length > 0 && frames.length >= 2) {
        providerLabel = `${model} • Free AI Storyboard`;
      }
    }

    // 4. Guaranteed Instant Fallback
    if (frames.length === 0) {
      frames.push(...buildLocalCinematicSvgScenes(prompt, aspectRatio));
      providerLabel = `${model} • Cinematic Motion`;
    }

    return NextResponse.json({
      status: "motion_render",
      frames,
      frameDataUrl: frames[0] || "",
      caption: prompt,
      engine: `${providerLabel} • ${mode} (${frames.length} Scenes • 100% Free)`,
      durationSec,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
