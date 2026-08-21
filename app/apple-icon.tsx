import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same ring-with-a-gap mark as app/icon.svg, rendered as a PNG since
// iOS home screen icons don't accept SVG.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07090a",
        }}
      >
        <svg width="130" height="130" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="9"
            fill="none"
            stroke="#6ee7c0"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="42 15"
            transform="rotate(-40 16 16)"
          />
          <circle cx="24.4" cy="9.6" r="2.1" fill="#6ee7c0" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
