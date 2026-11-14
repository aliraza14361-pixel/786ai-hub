import { ImageResponse } from "next/og";
export const alt = "786 AI Hub — 100% Free AI Tools Directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #020617 0%, #0f172a 60%, #164e63 100%)", padding: "60px", color: "#ffffff" }}>
      <div style={{ display: "flex", padding: "10px 24px", borderRadius: "999px", background: "rgba(34,211,238,0.15)", border: "1px solid #22d3ee", color: "#22d3ee", fontSize: 22, fontWeight: 700, marginBottom: "24px" }}>100% FREE & AD-FREE AI DIRECTORY</div>
      <div style={{ display: "flex", fontSize: 80, fontWeight: 800, color: "#ffffff", marginBottom: "18px" }}>786 AI Hub</div>
      <div style={{ display: "flex", fontSize: 30, color: "#cbd5e1" }}>Discover the Best Free & Freemium AI Tools in One Place</div>
    </div>),
    { ...size }
  );
}