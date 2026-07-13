import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Yashvanth S · Full-Stack Developer & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const pill = {
  display: "flex",
  padding: "10px 22px",
  border: "1px solid #E4E4E7",
  borderRadius: 999,
  background: "#FFFFFF",
  color: "#6F6F78",
  fontSize: 22,
  fontWeight: 500,
} as const;

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
          background: "#FCFCFC",
          padding: "72px 80px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          color: "#111113",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#A6A6AE",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: "#111113" }} />
            Open to opportunities
          </div>
          <div style={{ display: "flex" }}>yashvanth.com</div>
        </div>

        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 108,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              display: "flex",
            }}
          >
            Yashvanth Sankar.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              color: "#6F6F78",
              display: "flex",
            }}
          >
            Full-stack developer & AI engineer — building fast, quiet products.
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={pill}>Full-Stack Dev</div>
          <div style={pill}>AI Engineer</div>
          <div style={pill}>CS Student</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
