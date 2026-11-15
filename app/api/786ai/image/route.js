import { NextResponse } from "next/server";
import crypto from "crypto";

function getSecret() {
  const raw = process.env.GEMINI_API_KEY || "786ai-hub-default-secret-key";
  return raw.replace(/[\s\r\n]+/g, "").trim() || "786ai-hub-default-secret-key";
}

async function verifyUser(req) {
  const token = req.headers.get("x-studio-token") || "";
  const headerEmail = (req.headers.get("x-user-email") || "").trim().toLowerCase();

  // Check HMAC token if present
  if (token && token.includes(".") && token.split(".").length === 2) {
    const [data, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
    if (sig === expected) {
      try {
        const parsed = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
        if (parsed.exp && parsed.exp >= Date.now()) return parsed;
      } catch {}
    }
  }

  // Check Supabase JWT from Home Page login
  const sbUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const sbAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (sbUrl && sbAnon && token && token !== "home-session") {
    try {
      const r = await fetch(sbUrl + "/auth/v1/user", {
        headers: {
          apikey: sbAnon,
          Authorization: "Bearer " + token
        }
      });
      if (r.ok) {
        const u = await r.json();
        if (u && u.email) {
          return {
            email: u.email,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split("@")[0]
          };
        }
      }
    } catch {}
  }

  // Fallback for Home Page local session
  if (token === "home-session" && headerEmail && headerEmail.includes("@")) {
    return {
      email: headerEmail,
      name: headerEmail.split("@")[0]
    };
  }

  return null;
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
    const user = await verifyUser(req);
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
