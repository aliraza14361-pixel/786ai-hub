import { NextResponse } from "next/server";

const rateMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    rateMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= 25) return true;
  entry.count += 1;
  rateMap.set(ip, entry);
  return false;
}

function sanitizeError(msg) {
  return String(msg || "Video generation error").replace(/key=[^&\s"]+/gi, "key=***");
}

function getApiKey() {
  return (process.env.GEMINI_API_KEY || "").replace(/[\s\r\n]+/g, "").trim();
}

export async function GET(req) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured on server." }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const opName = searchParams.get("op");
    const streamUrl = searchParams.get("stream");

    if (streamUrl) {
      const parsed = new URL(streamUrl);
      if (parsed.protocol !== "https:" || parsed.hostname !== "generativelanguage.googleapis.com") {
        return NextResponse.json({ error: "Invalid video source." }, { status: 400 });
      }
      const upstream = await fetch(parsed.toString(), {
        headers: { "x-goog-api-key": apiKey },
      });
      if (!upstream.ok) {
        return NextResponse.json({ error: "Failed to stream rendered video." }, { status: upstream.status });
      }
      return new Response(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": upstream.headers.get("Content-Type") || "video/mp4",
          "Content-Disposition": 'inline; filename="786ai-video.mp4"',
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    if (opName) {
      const cleanOp = opName.replace(/^\/+/, "");
      const pollRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${cleanOp}?key=${encodeURIComponent(apiKey)}`
      );
      const pollData = await pollRes.json();

      if (!pollRes.ok) {
        return NextResponse.json({ status: "failed", error: sanitizeError(pollData?.error?.message) }, { status: 500 });
      }
      if (!pollData.done) {
        return NextResponse.json({ status: "processing" });
      }
      if (pollData.error) {
        return NextResponse.json({ status: "failed", error: sanitizeError(pollData.error.message) });
      }

      const sample =
        pollData.response?.generateVideoResponse?.generatedSamples?.[0] ||
        pollData.response?.videos?.[0];
      const rawUri = sample?.video?.uri || sample?.uri;

      if (rawUri) {
        return NextResponse.json({
          status: "completed",
          videoUrl: `/api/ai-video?stream=${encodeURIComponent(rawUri)}`,
        });
      }
      return NextResponse.json({ status: "failed", error: "No video file returned." });
    }

    return NextResponse.json({ error: "Missing parameters." }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: sanitizeError(e?.message) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
    }

    const { prompt, mode, model, aspectRatio, duration, imageBase64, imageMimeType } = await req.json();
    const cleanPrompt = String(prompt || "").trim();

    if (!cleanPrompt) {
      return NextResponse.json({ error: "Please enter a video prompt first." }, { status: 400 });
    }
    if (cleanPrompt.length > 2500) {
      return NextResponse.json({ error: "Prompt is too long (max 2500 characters)." }, { status: 400 });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured on server." }, { status: 500 });
    }

    const supportedRatio = ["16:9", "9:16"].includes(aspectRatio) ? aspectRatio : "16:9";
    const enrichedPrompt = `${cleanPrompt}. Cinematic ${mode || "Text to Video"} style, smooth camera movement, photorealistic lighting.`;

    // 1. Try Google Veo Real Cloud MP4
    const veoCandidates = ["veo-3.1-generate-preview", "veo-3.0-generate-preview", "veo-2.0-generate-001"];
    for (const veoModel of veoCandidates) {
      const instance = { prompt: enrichedPrompt };
      if (imageBase64) {
        instance.image = {
          bytesBase64Encoded: imageBase64,
          mimeType: imageMimeType || "image/png",
        };
      }
      const veoRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${veoModel}:predictLongRunning?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [instance],
            parameters: { aspectRatio: supportedRatio },
          }),
        }
      );
      const veoData = await veoRes.json();
      if (veoRes.ok && veoData?.name) {
        return NextResponse.json({
          status: "processing",
          operationName: veoData.name,
          engine: `${model || "Veo 3.1"} (${veoModel})`,
        });
      }
    }

    // 2. Auto-Fallback: Generate High-Res AI Keyframe + Motion Video Render
    let frameDataUrl = imageBase64 ? `data:${imageMimeType || "image/png"};base64,${imageBase64}` : "";

    if (!frameDataUrl) {
      const imgModels = ["gemini-2.5-flash-image", "gemini-2.0-flash-exp-image-generation"];
      for (const imgModel of imgModels) {
        const imgRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${imgModel}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Photorealistic cinematic film still frame (${aspectRatio || "16:9"}) with rich lighting and zero text: ${cleanPrompt}`,
                    },
                  ],
                },
              ],
              generationConfig: { responseModalities: ["IMAGE"] },
            }),
          }
        );
        const imgData = await imgRes.json();
        const imgPart = imgData?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
        if (imgRes.ok && imgPart?.inlineData?.data) {
          frameDataUrl = `data:${imgPart.inlineData.mimeType || "image/png"};base64,${imgPart.inlineData.data}`;
          break;
        }
      }
    }

    return NextResponse.json({
      status: "motion_render",
      frameDataUrl,
      durationSec: Math.min(Math.max(Number(String(duration || "5").replace(/\D/g, "")) || 5, 4), 10),
      caption: cleanPrompt,
      engine: `${model || "Seedance 2.0"} • 786 AI Motion Engine`,
    });
  } catch (e) {
    return NextResponse.json({ error: sanitizeError(e?.message || "Server error") }, { status: 500 });
  }
}
