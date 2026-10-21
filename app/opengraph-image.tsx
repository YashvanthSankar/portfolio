import { ImageResponse } from "next/og";
import { NAME, ROLE } from "@/data/site";

export const alt = `${NAME} · ${ROLE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#111111",
          padding: "72px 80px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#666666" }}>yashvanth.com</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            {NAME}
          </div>
          <div style={{ display: "flex", fontSize: 36, color: "#666666" }}>{ROLE}. Chennai.</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
