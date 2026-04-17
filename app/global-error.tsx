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
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#F4EFE6", color: "#1A1A1A", margin: 0 }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div
            style={{
              maxWidth: 520,
              width: "100%",
              background: "#FCF9F0",
              border: "2.5px solid #1A1A1A",
              padding: "40px",
              boxShadow: "10px 10px 0 0 #1A1A1A",
            }}
          >
            <h1 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
              Fatal error.
            </h1>
            <p style={{ color: "#5a5449", marginBottom: "24px" }}>
              The entire app failed to render. Reloading may fix it.
            </p>
            {error.digest && (
              <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#5a5449", marginBottom: "24px" }}>
                digest: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                padding: "12px 20px",
                background: "#DA1A3F",
                color: "#FCF9F0",
                border: "2.5px solid #1A1A1A",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "6px 6px 0 0 #1A1A1A",
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
