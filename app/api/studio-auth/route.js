import { NextResponse } from "next/server";
import crypto from "crypto";

function getSecret() {
  const raw = process.env.GEMINI_API_KEY || "786ai-hub-default-secret-key";
  return raw.replace(/[\s\r\n]+/g, "").trim() || "786ai-hub-default-secret-key";
}

function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  return data + "." + sig;
}

export async function POST(req) {
  try {
    const { action = "login", name = "", email = "", password = "" } = await req.json();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPass = String(password);

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (cleanPass.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
    if (action === "signup" && !String(name).trim()) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }

    const displayName =
      String(name).trim() ||
      cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").trim() ||
      "786AI User";

    const payload = {
      name: displayName,
      email: cleanEmail,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000
    };

    const token = signToken(payload);

    return NextResponse.json({
      ok: true,
      token,
      user: {
        name: displayName,
        email: cleanEmail
      }
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Authentication failed." }, { status: 500 });
  }
}
