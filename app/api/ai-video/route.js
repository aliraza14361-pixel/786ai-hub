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
  if (entry.count >= 20) return true;
  entry.count += 1;
  rateMap.set(ip, entry);
  return false;
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

    const candidates = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.0-flash"];
    let lastError = "Failed to generate video blueprint.";

    for (const candidate of candidates) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: "user", parts: [{ text: cleanPrompt }] }],
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        return NextResponse.json({ text });
      }
      lastError = data?.error?.message || lastError;
    }

    return NextResponse.json({ error: lastError }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
