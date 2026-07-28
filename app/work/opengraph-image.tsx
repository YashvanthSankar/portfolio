import { ImageResponse } from "next/og";

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
          background: "#0A0A0B",
          backgroundImage:
            "radial-gradient(60% 70% at 20% 25%, rgba(200,240,75,0.14), transparent 60%), radial-gradient(50% 60% at 82% 80%, rgba(200,240,75,0.06), transparent 55%)",
          padding: "68px 76px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          color: "#F4F4F2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: "#C8F04B" }} />
            <div
              style={{
                display: "flex",
                fontSize: 19,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#9E9EA6",
              }}
            >
              GitHub / Repositories
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 19, color: "#9E9EA6" }}>
            yashvanth.com/work
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 130,
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 0.92,
            }}
          >
            Selected
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                fontSize: 130,
                fontWeight: 600,
                letterSpacing: "-0.05em",
                lineHeight: 0.92,
              }}
            >
              work
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 130,
                fontWeight: 600,
                lineHeight: 0.92,
                color: "#C8F04B",
              }}
            >
              .
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", width: "100%", height: 1, background: "rgba(244,244,242,0.12)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <div style={{ display: "flex", fontSize: 24 }}>Open source</div>
            <div style={{ display: "flex", fontSize: 24 }}>30+ repositories</div>
            <div style={{ display: "flex", fontSize: 24, color: "#5C5C64" }}>Sorted by stars</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
