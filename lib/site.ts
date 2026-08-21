// lib/site.ts
// Single source of truth for the site's canonical URL and shared
// metadata copy. Set NEXT_PUBLIC_SITE_URL once the real domain is
// live; nothing else in the app needs to change.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://avananomalylab.example";

export const SITE_NAME = "AvanAnomalyLab";
export const SITE_TAGLINE = "Engineering, examined.";
export const SITE_DESCRIPTION = "Exploring anomalies in code, science, and thought.";
