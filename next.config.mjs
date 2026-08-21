/** @type {import('next').NextConfig} */

// A baseline, tested CSP. Kept deliberately simple: no nonces, no
// strict-dynamic, because this app has no third-party scripts or
// fonts to allow for (next/font self-hosts at build time, and no
// client code calls out to Supabase directly). 'unsafe-inline' on
// script/style is a pragmatic trade-off for Next.js App Router's
// inline RSC payload and font-face injection, still meaningfully
// restricts everything else: no third-party script origins, no
// framing, no plugin content.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // The contact form uses the camera, microphone, and geolocation itself
  // (with consent), so these are scoped to same-origin rather than disabled.
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(self), interest-cohort=()' },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
