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
  return String(msg || "AI request failed").replace(/key=[^&\s"]+/gi, "key=***");
}

async function callGemini(modelPath, apiKey, sys, contents) {
  const cleanPath = modelPath.startsWith("models/") ? modelPath : `models/${modelPath}`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${cleanPath}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys }] },
        contents,
      }),
    }
  );
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const { prompt, mode, model, aspectRatio, resolution, duration } = await req.json();
    const cleanPrompt = String(prompt || "").trim();

    if (!cleanPrompt) {
      return NextResponse.json({ error: "Please describe the video you want to create." }, { status: 400 });
    }
    if (cleanPrompt.length > 1500) {
      return NextResponse.json({ error: "Prompt is too long (max 1500 characters)." }, { status: 400 });
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").replace(/[\s\r\n]+/g, "").trim();
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured on server." }, { status: 500 });
    }

    const systemInstruction = `You are the 786 AI Video Director Engine (https://786ai-hub.vercel.app/ai-video).
Generate a complete, ready-to-use AI video production package for the user's request with these exact settings:
- Mode/Tool: ${mode || "Text to Video"}
- Target AI Video Model: ${model || "Veo 3.1"}
- Aspect Ratio: ${aspectRatio || "16:9"}
- Resolution: ${resolution || "1080P"}
- Duration: ${duration || "5s"}

Format the output cleanly into 4 clear sections:
1. MASTER VIDEO PROMPT (Optimized specifically for ${model || "Veo 3.1"} with camera angles, lighting, lens, motion speed, and --ar ${aspectRatio || "16:9"} styling—ready to copy-paste)
2. SHOT-BY-SHOT TIMELINE (0s to ${duration || "5s"} visual action breakdown)
3. CAMERA & MOTION SETTINGS (Pan/tilt/zoom, subject motion, and frame rate guidance)
4. AUDIO, VOICEOVER & SFX CUES (Matching sound design and background atmosphere)`;

    const contents = [{ role: "user", parts: [{ text: cleanPrompt }] }];
    const candidates = [
      "gemini-3.0-flash",
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-flash-latest",
    ];
    let lastError = "Failed to generate video blueprint.";

    for (const candidate of candidates) {
      const result = await callGemini(candidate, apiKey, systemInstruction, contents);
      if (result.ok) {
        const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        return NextResponse.json({ text });
      }
      lastError = sanitizeError(result.data?.error?.message || lastError);
    }

    // Auto-discover active Flash model if static IDs fail
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    );
    const listData = await listRes.json();
    const available = (listData?.models || []).filter(
      (m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent")
    );
    const picked =
      available.find((m) => m.name.includes("flash") && !m.name.includes("lite")) ||
      available.find((m) => m.name.includes("gemini")) ||
      available[0];

    if (picked) {
      const retry = await callGemini(picked.name, apiKey, systemInstruction, contents);
      if (retry.ok) {
        const text = retry.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        return NextResponse.json({ text });
      }
      lastError = sanitizeError(retry.data?.error?.message || lastError);
    }

    return NextResponse.json({ error: lastError }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: sanitizeError(e?.message || "Server error") }, { status: 500 });
  }
}
