// Layer 5 — URL sanitization. Prevents javascript:, data:, and other dangerous schemes.
const ALLOWED_PROTOCOLS = ["http:", "https:"];
const BLOCKED_PATTERNS = [/javascript:/i, /data:/i, /vbscript:/i, /file:/i];

export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return false;
    if (BLOCKED_PATTERNS.some((p) => p.test(trimmed))) return false;
    return true;
  } catch {
    return false;
  }
}

export function safeHref(url: string): string {
  return isValidUrl(url) ? url : "#";
}