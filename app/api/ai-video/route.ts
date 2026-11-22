import { NextResponse } from "next/server";

export const maxDuration = 60;

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 18000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function urlToDataUrl(imageUrl: string): Promise<string | null> {
  try {
    const imgRes = await fetchWithTimeout(imageUrl, {}, 15000);
    if (!imgRes.ok) return null;
    const contentType = imgRes.headers.get("content-type") || "image/png";
    const arrayBuf = await imgRes.arrayBuffer();
    const b64 = Buffer.from(arrayBuf).toString("base64");
    return `data:${contentType};base64,${b64}`;
  } catch {
    return null;
  }
}

async function generateOpenAIKeyframe(
  openAiKey: string,
  scenePrompt: string,
  aspectRatio: string
): Promise<{ image: string | null; modelUsed?: string; error?: string }> {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";
  const gptSize = isPortrait ? "1024x1536" : isSquare ? "1024x1024" : "1536x1024";
  const dalleSize = isPortrait ? "1024x1792" : isSquare ? "1024x1024" : "1792x1024";
  const errors: string[] = [];

  const attempts: Array<{ model: string; body: Record<string, unknown> }> = [
    {
      model: "gpt-image-1-mini",
      body: {
        model: "gpt-image-1-mini",
        prompt: `Photorealistic cinematic movie frame, ultra detailed 4K, no text watermarks: ${scenePrompt}`,
        n: 1,
        size: gptSize,
      },
    },
    {
      model: "gpt-image-1",
      body: {
        model: "gpt-image-1",
        prompt: `Photorealistic cinematic movie frame, ultra detailed 4K, no text watermarks: ${scenePrompt}`,
        n: 1,
        size: gptSize,
      },
    },
    {
      model: "dall-e-3",
      body: {
        model: "dall-e-3",
        prompt: `Photorealistic cinematic movie frame, ultra detailed 4K, no text watermarks: ${scenePrompt}`,
        n: 1,
        size: dalleSize,
      },
    },
  ];

  for (const attempt of attempts) {
    try {
      const res = await fetchWithTimeout(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify(attempt.body),
        },
        22000
      );

      const data = await res.json();
      if (!res.ok) {
        errors.push(`${attempt.model}: ${data?.error?.message || `HTTP ${res.status}`}`);
        continue;
      }

      const item = data?.data?.[0];
      if (item?.b64_json) {
        return {
          image: `data:image/png;base64,${item.b64_json}`,
          modelUsed: attempt.model,
        };
      }
      if (item?.url) {
        const converted = await urlToDataUrl(item.url);
        if (converted) {
          return {
            image: converted,
            modelUsed: attempt.model,
          };
        }
      }
    } catch (e: unknown) {
      errors.push(`${attempt.model}: ${e instanceof Error ? e.message : "timeout"}`);
    }
  }

  return { image: null, error: errors.join(" ; ") };
}

async function generateGeminiRasterFrame(
  apiKey: string,
  scenePrompt: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<{ image: string | null; error?: string }> {
  let lastError = "";

  // 1. Try gemini-2.5-flash-image
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseModalities: ["IMAGE"] },
        }),
      },
      15000
    );

    const data = await res.json();
    if (res.ok) {
      const candidateParts = data?.candidates?.[0]?.content?.parts || [];
      for (const part of candidateParts) {
        if (part?.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          return { image: `data:${mime};base64,${part.inlineData.data}` };
        }
      }
    } else {
      lastError = data?.error?.message || `gemini-2.5-flash-image HTTP ${res.status}`;
    }
  } catch (e: unknown) {
    lastError = e instanceof Error ? e.message : "Gemini image error";
  }

  // 2. Try imagen-3.0-generate-002
  try {
    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: `Photorealistic cinematic movie frame: ${scenePrompt}` }],
          parameters: { sampleCount: 1 },
        }),
      },
      15000
    );

    const data = await res.json();
    if (res.ok) {
      const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
      const mime = data?.predictions?.[0]?.mimeType || "image/png";
      if (b64) return { image: `data:${mime};base64,${b64}` };
    } else {
      lastError = data?.error?.message || `imagen-3.0 HTTP ${res.status}`;
    }
  } catch (e: unknown) {
    lastError = e instanceof Error ? e.message : "Imagen 3 error";
  }

  return { image: null, error: lastError };
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

    // 1. Primary: OpenAI HD Keyframes (gpt-image-1-mini / gpt-image-1 / dall-e-3)
    if (openAiKey) {
      for (let i = 0; i < 2 && frames.length < 2; i++) {
        const res = await generateOpenAIKeyframe(openAiKey, scenePrompts[i], aspectRatio);
        if (res.image) {
          frames.push(res.image);
          providerLabel = `${model} • OpenAI (${res.modelUsed})`;
        } else if (res.error) {
          diagnostics.push(`OpenAI: ${res.error}`);
          break;
        }
      }
    } else {
      diagnostics.push("OPENAI_API_KEY missing");
    }

    // 2. Secondary: Gemini 2.5 Flash Image / Imagen 3
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
    }

    // 3. Guaranteed 3-Scene Fallback
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
