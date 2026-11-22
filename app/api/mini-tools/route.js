import { NextResponse } from "next/server";

const TOOL_PROMPTS = {
  "prompt-enhancer": (input) =>
    `Act as an expert Prompt Engineer. Rewrite the user's basic idea into 3 high-performing prompts (1. Concise, 2. Structured with Role & Constraints, 3. Creative/Advanced) ready to paste into ChatGPT, Gemini, or Claude.\n\nUser Idea: ${input}`,
  "reels-hook-maker": (input) =>
    `You are a viral short-form video strategist for TikTok, Instagram Reels, and YouTube Shorts. Generate 10 scroll-stopping 3-second opening hooks plus a 30-second bullet-point script outline for:\n\nTopic: ${input}`,
  "seo-geo-outliner": (input) =>
    `Create a search-optimized blog post outline designed to rank on Google SEO and AI answer engines (GEO). Include 3 H1 titles, a 155-character meta description, H2/H3 headings, key bullet points, and 4 FAQs with short answers for:\n\nKeyword/Topic: ${input}`,
  "youtube-title-maker": (input) =>
    `Act as a YouTube growth expert. For the topic below, generate:\n1. 8 high-CTR YouTube titles (under 60 characters).\n2. 3 high-contrast thumbnail concepts with background visual and 3-word text overlay.\n\nVideo Topic: ${input}`,
  "freelance-proposal": (input) =>
    `Write a short, persuasive, non-robotic freelance job proposal (under 180 words) tailored to this project. Start with a strong hook addressing their problem, 3 clear execution steps, and a simple call to action.\n\nJob Description: ${input}`,
  "ai-tool-idea": (input) =>
    `Suggest 5 profitable micro-SaaS or AI mini-tool ideas in the niche below. For each idea, include: Name, Target Audience, Core Feature, and Monetization Angle.\n\nNiche: ${input}`,
};

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

async function callGemini(modelPath, apiKey, contents) {
  const cleanPath = modelPath.startsWith("models/") ? modelPath : `models/${modelPath}`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${cleanPath}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
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

    const { toolId, userInput } = await req.json();
    const cleanInput = String(userInput || "").trim();

    if (!cleanInput) {
      return NextResponse.json({ error: "Please enter your topic or text first." }, { status: 400 });
    }
    if (cleanInput.length > 1500) {
      return NextResponse.json({ error: "Input is too long (max 1500 characters)." }, { status: 400 });
    }

    const buildPrompt = TOOL_PROMPTS[toolId];
    if (!buildPrompt) {
      return NextResponse.json({ error: "Invalid mini-tool selected." }, { status: 400 });
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").replace(/[\s\r\n]+/g, "").trim();
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured on server." }, { status: 500 });
    }

    const contents = [{ role: "user", parts: [{ text: buildPrompt(cleanInput) }] }];
    const candidates = [
      "gemini-3.0-flash",
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-flash-latest",
    ];
    let lastError = "Failed to generate response.";

    for (const candidate of candidates) {
      const result = await callGemini(candidate, apiKey, contents);
      if (result.ok) {
        const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        return NextResponse.json({ text });
      }
      lastError = sanitizeError(result.data?.error?.message || lastError);
    }

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
      const retry = await callGemini(picked.name, apiKey, contents);
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
