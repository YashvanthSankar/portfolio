"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f7f7f5", color: "#111", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", padding: "32px" }}>
          <div style={{ maxWidth: 640 }}>
            <p style={{ color: "#6f6f69", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Application error</p>
            <h1 style={{ margin: "24px 0 0", fontSize: "clamp(48px, 9vw, 92px)", fontWeight: 500, letterSpacing: "-0.065em", lineHeight: 0.95 }}>The page stopped unexpectedly.</h1>
            <p style={{ maxWidth: 480, margin: "24px 0 0", color: "#6f6f69", fontSize: 16, lineHeight: 1.7 }}>Reload the interface and try again.</p>
            <button type="button" onClick={reset} style={{ marginTop: 32, border: 0, borderRadius: 999, background: "#111", color: "#fff", padding: "12px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Reload</button>
          </div>
        </main>
      </body>
    </html>
  );
}
