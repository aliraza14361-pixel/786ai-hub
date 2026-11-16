import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "786ai_admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function createSessionToken(secret) {
  const payload = Buffer.from(
    JSON.stringify({ role: "admin", exp: Date.now() + SESSION_TTL_MS })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

function verifySessionToken(token, secret) {
  if (!token || !secret || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  if (!safeEqual(sig, expectedSig)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.role === "admin" && Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}

export async function GET(request) {
  const secret = getSecret();
  const token = request.cookies.get(COOKIE_NAME)?.value || "";
  const authenticated = verifySessionToken(token, secret);
  return NextResponse.json(
    { authenticated },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request) {
  try {
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
    const secret = getSecret();

    if (!adminPassword || !secret) {
      return NextResponse.json(
        {
          success: false,
          error: "Server password not configured. Set ADMIN_PASSWORD in Vercel.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const password = String(body?.password || "");

    if (!safeEqual(password, adminPassword)) {
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json(
        { success: false, error: "Invalid admin password." },
        { status: 401 }
      );
    }

    const token = createSessionToken(secret);
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
    });
    return res;
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication failed." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
