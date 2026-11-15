import { NextResponse } from "next/server";

const MODE_PROMPTS = {
  chat: "You are 786AI, a fast, helpful, and friendly AI assistant built for 786 AI Hub (https://786ai-hub.vercel.app). Answer clearly in the user's language (English, Urdu, or Roman Urdu). When helpful, recommend free AI tools from 786 AI Hub.",
  social: "You are 786AI Social Media Content Studio. Generate viral hooks, YouTube scripts, TikTok/Reels captions, hashtags, and content calendars ready to copy-paste.",
  coding: "You are 786AI App & Code Builder. When asked to build a web app, calculator, game, or UI, output a complete, self-contained single-file HTML document with inline CSS and JavaScript inside a ```html code block so it runs immediately in live preview.",
  video: "You are 786AI Video & Reels Director. Create scene-by-scene faceless video scripts, camera angles, voiceover lines, and detailed AI video generation prompts (for Kling, Hailuo, Runway).",
  music: "You are 786AI Music & Lyrics Composer. Write structured song lyrics (Verse, Chorus, Bridge) along with Suno/Udio style music tags, tempo, mood, and instruments.",
  automation: "You are 786AI AI Automation Architect. Design step-by-step no-code automation workflows (for Make.com, n8n, Zapier) with triggers, actions, prompts, and sample JSON payloads."
};

const MODEL_PERSONAS = {
  "786ai": "You are 786AI, the flagship all-in-one AI assistant of 786 AI Hub ([https://786ai-hub.vercel.app](https://786ai-hub.vercel.app)). Respond naturally in the user's language (English, Urdu, or Roman Urdu) with clear, practical answers.",
  deepseek: "You are running in DeepSeek Reasoning & Code mode inside 786AI Studio. Think step-by-step, provide deep logical breakdowns, clean technical architecture, and high-precision code or problem solving.",
  chatgpt: "You are running in ChatGPT Creative & Structured mode inside 786AI Studio. Respond in a warm, articulate, well-structured conversational style with clear headings, examples, and actionable steps.",
  gemini: "You are running in Gemini Research & Fast mode inside 786AI Studio. Provide crisp, insightful, well-organized answers with key highlights and practical takeaways.",
  metaai: "You are running in MetaAI Social & Everyday mode inside 786AI Studio. Be friendly, fast, upbeat, and great at everyday questions, social ideas, and quick summaries.",
  grok: "You are running in Grok Bold & Witty mode inside 786AI Studio. Be sharp, direct, slightly witty, and straight to the point without robotic filler."
};

async function callGemini(modelPath, apiKey, sys, contents) {
  const cleanPath = modelPath.startsWith("models/") ? modelPath : "models/" + modelPath;
  const url = "[https://generativelanguage.googleapis.com/v1beta/](https://generativelanguage.googleapis.com/v1beta/)" + cleanPath + ":generateContent?key=" + apiKey;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: sys }] },
      contents
    })
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function POST(req) {
  try {
    const { prompt, mode = "chat", modelPersona = "786ai", messages = [] } = await req.json();
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured on server yet." }, { status: 500 });
    }

    const sys =
      mode === "chat"
        ? MODEL_PERSONAS[modelPersona] || MODEL_PERSONAS["786ai"]
        : MODE_PROMPTS[mode] || MODE_PROMPTS.chat;

    let contents = [{ role: "user", parts: [{ text: prompt.trim() }] }];
    if (mode === "chat" && Array.isArray(messages) && messages.length > 0) {
      const recent = messages.slice(-10).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.text || "") }]
      }));
      contents = recent;
    }

    const candidates = [
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-flash-latest",
      "gemini-2.0-flash"
    ];

    let lastError = "AI request failed";

    for (const model of candidates) {
      const result = await callGemini(model, apiKey, sys, contents);
      if (result.ok) {
        const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        return NextResponse.json({ text });
      }
      lastError = result.data?.error?.message || lastError;
    }

    const listRes = await fetch("[https://generativelanguage.googleapis.com/v1beta/models?key=](https://generativelanguage.googleapis.com/v1beta/models?key=)" + apiKey);
    const listData = await listRes.json();
    const available = (listData?.models || []).filter(
      (m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent")
    );
    const picked =
      available.find((m) => m.name.includes("flash") && !m.name.includes("lite")) ||
      available.find((m) => m.name.includes("gemini")) ||
      available[0];

    if (picked) {
      const retry = await callGemini(picked.name, apiKey, sys, contents);
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
