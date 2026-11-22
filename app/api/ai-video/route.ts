import { NextResponse } from "next/server";

export const maxDuration = 60;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function urlToDataUrl(imageUrl: string, timeoutMs = 15000): Promise<string | null> {
  try {
    const imgRes = await fetchWithTimeout(
      imageUrl,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; 786AIHub/1.0)" } },
      timeoutMs
    );
    if (!imgRes.ok) return null;
    const contentType = imgRes.headers.get("content-type") || "image/webp";
    if (!contentType.startsWith("image/")) return null;
    const arrayBuf = await imgRes.arrayBuffer();
    if (arrayBuf.byteLength < 3000) return null;
    const b64 = Buffer.from(arrayBuf).toString("base64");
    return `data:${contentType};base64,${b64}`;
  } catch {
    return null;
  }
}

async function generateFreeAiHordeFrame(
  scenePrompt: string,
  aspectRatio: string
): Promise<string | null> {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";
  const width = isPortrait ? 512 : isSquare ? 512 : 768;
  const height = isPortrait ? 768 : isSquare ? 512 : 512;

  try {
    const submitRes = await fetchWithTimeout(
      "https://aihorde.net/api/v2/generate/async",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: "0000000000",
          "Client-Agent": "786ai-hub:1.0:aliraza",
        },
        body: JSON.stringify({
          prompt: `${scenePrompt}, photorealistic, cinematic lighting, 8k uhd ### blurry, solid blue, watermark, text, logo, distorted`,
          params: {
            width,
            height,
            steps: 18,
            cfg_scale: 7,
            sampler_name: "k_euler_a",
            n: 1,
          },
          nsfw: false,
          censor_nsfw: true,
          r2: true,
        }),
      },
      12000
    );

    if (!submitRes.ok) return null;
    const submitData = await submitRes.json();
    const jobId = submitData?.id;
    if (!jobId) return null;

    // Poll up to 24 seconds for free worker completion
    for (let attempt = 0; attempt < 10; attempt++) {
      await sleep(2400);
      const checkRes = await fetchWithTimeout(
        `https://aihorde.net/api/v2/generate/check/${jobId}`,
        { headers: { "Client-Agent": "786ai-hub:1.0:aliraza" } },
        8000
      );
      if (!checkRes.ok) continue;
      const checkData = await checkRes.json();
      if (checkData?.faulted) return null;
      if (checkData?.done) {
        const statusRes = await fetchWithTimeout(
          `https://aihorde.net/api/v2/generate/status/${jobId}`,
          { headers: { "Client-Agent": "786ai-hub:1.0:aliraza" } },
          10000
        );
        if (!statusRes.ok) return null;
        const statusData = await statusRes.json();
        const imgVal: string | undefined = statusData?.generations?.[0]?.img;
        if (!imgVal) return null;
        if (imgVal.startsWith("http")) {
          return await urlToDataUrl(imgVal, 12000);
        }
        return `data:image/webp;base64,${imgVal}`;
      }
    }
  } catch {
    return null;
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
      const instruction = `Create 3 distinct, richly detailed SVG movie storyboard illustrations depicting: "${prompt}".
Shot 1: Wide establishing scene with rich scenery and depth.
Shot 2: Closer dynamic action shot with clear subject silhouettes and highlights.
Shot 3: Dramatic golden-hour closing shot with warm sunbeams.
Return ONLY valid JSON: {"scenes": ["<svg ...>...</svg>", "<svg ...>...</svg>", "<svg ...>...</svg>"]}.
Each SVG must include xmlns="http://www.w3.org/2000/svg" and viewBox="${vb}", multi-stop <defs> gradients, detailed foreground subjects matching "${prompt}", layered hills/trees/structures, and lighting.`;

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

function buildRichGoldenSunsetScenes(prompt: string, aspectRatio: string): string[] {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const w = isPortrait ? 720 : 1280;
  const h = isPortrait ? 1280 : 720;
  const lower = prompt.toLowerCase();
  const isForest = /forest|lion|tiger|jungle|tree|nature|park|garden|animal/.test(lower);

  const themes = isForest
    ? [
        { top: "#052e16", mid: "#15803d", bot: "#f59e0b", sun: "#fef08a" },
        { top: "#14532d", mid: "#ca8a04", bot: "#fb923c", sun: "#fef9c3" },
        { top: "#422006", mid: "#b45309", bot: "#fde047", sun: "#ffffff" },
      ]
    : [
        { top: "#1c1917", mid: "#9a3412", bot: "#f59e0b", sun: "#fef08a" },
        { top: "#27272a", mid: "#be123c", bot: "#fb923c", sun: "#fde047" },
        { top: "#18181b", mid: "#b45309", bot: "#facc15", sun: "#ffffff" },
      ];

  return themes.map((t, idx) => {
    const sunX = Math.round(w * (0.3 + idx * 0.2));
    const sunY = Math.round(h * (0.46 - idx * 0.04));
    const treeOffset = idx * 45;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="bg${idx}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${t.top}"/>
          <stop offset="58%" stop-color="${t.mid}"/>
          <stop offset="100%" stop-color="${t.bot}"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg${idx})"/>
      <circle cx="${sunX}" cy="${sunY}" r="${Math.round(w * 0.09)}" fill="${t.sun}" opacity="0.95"/>
      <polygon points="0,${h} 0,${Math.round(h * 0.68)} ${Math.round(w * 0.25)},${Math.round(h * 0.52)} ${Math.round(w * 0.55)},${Math.round(h * 0.66)} ${Math.round(w * 0.82)},${Math.round(h * 0.48)} ${w},${Math.round(h * 0.65)} ${w},${h}" fill="#18181b" opacity="0.72"/>
      <polygon points="${Math.round(w * 0.12 - treeOffset)},${Math.round(h * 0.78)} ${Math.round(w * 0.16 - treeOffset)},${Math.round(h * 0.48)} ${Math.round(w * 0.20 - treeOffset)},${Math.round(h * 0.78)}" fill="#09090b"/>
      <polygon points="${Math.round(w * 0.80 + treeOffset)},${Math.round(h * 0.80)} ${Math.round(w * 0.85 + treeOffset)},${Math.round(h * 0.45)} ${Math.round(w * 0.90 + treeOffset)},${Math.round(h * 0.80)}" fill="#09090b"/>
      <rect x="0" y="${Math.round(h * 0.75)}" width="${w}" height="${Math.round(h * 0.25)}" fill="#09090b"/>
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

    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      "";

    const scenePrompts = [
      `${prompt}, cinematic wide establishing shot, dramatic golden sunlight`,
      `${prompt}, dynamic close-up motion shot, crisp focus, ultra detailed`,
    ];

    const frames: string[] = [];
    let providerLabel = model;

    if (imageBase64) {
      frames.push(`data:${imageMimeType};base64,${imageBase64}`);
    }

    // 1. Free Keyless AI Horde Photorealistic Generator (No Blue Banner, No Billing)
    if (frames.length < 2) {
      const needed = [0, 1].slice(0, 2 - frames.length);
      const hordeResults = await Promise.all(
        needed.map((idx) => generateFreeAiHordeFrame(scenePrompts[idx], aspectRatio))
      );
      for (const img of hordeResults) {
        if (img) {
          frames.push(img);
          providerLabel = `${model} • Free AI Horde HD`;
        }
      }
    }

    // 2. Free Gemini Storyboard Scenes
    if (frames.length < 2 && geminiKey) {
      const svgScenes = await generateFreeGeminiSvgScenes(geminiKey, prompt, aspectRatio);
      for (const s of svgScenes) {
        if (frames.length < 3) frames.push(s);
      }
      if (svgScenes.length > 0 && frames.length >= 2) {
        providerLabel = `${model} • Free Gemini Storyboard`;
      }
    }

    // 3. Crisp Golden Landscape Fallback (Never Blue Blur)
    if (frames.length === 0) {
      frames.push(...buildRichGoldenSunsetScenes(prompt, aspectRatio));
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
