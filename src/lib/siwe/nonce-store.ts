import { randomBytes } from "node:crypto";

const nonces = new Map<string, number>();

function nonceTtlSeconds() {
  const raw = Number(process.env.SIWE_NONCE_TTL_SECONDS ?? 600);
  return Number.isFinite(raw) && raw > 0 ? raw : 600;
}

function purgeExpiredNonces() {
  const now = Date.now();

  for (const [nonce, expiresAt] of nonces.entries()) {
    if (expiresAt <= now) {
      nonces.delete(nonce);
    }
  }
}

export function issueNonce() {
  purgeExpiredNonces();

  const nonce = randomBytes(16).toString("hex");
  const expiresAt = Date.now() + nonceTtlSeconds() * 1000;

  nonces.set(nonce, expiresAt);
  return nonce;
}

export function consumeNonce(nonce: string) {
  purgeExpiredNonces();

  const expiresAt = nonces.get(nonce);
  if (!expiresAt) {
    return false;
  }

  nonces.delete(nonce);
  return expiresAt > Date.now();
}
