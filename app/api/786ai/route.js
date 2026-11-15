import { NextResponse } from "next/server";
import crypto from "crypto";

const FENCE = String.fromCharCode(96).repeat(3);

function getSecret() {
  const raw = process.env.GEMINI_API_KEY || "786ai-hub-default-secret-key";
  return raw.replace(/[\s\r\n]+/g, "").trim() || "786ai-hub-default-secret-key";
}

function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  if (sig !== expected) return null;
  try {
    const parsed = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (!parsed.exp || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

const MODE_PROMPTS = {
  chat: "You are 786AI, a fast, helpful, and friendly AI assistant built for 786 AI Hub (https://786ai-hub.vercel.app). Answer clearly in the user's language (English, Urdu, or Roman Urdu). When helpful, recommend free AI tools from 786 AI Hub.",
  video: "You are 786AI Video Director (Create videos - Bring ideas to life). Create engaging scene-by-scene video scripts, hook lines, voiceover narration, camera directions, and ready-to-use AI video prompts for Kling, Runway, and Hailuo.",
  music: "You are 786AI Music & Audio Composer (Create music - Make audio tracks). Write complete structured song lyrics (Intro, Verse, Chorus, Bridge, Outro) along with Suno/Udio style prompts, genre tags, BPM tempo, mood, and instruments.",
  canvas: "You are 786AI Canvas Studio (Code, write, or make slides). When asked to build a web app, calculator, interactive presentation slides, or rich visual document, output a complete, self-contained single-file HTML document with modern dark/clean CSS and JavaScript inside a " + FENCE + "html code block so it renders immediately in Live Preview.",
  coding: "You are 786AI Canvas Studio (Code, write, or make slides). Output a complete, self-contained single-file HTML document with inline CSS and JavaScript inside a " + FENCE + "html code block so it runs immediately in Live Preview.",
  research: "You are 786AI Deep Research Analyst (Get detailed reports). Produce comprehensive, well-structured reports with an Executive Summary, Key Findings, Detailed Breakdown with headings and bullet points, Comparison Table if relevant, and Actionable Recommendations.",
  learning: "You are 786AI Guided Learning Tutor (Get step-by-step help). Teach the user patiently step-by-step. Break complex topics into clear numbered steps, give simple real-world examples, and end with one short practice question to check understanding.",
  think: "You are 786AI Deep Reasoning Engine (Think harder). Analyze the problem carefully using structured step-by-step logic: 1) Core Problem Breakdown, 2) Deep Step-by-Step Analysis, 3) Edge Cases & Verification, and 4) Clear Final Answer.",
  automation: "You are 786AI Plugins & Automation Architect. Design step-by-step no-code workflows (Make.com, n8n, Zapier, APIs) with triggers, modules, prompts, and sample JSON payloads."
};

const MODEL_PERSONAS = {
  "786ai": "You are 786AI, the flagship all-in-one AI assistant of 786 AI Hub (https://786ai-hub.vercel.app). Respond naturally in the user's language (English, Urdu, or Roman Urdu) with clear, practical answers.",
  deepseek: "You are running in DeepSeek Reasoning & Code mode inside 786AI Studio. Think step-by-step, provide deep logical breakdowns, clean technical architecture, and high-precision code or problem solving.",
  chatgpt: "You are running in ChatGPT Creative & Structured mode inside 786AI Studio. Respond in a warm, articulate, well-structured conversational style with clear headings, examples, and actionable steps.",
  gemini: "You are running in Gemini Research & Fast mode inside 786AI Studio. Provide crisp, insightful, well-organized answers with key highlights and practical takeaways.",
  metaai: "You are running in MetaAI Social & Everyday mode inside 786AI Studio. Be friendly, fast, upbeat, and great at everyday questions, social ideas, and quick summaries.",
  grok: "You are running in Grok Bold & Witty mode inside 786AI Studio. Be sharp, direct, slightly witty, and straight to the point without robotic filler."
};

function sanitizeError(msg) {
  return String(msg || "AI request failed").replace(/key=[^&\s"']+/gi, "key=***");
}

async function callGemini(modelPath, apiKey, sys, contents) {
  const cleanPath = modelPath.startsWith("models/") ? modelPath : "models/" + modelPath;
  const url = "https://generativelanguage.googleapis.com/v1beta/" + cleanPath + ":generateContent?key=" + encodeURIComponent(apiKey);
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
    const token = req.headers.get("x-studio-token") || "";
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Please log in first to use 786AI Studio." }, { status: 401 });
    }

    const {
      prompt,
      mode = "chat",
      modelPersona = "786ai",
      messages = [],
      imageBase64 = "",
      imageMimeType = "image/jpeg",
      fileText = "",
      fileName = "",
      personalContext = ""
    } = await req.json();

    if ((!prompt || !prompt.trim()) && !imageBase64 && !fileText) {
      return NextResponse.json({ error: "Prompt, photo, or file is required" }, { status: 400 });
    }

    const rawKey = process.env.GEMINI_API_KEY || "";
    const apiKey = rawKey.replace(/[\s\r\n]+/g, "").trim();
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured on server yet." }, { status: 500 });
    }

    let sys =
      mode === "chat"
        ? MODEL_PERSONAS[modelPersona] || MODEL_PERSONAS["786ai"]
        : MODE_PROMPTS[mode] || MODE_PROMPTS.chat;

    sys += "\n\n[Authenticated User]: Name: " + user.name + " (" + user.email + ").";

    if (personalContext && personalContext.trim()) {
      sys += "\n[Personal Intelligence Active - User Preferences]: " + personalContext.trim();
    }

    let finalUserPrompt = (prompt || "").trim();
    if (fileText) {
      finalUserPrompt += "\n\n--- Attached File (" + (fileName || "document") + ") ---\n" + fileText.slice(0, 15000);
    }
    if (!finalUserPrompt && imageBase64) {
      finalUserPrompt = "Analyze this image in detail and explain everything helpful about it.";
    }

    let contents = [];
    if (mode === "chat" && Array.isArray(messages) && messages.length > 1 && !imageBase64 && !fileText) {
      contents = messages.slice(-10).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.text || "") }]
      }));
    } else {
      const userParts = [{ text: finalUserPrompt }];
      if (imageBase64) {
        userParts.push({
          inlineData: {
            mimeType: imageMimeType || "image/jpeg",
            data: imageBase64
          }
        });
      }
      contents = [{ role: "user", parts: userParts }];
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
      lastError = sanitizeError(result.data?.error?.message || lastError);
    }

    const listRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + encodeURIComponent(apiKey));
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
      lastError = sanitizeError(retry.data?.error?.message || lastError);
    }

    return NextResponse.json({ error: lastError }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: sanitizeError(e.message) }, { status: 500 });
  }
}
