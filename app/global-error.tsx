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
      <body style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", background: "#FAFAFA", color: "#0B0B0C", margin: 0 }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div
            style={{
              maxWidth: 520,
              width: "100%",
              background: "#FFFFFF",
              border: "2.5px solid #0B0B0C",
              padding: "40px",
              boxShadow: "10px 10px 0 0 #0B0B0C",
            }}
          >
            <h1 style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.04em", margin: "0 0 16px" }}>
              Fatal error.
            </h1>
            <p style={{ color: "#6B6B70", marginBottom: "24px" }}>
              The entire app failed to render. Reloading may fix it.
            </p>
            {error.digest && (
              <p style={{ fontFamily: "ui-monospace, monospace", fontSize: "12px", color: "#6B6B70", marginBottom: "24px" }}>
                digest: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                padding: "12px 20px",
                background: "#0B0B0C",
                color: "#FAFAFA",
                border: "2.5px solid #0B0B0C",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "6px 6px 0 0 #0B0B0C",
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
