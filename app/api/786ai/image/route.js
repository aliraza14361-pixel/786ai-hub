import { NextResponse } from "next/server";

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
