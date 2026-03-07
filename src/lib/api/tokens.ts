import { requestJson } from "@/lib/api/http";
import type { WalletToken } from "@/types/wallet";

type TokenResponse = {
  tokens?: WalletToken[];
  error?: string;
};

export async function fetchWalletTokensByAddress(address: string) {
  const data = await requestJson<TokenResponse>(
    `/api/tokens?address=${address}`,
    { method: "GET" },
    "Unable to fetch token balances.",
  );

  if (!Array.isArray(data.tokens)) {
    return [];
  }

  return data.tokens;
}
