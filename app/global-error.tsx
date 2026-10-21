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
          background: "#fff",
          color: "#111",
          margin: 0,
          padding: "96px 20px",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            The app failed to load.
          </h1>
          <p style={{ color: "#666", margin: "0 0 8px" }}>Reloading may fix it.</p>
          {error.digest && (
            <p style={{ color: "#666", fontSize: 15, margin: "0 0 24px" }}>Digest: {error.digest}</p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              height: 44,
              padding: "0 18px",
              background: "#111",
              color: "#fff",
              border: 0,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
