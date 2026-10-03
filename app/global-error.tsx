"use client";

// Last-resort boundary for errors in the root layout itself, so it
// renders its own document and relies on no app styles.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#05070a", color: "#e5e7eb", fontFamily: "ui-monospace, monospace" }}>
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <p style={{ letterSpacing: "0.3em", fontSize: 12, opacity: 0.7 }}>500 / ANOMALY</p>
          <h1 style={{ fontSize: 32, fontWeight: 400 }}>Something went wrong</h1>
          <button type="button" onClick={reset} style={{ marginTop: 24, padding: "8px 16px", background: "transparent", color: "inherit", border: "1px solid #374151", cursor: "pointer", font: "inherit" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
