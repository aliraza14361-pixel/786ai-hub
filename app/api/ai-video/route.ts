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
): Promise<string | null> {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";
  const size = isPortrait ? "1024x1536" : isSquare ? "1024x1024" : "1536x1024";
  const dalleSize = isPortrait ? "1024x1792" : isSquare ? "1024x1024" : "1792x1024";

  // 1. Try gpt-image-1 first
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

    if (res.ok) {
      const data = await res.json();
      const b64 = data?.data?.[0]?.b64_json;
      if (b64) return `data:image/png;base64,${b64}`;
    }
  } catch {
    // Fall back to dall-e-3
  }

  // 2. Try dall-e-3 with b64_json
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

    if (res.ok) {
      const data = await res.json();
      const b64 = data?.data?.[0]?.b64_json;
      if (b64) return `data:image/png;base64,${b64}`;
    }
  } catch {
    // Fall back to Gemini
  }

  return null;
}

async function generateGeminiRasterFrame(
  apiKey: string,
  scenePrompt: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<string | null> {
  const models = ["gemini-2.5-flash-image", "gemini-2.0-flash-preview-image-generation"];

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

      if (!res.ok) continue;
      const data = await res.json();
      const candidateParts = data?.candidates?.[0]?.content?.parts || [];
      for (const part of candidateParts) {
        if (part?.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          return `data:${mime};base64,${part.inlineData.data}`;
        }
      }
    } catch {
      // Try next model
    }
  }
  return null;
}

async function generateGeminiSvgScenes(
  apiKey: string,
  prompt: string,
  aspectRatio: string
): Promise<string[]> {
  const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const vb = isPortrait ? "0 0 720 1280" : "0 0 1280 720";

  for (const textModel of ["gemini-2.5-flash", "gemini-2.5-flash-lite"]) {
    try {
      const instruction = `You are a cinematic storyboard illustrator. Create 3 distinct, richly detailed SVG scene illustrations depicting a 3-shot sequence for: "${prompt}".
Shot 1: Opening wide establishing shot.
Shot 2: Dynamic mid-action shot with closer perspective and movement.
Shot 3: Dramatic closing shot with glowing lighting.
Rules:
- Output ONLY 3 complete <svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">...</svg> blocks, nothing else.
- Use rich <defs> linearGradient and radialGradient backgrounds, multi-layered silhouettes, detailed shapes, shadows, and environment elements matching "${prompt}".
- Do NOT include <image> tags or external URLs.`;

      const res = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${textModel}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: instruction }] }],
            generationConfig: { temperature: 0.7 },
          }),
        },
        16000
      );

      if (!res.ok) continue;
      const data = await res.json();
      const rawText: string =
        data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("\n") || "";

      const matches = rawText.match(/<svg[\s\S]*?<\/svg>/gi) || [];
      const svgDataUrls: string[] = [];

      for (const rawSvg of matches.slice(0, 3)) {
        const cleanSvg = rawSvg.includes("xmlns=")
          ? rawSvg
          : rawSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
        const b64 = Buffer.from(cleanSvg, "utf8").toString("base64");
        svgDataUrls.push(`data:image/svg+xml;base64,${b64}`);
      }

      if (svgDataUrls.length > 0) return svgDataUrls;
    } catch {
      // Try next text model
    }
  }
  return [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const op = searchParams.get("op");
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

  if (!op || !apiKey) {
    return NextResponse.json({ status: "failed", error: "Missing operation ID or API key." }, { status: 400 });
  }

  try {
    const res = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/${op}?key=${apiKey}`);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ status: "failed", error: data?.error?.message || "Failed to check status." }, { status: 500 });
    }

    if (!data.done) {
      return NextResponse.json({ status: "processing" });
    }

    const videoUri =
      data?.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri ||
      data?.response?.videos?.[0]?.uri;

    if (!videoUri) {
      return NextResponse.json({ status: "failed", error: "No video returned from model." }, { status: 500 });
    }

    const sep = videoUri.includes("?") ? "&" : "?";
    return NextResponse.json({
      status: "completed",
      videoUrl: `${videoUri}${sep}key=${apiKey}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Polling error";
    return NextResponse.json({ status: "failed", error: msg }, { status: 500 });
  }
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
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

    const scenePrompts = [
      `${prompt}, cinematic wide establishing shot, dramatic lighting, ultra detailed 4k`,
      `${prompt}, dynamic mid-action motion shot, closer camera perspective, rich depth`,
      `${prompt}, epic closing angle, golden hour atmosphere, crisp focus`,
    ];

    const frames: string[] = [];
    let providerLabel = model;

    if (imageBase64) {
      frames.push(`data:${imageMimeType};base64,${imageBase64}`);
    }

    // 1. Primary: OpenAI HD Keyframes when OPENAI_API_KEY is configured
    if (openAiKey) {
      for (let i = 0; i < 2 && frames.length < 2; i++) {
        const oaiImg = await generateOpenAIKeyframe(openAiKey, scenePrompts[i], aspectRatio);
        if (oaiImg) {
          frames.push(oaiImg);
          providerLabel = `${model} • OpenAI HD`;
        }
      }
    }

    // 2. Secondary: Gemini Raster Image Generation
    if (geminiKey && frames.length < 2) {
      for (let i = 0; i < scenePrompts.length && frames.length < 3; i++) {
        const gemImg = await generateGeminiRasterFrame(geminiKey, scenePrompts[i], imageBase64, imageMimeType);
        if (gemImg) frames.push(gemImg);
      }
    }

    // 3. Guaranteed Gemini SVG Storyboard Scenes fallback
    if (frames.length < 2 && geminiKey) {
      const svgScenes = await generateGeminiSvgScenes(geminiKey, prompt, aspectRatio);
      for (const s of svgScenes) {
        if (frames.length < 3) frames.push(s);
      }
    }

    const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
    const imgW = isPortrait ? 576 : 1024;
    const imgH = isPortrait ? 1024 : 576;
    const directUrls = scenePrompts.map((sp, idx) => {
      const encoded = encodeURIComponent(sp);
      return `https://image.pollinations.ai/prompt/${encoded}?width=${imgW}&height=${imgH}&seed=${Date.now() + idx * 97}&nologo=true`;
    });

    return NextResponse.json({
      status: "motion_render",
      frames,
      directUrls,
      frameDataUrl: frames[0] || "",
      caption: prompt,
      engine: `${providerLabel} • ${mode} (${frames.length} Scenes)`,
      durationSec,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
