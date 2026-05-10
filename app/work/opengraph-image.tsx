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
          background: "#FAFAFA",
          backgroundImage:
            "linear-gradient(rgba(11,11,12,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,11,12,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          padding: "64px 72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          color: "#0B0B0C",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px",
              background: "#F0F0F2",
              border: "3px solid #0B0B0C",
              boxShadow: "6px 6px 0 0 #0B0B0C",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              transform: "rotate(-2deg)",
            }}
          >
            <div style={{ width: 12, height: 12, background: "#0B0B0C" }} />
            GITHUB / REPOS
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              background: "#FFFFFF",
              border: "3px solid #0B0B0C",
              boxShadow: "6px 6px 0 0 #0B0B0C",
              fontWeight: 600,
              fontSize: 20,
            }}
          >
            yashvanth.com/work
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 124, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.9, color: "#0B0B0C", display: "flex" }}>
            My
          </div>
          <div style={{ display: "flex", marginTop: 8 }}>
            <div
              style={{
                fontSize: 124,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
                color: "#FAFAFA",
                background: "#0B0B0C",
                border: "4px solid #0B0B0C",
                boxShadow: "10px 10px 0 0 #0B0B0C",
                padding: "0 28px",
                transform: "rotate(-1deg)",
                display: "flex",
              }}
            >
              Work.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              background: "#0B0B0C",
              color: "#FAFAFA",
              border: "3px solid #0B0B0C",
              boxShadow: "4px 4px 0 0 #0B0B0C",
              fontWeight: 600,
              fontSize: 22,
            }}
          >
            Open source
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              background: "#FFFFFF",
              border: "3px solid #0B0B0C",
              boxShadow: "4px 4px 0 0 #0B0B0C",
              fontWeight: 600,
              fontSize: 22,
              transform: "rotate(-2deg)",
            }}
          >
            20+ projects
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              background: "#F0F0F2",
              color: "#0B0B0C",
              border: "3px solid #0B0B0C",
              boxShadow: "4px 4px 0 0 #0B0B0C",
              fontWeight: 600,
              fontSize: 22,
              transform: "rotate(1.5deg)",
            }}
          >
            Sorted by stars
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
