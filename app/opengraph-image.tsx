import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetches the real IBM Plex Mono weights used across the site so the
// social preview reads as the same product, not a generic export.
// Falls back to Satori's default font if the network fetch fails at
// build/request time, so the image still generates either way.
async function loadFont(weight: "400" | "600") {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@${weight}&display=swap`;
    // next/og's renderer only understands raw TrueType/OpenType, not
    // woff2. Google's CSS API only serves plain .ttf to user agents
    // it believes cannot decode woff2, an old IE UA reliably gets one.
    const css = await fetch(cssUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko" },
    }).then((res) => res.text());
    const fontUrl = css.match(/src: url\((.+?)\) format\('woff'\)/)?.[1];
    if (!fontUrl) return null;
    const data = await fetch(fontUrl).then((res) => res.arrayBuffer());
    return { name: "IBM Plex Mono", data, weight: Number(weight) as 400 | 600, style: "normal" as const };
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const fonts = (await Promise.all([loadFont("400"), loadFont("600")])).filter(
    (f): f is NonNullable<typeof f> => f !== null
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#07090a",
          padding: "80px 96px",
          fontFamily: "IBM Plex Mono",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#6ee7c0" }}>
          AVAN · ANOMALY LAB
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 64,
            fontWeight: 600,
            color: "#ffffff",
            lineHeight: 1.15,
          }}
        >
          Engineering, examined.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            color: "rgba(255,255,255,0.55)",
            maxWidth: 760,
          }}
        >
          Software engineering, applied philosophy, and the occasional experiment that
          should not work.
        </div>
        <div style={{ display: "flex", position: "absolute", right: 96, top: 96 }}>
          <svg width="96" height="96" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="9"
              fill="none"
              stroke="#6ee7c0"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="42 15"
              transform="rotate(-40 16 16)"
            />
            <circle cx="24.4" cy="9.6" r="1.6" fill="#6ee7c0" />
          </svg>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}

export const alt = SITE_NAME;
