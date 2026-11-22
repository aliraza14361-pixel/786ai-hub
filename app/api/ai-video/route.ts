import { NextResponse } from "next/server";

export const maxDuration = 60;

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function generateOpenAIKeyframe(
  openAiKey: string,
  scenePrompt: string,
  aspectRatio: string
): Promise<{ image: string | null; error?: string }> {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";
  const size = isPortrait ? "1024x1536" : isSquare ? "1024x1024" : "1536x1024";
  const dalleSize = isPortrait ? "1024x1792" : isSquare ? "1024x1024" : "1792x1024";
  let lastError = "";

  // 1. Try gpt-image-1
  try {
    const res = await fetchWithTimeout(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: `Photorealistic cinematic movie frame, ultra detailed 4K, no text watermarks: ${scenePrompt}`,
          n: 1,
          size,
          quality: "medium",
        }),
      },
      20000
    );

    const data = await res.json();
    if (res.ok) {
      const b64 = data?.data?.[0]?.b64_json;
      if (b64) return { image: `data:image/png;base64,${b64}` };
    } else {
      lastError = data?.error?.message || `OpenAI gpt-image-1 HTTP ${res.status}`;
    }
  } catch (e: unknown) {
    lastError = e instanceof Error ? e.message : "OpenAI timeout";
  }

  // 2. Fallback to dall-e-3
  try {
    const res = await fetchWithTimeout(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Photorealistic cinematic movie frame, ultra detailed 4K, no text watermarks: ${scenePrompt}`,
          n: 1,
          size: dalleSize,
          response_format: "b64_json",
        }),
      },
      20000
    );

    const data = await res.json();
    if (res.ok) {
      const b64 = data?.data?.[0]?.b64_json;
      if (b64) return { image: `data:image/png;base64,${b64}` };
    } else {
      lastError = data?.error?.message || `OpenAI dall-e-3 HTTP ${res.status}`;
    }
  } catch (e: unknown) {
    lastError = e instanceof Error ? e.message : "OpenAI dall-e-3 timeout";
  }

  return { image: null, error: lastError };
}

async function generateGeminiRasterFrame(
  apiKey: string,
  scenePrompt: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<{ image: string | null; error?: string }> {
  const models = ["gemini-2.5-flash-image", "gemini-2.0-flash-preview-image-generation"];
  let lastError = "";

  for (const modelName of models) {
    try {
      const parts: Array<Record<string, unknown>> = [];
      if (imageBase64) {
        parts.push({
          inlineData: {
            mimeType: imageMimeType || "image/png",
            data: imageBase64,
          },
        });
      }
      parts.push({
        text: `Create a vivid, photorealistic cinematic movie still (no text or watermarks): ${scenePrompt}`,
      });

      const res = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
          }),
        },
        14000
      );

      const data = await res.json();
      if (!res.ok) {
        lastError = data?.error?.message || `${modelName} HTTP ${res.status}`;
        continue;
      }

      const candidateParts = data?.candidates?.[0]?.content?.parts || [];
      for (const part of candidateParts) {
        if (part?.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          return { image: `data:${mime};base64,${part.inlineData.data}` };
        }
      }
    } catch (e: unknown) {
      lastError = e instanceof Error ? e.message : "Gemini raster error";
    }
  }
  return { image: null, error: lastError };
}

async function generateGeminiSvgScenes(
  apiKey: string,
  prompt: string,
  aspectRatio: string
): Promise<string[]> {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const vb = isPortrait ? "0 0 720 1280" : "0 0 1280 720";

  for (const textModel of ["gemini-2.5-flash", "gemini-2.0-flash"]) {
    try {
      const instruction = `Create 3 distinct, richly illustrated cinematic SVG movie frames for the prompt: "${prompt}".
Shot 1: Wide establishing scene.
Shot 2: Closer dynamic action angle.
Shot 3: Dramatic golden-hour closing shot.
Return a JSON object with a "scenes" array containing 3 complete SVG strings. Each SVG must have xmlns="http://www.w3.org/2000/svg" and viewBox="${vb}", rich <defs> gradients, detailed silhouettes, lighting glows, and environment elements matching "${prompt}".`;

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
        16000
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
      // Try next text model
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
  const isCyber = /car|city|neon|cyber|robot|space|future|night/.test(lower);

  const palettes = isNature
    ? [
        ["#064e3b", "#059669", "#fbbf24"],
        ["#022c22", "#047857", "#f59e0b"],
        ["#14532d", "#15803d", "#fde047"],
      ]
    : isCyber
    ? [
        ["#090d16", "#1e1b4b", "#38bdf8"],
        ["#0f172a", "#312e81", "#f43f5e"],
        ["#020617", "#1d4ed8", "#22d3ee"],
      ]
    : [
        ["#1e1b4b", "#9d174d", "#f59e0b"],
        ["#172554", "#1d4ed8", "#38bdf8"],
        ["#311042", "#be123c", "#fde047"],
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
      <circle cx="${Math.round(w * (0.35 + idx * 0.15))}" cy="${Math.round(h * 0.72)}" r="${26 + idx * 6}" fill="${glow}" opacity="0.85"/>
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

    const openAiKey = process.env.OPENAI_API_KEY || "";
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      "";

    const scenePrompts = [
      `${prompt}, cinematic wide establishing shot, dramatic lighting, ultra detailed 4k`,
      `${prompt}, dynamic mid-action motion shot, closer camera perspective, rich depth`,
      `${prompt}, epic closing angle, golden hour atmosphere, crisp focus`,
    ];

    const frames: string[] = [];
    const diagnostics: string[] = [];
    let providerLabel = model;

    if (imageBase64) {
      frames.push(`data:${imageMimeType};base64,${imageBase64}`);
    }

    // 1. Primary: OpenAI HD Keyframes
    if (openAiKey) {
      for (let i = 0; i < 2 && frames.length < 2; i++) {
        const res = await generateOpenAIKeyframe(openAiKey, scenePrompts[i], aspectRatio);
        if (res.image) {
          frames.push(res.image);
          providerLabel = `${model} • OpenAI HD`;
        } else if (res.error) {
          diagnostics.push(`OpenAI: ${res.error}`);
          break;
        }
      }
    } else {
      diagnostics.push("OPENAI_API_KEY not loaded in deployment");
    }

    // 2. Secondary: Gemini Raster Image Generation
    if (geminiKey && frames.length < 2) {
      for (let i = 0; i < scenePrompts.length && frames.length < 3; i++) {
        const res = await generateGeminiRasterFrame(geminiKey, scenePrompts[i], imageBase64, imageMimeType);
        if (res.image) {
          frames.push(res.image);
          providerLabel = `${model} • Gemini HD`;
        } else if (res.error) {
          diagnostics.push(`GeminiImage: ${res.error}`);
          break;
        }
      }
    } else if (!geminiKey) {
      diagnostics.push("GEMINI_API_KEY not loaded in deployment");
    }

    // 3. Tertiary: Gemini JSON-Structured SVG Storyboard
    if (frames.length < 2 && geminiKey) {
      const svgScenes = await generateGeminiSvgScenes(geminiKey, prompt, aspectRatio);
      for (const s of svgScenes) {
        if (frames.length < 3) frames.push(s);
      }
      if (svgScenes.length > 0) {
        providerLabel = `${model} • AI Storyboard`;
      }
    }

    // 4. Guaranteed 3-Scene Fallback (never returns 0 Scenes)
    if (frames.length === 0) {
      frames.push(...buildLocalCinematicSvgScenes(prompt, aspectRatio));
      providerLabel = `${model} • Cinematic Motion`;
    }

    return NextResponse.json({
      status: "motion_render",
      frames,
      frameDataUrl: frames[0] || "",
      caption: prompt,
      engine: `${providerLabel} • ${mode} (${frames.length} Scenes)`,
      diagnostic: diagnostics.join(" | "),
      durationSec,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
