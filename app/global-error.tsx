"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#0A0A0B",
          color: "#F4F4F2",
          margin: 0,
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "24px 32px",
          }}
        >
          <div style={{ maxWidth: 560, width: "100%" }}>
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#C8F04B",
                margin: "0 0 24px",
              }}
            >
              Fatal error
            </p>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                margin: "0 0 20px",
              }}
            >
              The app failed to load.
            </h1>
            <p style={{ color: "#9E9EA6", lineHeight: 1.7, margin: "0 0 8px" }}>
              Reloading may fix it.
            </p>
            {error.digest && (
              <p
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 12,
                  color: "#5C5C64",
                  margin: "0 0 28px",
                }}
              >
                digest: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                marginTop: 20,
                height: 48,
                padding: "0 22px",
                background: "#C8F04B",
                color: "#0A0A0B",
                border: "none",
                borderRadius: 2,
                fontFamily: "ui-monospace, monospace",
                fontSize: 13,
                letterSpacing: "0.04em",
                cursor: "pointer",
              }}
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
