import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "My Work · Yashvanth S";
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
          <div style={{ display: "flex" }}>All projects</div>
          <div style={{ display: "flex" }}>yashvanth.com/work</div>
        </div>

        {/* Title */}
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
            My work.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              color: "#6F6F78",
              display: "flex",
            }}
          >
            Every public GitHub repository, sorted by stars.
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#6F6F78",
            fontSize: 24,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: 999, background: "#111113" }} />
          github.com/YashvanthSankar
        </div>
      </div>
    ),
    { ...size }
  );
}
