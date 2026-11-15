import { NextResponse } from "next/server";

const MODE_PROMPTS = {
  chat: "You are 786AI, a fast, helpful, and friendly AI assistant built for 786 AI Hub (https://786ai-hub.vercel.app). Answer clearly in the user's language (English, Urdu, or Roman Urdu). When helpful, recommend free AI tools from 786 AI Hub.",
  social: "You are 786AI Social Media Content Studio. Generate viral hooks, YouTube scripts, TikTok/Reels captions, hashtags, and content calendars ready to copy-paste.",
  coding: "You are 786AI App & Code Builder. When asked to build a web app, calculator, game, or UI, output a complete, self-contained single-file HTML document with inline CSS and JavaScript inside a ```html code block so it runs immediately in live preview.",
  video: "You are 786AI Video & Reels Director. Create scene-by-scene faceless video scripts, camera angles, voiceover lines, and detailed AI video generation prompts (for Kling, Hailuo, Runway).",
  music: "You are 786AI Music & Lyrics Composer. Write structured song lyrics (Verse, Chorus, Bridge) along with Suno/Udio style music tags, tempo, mood, and instruments.",
  automation: "You are 786AI AI Automation Architect. Design step-by-step no-code automation workflows (for Make.com, n8n, Zapier) with triggers, actions, prompts, and sample JSON payloads."
};

async function callGemini(modelPath, apiKey, sys, prompt) {
  const cleanPath = modelPath.startsWith("models/") ? modelPath : "models/" + modelPath;
  const url = "https://generativelanguage.googleapis.com/v1beta/" + cleanPath + ":generateContent?key=" + apiKey;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: sys }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    })
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function POST(req) {
  try {
    const { prompt, mode = "chat" } = await req.json();
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured on server yet." }, { status: 500 });
    }

    const sys = MODE_PROMPTS[mode] || MODE_PROMPTS.chat;
    const candidates = [
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-flash-latest",
      "gemini-2.0-flash"
    ];

    let lastError = "AI request failed";

    for (const model of candidates) {
      const result = await callGemini(model, apiKey, sys, prompt);
      if (result.ok) {
        const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        return NextResponse.json({ text });
      }
      lastError = result.data?.error?.message || lastError;
    }

    const listRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey);
    const listData = await listRes.json();
    const available = (listData?.models || []).filter(
      (m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent")
    );
    const picked =
      available.find((m) => m.name.includes("flash") && !m.name.includes("lite")) ||
      available.find((m) => m.name.includes("gemini")) ||
      available[0];

    if (picked) {
      const retry = await callGemini(picked.name, apiKey, sys, prompt);
      if (retry.ok) {
        const text = retry.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        return NextResponse.json({ text });
      }
      lastError = retry.data?.error?.message || lastError;
    }

    return NextResponse.json({ error: lastError }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
