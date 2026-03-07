import { requestJson } from "@/lib/api/http";
import type { SessionResponse } from "@/types/auth";

type NonceResponse = {
  nonce?: string;
  error?: string;
};

type LogoutResponse = {
  ok?: boolean;
  error?: string;
};

export async function fetchSiweSession() {
  return requestJson<SessionResponse>(
    "/api/auth/session",
    { method: "GET" },
    "Unable to load authentication session.",
  );
}

export async function requestSiweNonce() {
  const data = await requestJson<NonceResponse>(
    "/api/auth/nonce",
    { method: "GET" },
    "Unable to request SIWE nonce.",
  );

  if (!data.nonce) {
    throw new Error(data.error ?? "Unable to request SIWE nonce.");
  }

  return data.nonce;
}

export async function verifySiweSignature({
  message,
  signature,
}: {
  message: string;
  signature: string;
}) {
  return requestJson<SessionResponse>(
    "/api/auth/verify",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message, signature }),
    },
    "SIWE verification failed.",
  );
}

export async function logoutSiweSession() {
  return requestJson<LogoutResponse>(
    "/api/auth/logout",
    { method: "POST" },
    "Unable to sign out.",
  );
}
