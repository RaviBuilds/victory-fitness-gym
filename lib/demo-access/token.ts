/**
 * DEMO ACCESS — signed access token + PIN check (server-side only).
 *
 * Uses the Web Crypto API (crypto.subtle) so the same code runs in proxy.ts
 * and in route handlers / server components. Nothing here is imported by a
 * client component.
 *
 * Token format:  v1.<expiry-unix-seconds>.<base64url HMAC-SHA256 signature>
 *
 * The HMAC key is derived from the signing secret AND the current PIN, so
 *  - a visitor cannot forge a token without the secret, and
 *  - changing the PIN immediately invalidates every previously issued cookie.
 * The raw PIN is never stored in the cookie.
 */
import {
  DEMO_ACCESS_MAX_AGE_SECONDS,
  DEMO_ACCESS_PIN,
  DEMO_ACCESS_SECRET_FALLBACK,
} from "@/config/demo-access";

const encoder = new TextEncoder();

function signingSecret(): string {
  return process.env.DEMO_ACCESS_SECRET || DEMO_ACCESS_SECRET_FALLBACK;
}

function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(`${signingSecret()}|${DEMO_ACCESS_PIN}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Create a signed access token that expires after the configured lifetime. */
export async function createAccessToken(): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + DEMO_ACCESS_MAX_AGE_SECONDS;
  const payload = `v1.${expires}`;
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(payload));
  return `${payload}.${toBase64Url(signature)}`;
}

/** True only for an untampered, unexpired token signed for the current PIN. */
export async function verifyAccessToken(token: string | null | undefined): Promise<boolean> {
  if (!token || token.length > 256) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;

  const expires = Number(parts[1]);
  if (!Number.isInteger(expires) || expires <= Math.floor(Date.now() / 1000)) return false;

  try {
    return await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      fromBase64Url(parts[2]),
      encoder.encode(`${parts[0]}.${parts[1]}`)
    );
  } catch {
    return false;
  }
}

/**
 * Constant-time PIN comparison: HMAC both values with the same key and let
 * crypto.subtle.verify (constant-time) compare the digests.
 */
export async function isPinCorrect(candidate: string): Promise<boolean> {
  if (!candidate || candidate.length > 128) return false;
  const key = await hmacKey();
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(candidate));
  return crypto.subtle.verify("HMAC", key, digest, encoder.encode(DEMO_ACCESS_PIN));
}

/** Only same-site absolute paths are accepted as a post-login destination. */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  if (value === "/demo-access" || value.startsWith("/demo-access/") || value.startsWith("/api/")) {
    return "/";
  }
  return value;
}
