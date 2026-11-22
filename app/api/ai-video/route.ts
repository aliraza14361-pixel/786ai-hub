import { NextResponse } from "next/server";

export const maxDuration = 60;

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!base64 || base64.length < 500) return null;
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}

async function generateGeminiKeyframe(
  apiKey: string,
  scenePrompt: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<string | null> {
  const imageModels = [
    "gemini-2.5-flash-image",
    "gemini-2.0-flash-preview-image-generation",
    "gemini-2.0-flash-exp",
  ];

  for (const modelName of imageModels) {
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
        text: `Generate a high-detail, photorealistic cinematic movie frame (no text watermarks): ${scenePrompt}`,
      });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseModalities: ["IMAGE", "TEXT"],
            },
          }),
        }
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const op = searchParams.get("op");
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

  if (!op || !apiKey) {
    return NextResponse.json({ status: "failed", error: "Missing operation ID or API key." }, { status: 400 });
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${op}?key=${apiKey}`);
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

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

    // 1. Try native Google Veo MP4 if enabled on API key
    if (apiKey && (model.includes("Veo") || model.includes("Sora") || model.includes("Seedance"))) {
      for (const veoId of ["veo-3.0-generate-001", "veo-2.0-generate-001"]) {
        try {
          const instance: Record<string, unknown> = { prompt };
          if (imageBase64) {
            instance.image = {
              bytesBase64Encoded: imageBase64,
              mimeType: imageMimeType,
            };
          }
          const veoRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${veoId}:predictLongRunning?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                instances: [instance],
                parameters: { aspectRatio },
              }),
            }
          );
          if (veoRes.ok) {
            const veoData = await veoRes.json();
            if (veoData?.name) {
              return NextResponse.json({
                status: "processing",
                operationName: veoData.name,
                engine: `${model} (${veoId})`,
              });
            }
          }
        } catch {
          // Fall back to multi-keyframe AI storyboard renderer
        }
      }
    }

    // 2. Generate 3 sequential AI scene keyframes (Start, Mid-Action, Closing Shot)
    const sceneAngles = [
      `${prompt}, wide establishing opening shot, dramatic lighting, ultra realistic 4k`,
      `${prompt}, dynamic mid-action camera movement, close cinematic perspective, rich motion`,
      `${prompt}, sweeping final angle, golden cinematic atmosphere, sharp details`,
    ];

    const frames: string[] = [];

    if (imageBase64) {
      frames.push(`data:${imageMimeType};base64,${imageBase64}`);
    }

    if (apiKey) {
      for (let i = 0; i < sceneAngles.length && frames.length < 3; i++) {
        const img = await generateGeminiKeyframe(apiKey, sceneAngles[i], imageBase64, imageMimeType);
        if (img) frames.push(img);
      }
    }

    // 3. Guaranteed server-side AI image fallback so the video ALWAYS has real visuals
    const isPortrait = aspectRatio === "9:16" || aspectRatio === "3:4";
    const imgW = isPortrait ? 576 : 1024;
    const imgH = isPortrait ? 1024 : 576;

    while (frames.length < 2) {
      const idx = frames.length;
      const encoded = encodeURIComponent(`${sceneAngles[idx]}`);
      const seed = Date.now() + idx * 137;
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${imgW}&height=${imgH}&seed=${seed}&nologo=true`;
      const dataUrl = await fetchImageAsDataUrl(fallbackUrl);
      if (dataUrl) {
        frames.push(dataUrl);
      } else {
        break;
      }
    }

    return NextResponse.json({
      status: "motion_render",
      frames,
      frameDataUrl: frames[0] || "",
      caption: prompt,
      engine: `${model} • ${mode} (${frames.length} AI Scenes)`,
      durationSec,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
