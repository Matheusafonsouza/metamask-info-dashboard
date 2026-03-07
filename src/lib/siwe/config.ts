import { mainnet } from "wagmi/chains";
import type { NextRequest } from "next/server";

export const SIWE_ALLOWED_CHAIN_IDS = [mainnet.id] as const;
export const SIWE_STATEMENT = "Sign in to MetaMask Landing.";

export function getExpectedDomain(request: NextRequest) {
  return process.env.SIWE_DOMAIN ?? request.headers.get("host") ?? "localhost:3000";
}

export function getExpectedUri(request: NextRequest) {
  if (process.env.SIWE_URI) {
    return process.env.SIWE_URI;
  }

  const host = request.headers.get("host") ?? "localhost:3000";
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto ?? (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}
