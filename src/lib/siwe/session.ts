import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { SiweSession } from "@/types/auth";

const SESSION_COOKIE_NAME = "siwe_session";

function getSessionSecret() {
  const secret = process.env.SIWE_SESSION_SECRET;

  if (!secret) {
    throw new Error("Missing SIWE_SESSION_SECRET in environment.");
  }

  return secret;
}

function getSessionMaxAge() {
  const raw = Number(process.env.SIWE_SESSION_MAX_AGE_SECONDS ?? 86400);
  return Number.isFinite(raw) && raw > 0 ? raw : 86400;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

function encode(payload: object) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decode<T>(value: string) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function createSession(address: string, chainId: number) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + getSessionMaxAge() * 1000;

  const session: SiweSession = {
    address,
    chainId,
    issuedAt,
    expiresAt,
  };

  const encodedPayload = encode(session);
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function readSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  const session = decode<SiweSession>(encodedPayload);
  if (!session || session.expiresAt <= Date.now()) {
    return null;
  }

  return session;
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionMaxAge(),
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
