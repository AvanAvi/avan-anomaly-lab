// lib/security.ts
// Shared server-side hardening used by every route that accepts
// untrusted visitor input (contact form, research responses).

import { NextRequest } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";

const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_RE = /^[0-9a-fA-F:]+$/;

/**
 * Extracts the client IP from proxy headers and validates its shape
 * before it is ever used elsewhere (e.g. interpolated into a
 * third-party geolocation URL). Returns null rather than a header
 * value that merely looks like garbage.
 */
export function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const candidate = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";

  if (IPV4_RE.test(candidate) || (candidate.includes(":") && IPV6_RE.test(candidate))) {
    return candidate;
  }
  return null;
}

/**
 * Trims a string and caps it at maxLength. Never throws; returns an
 * empty string for non-string input so callers can validate required
 * fields separately.
 */
export function clampString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value);
}

/** Rough decoded byte size of a base64 (optionally data-URL prefixed) string. */
export function estimateBase64Bytes(value: string): number {
  const stripped = value.replace(/^data:[^;]+;base64,/, "");
  return Math.floor((stripped.length * 3) / 4);
}

/**
 * A simple, honest rate limit: counts rows from the same IP inserted
 * into `table` within the last `windowMinutes`, using the database
 * already in use elsewhere rather than adding new infrastructure.
 * This is a baseline deterrent against bursts of abuse, not a
 * distributed rate limiter; it is intentionally proportionate to a
 * personal site's actual threat model.
 */
export async function isRateLimited(
  supabase: SupabaseClient,
  table: string,
  ip: string,
  { windowMinutes, maxRequests }: { windowMinutes: number; maxRequests: number }
): Promise<boolean> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", since);

  if (error) {
    // Fail open: a rate-limit check failing should not take the whole
    // endpoint down, but it is worth knowing about.
    console.error(`Rate limit check failed for ${table}:`, error);
    return false;
  }

  return (count ?? 0) >= maxRequests;
}
