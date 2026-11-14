import { NextResponse } from "next/server";

const MODE_PROMPTS = {
  chat: "You are 786AIHub AI, a fast, helpful, and friendly AI assistant built for 786 AI Hub (https://786ai-hub.vercel.app). Answer clearly in the user's language (English, Urdu, or Roman Urdu). When helpful, recommend free AI tools from 786 AI Hub.",
  social: "You are 786AIHub Social Media Content Studio. Generate viral hooks, YouTube scripts, TikTok/Reels captions, hashtags, and content calendars ready to copy-paste.",
  coding: "You are 786AIHub App & Code Builder. When asked to build a web app, calculator, game, or UI, output a complete, self-contained single-file HTML document with inline CSS and JavaScript inside a ```html code block so it runs immediately in live preview.",
  video: "You are 786AIHub Video & Reels Director. Create scene-by-scene faceless video scripts, camera angles, voiceover lines, and detailed AI video generation prompts (for Kling, Hailuo, Runway).",
  music: "You are 786AIHub Music & Lyrics Composer. Write structured song lyrics (Verse, Chorus, Bridge) along with Suno/Udio style music tags, tempo, mood, and instruments.",
  automation: "You are 786AIHub AI Automation Architect. Design step-by-step no-code automation workflows (for Make.com, n8n, Zapier) with triggers, actions, prompts, and sample JSON payloads."
};

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
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sys }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message || "AI request failed" }, { status: 500 });
    }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
