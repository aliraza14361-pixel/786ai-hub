import { ImageResponse } from "next/og";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    (<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", borderRadius: "14px", border: "3px solid #22d3ee", color: "#22d3ee", fontSize: 24, fontWeight: 800 }}>786</div>),
    { ...size }
  );
}