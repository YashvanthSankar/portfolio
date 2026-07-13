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
          background: "#FCFCFC",
          color: "#111113",
          margin: 0,
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            style={{
              maxWidth: 480,
              width: "100%",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "13px",
                letterSpacing: "0.2em",
                color: "#A6A6AE",
                margin: 0,
              }}
            >
              FATAL
            </p>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                margin: "16px 0 12px",
              }}
            >
              The app failed to render.
            </h1>
            <p style={{ color: "#6F6F78", margin: "0 0 8px", fontSize: "15px", lineHeight: 1.6 }}>
              Reloading may fix it.
            </p>
            {error.digest && (
              <p
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "12px",
                  color: "#A6A6AE",
                  margin: "0 0 24px",
                }}
              >
                digest: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                marginTop: "16px",
                padding: "12px 24px",
                background: "#111113",
                color: "#FCFCFC",
                border: "none",
                borderRadius: 999,
                fontSize: "14px",
                fontWeight: 500,
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
