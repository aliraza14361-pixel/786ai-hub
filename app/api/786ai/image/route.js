import { NextResponse } from "next/server";
import crypto from "crypto";

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

async function fetchImageAsDataUrl(targetUrl) {
  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; 786AIHub/1.0)"
    }
  });
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || !contentType.startsWith("image/")) {
    return null;
  }
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return "data:" + contentType + ";base64," + base64;
}

export async function POST(req) {
  try {
    const token = req.headers.get("x-studio-token") || "";
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Please log in first to generate images." }, { status: 401 });
    }

    const { prompt } = await req.json();
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Image prompt is required." }, { status: 400 });
    }

    const encoded = encodeURIComponent(prompt.trim());
    const seed = Date.now();

    const endpoints = [
      "https://image.pollinations.ai/prompt/" + encoded + "?width=1024&height=1024&nologo=true&model=flux&seed=" + seed,
      "https://image.pollinations.ai/prompt/" + encoded + "?width=768&height=768&nologo=true&model=turbo&seed=" + (seed + 1)
    ];

    for (const url of endpoints) {
      const dataUrl = await fetchImageAsDataUrl(url);
      if (dataUrl) {
        return NextResponse.json({ imageUrl: dataUrl });
      }
    }

    return NextResponse.json(
      { error: "Free image server limit (1 image / 45 sec). Please wait 30-45 seconds and try again." },
      { status: 429 }
    );
  } catch (e) {
    return NextResponse.json({ error: e.message || "Image generation failed." }, { status: 500 });
  }
}
