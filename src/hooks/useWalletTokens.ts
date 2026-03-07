"use client";

import { useCallback, useEffect, useState } from "react";
import type { WalletToken } from "@/types/wallet";

type UseWalletTokensParams = {
  address?: string;
  enabled: boolean;
};

export function useWalletTokens({ address, enabled }: UseWalletTokensParams) {
  const [tokens, setTokens] = useState<WalletToken[]>([]);
  const [isTokensLoading, setIsTokensLoading] = useState(false);
  const [tokensError, setTokensError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    if (!enabled || !address) {
      setTokens([]);
      setTokensError(null);
      return;
    }

    setIsTokensLoading(true);
    setTokensError(null);

    try {
      const response = await fetch(`/api/tokens?address=${address}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as {
        tokens?: WalletToken[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to fetch token balances.");
      }

      setTokens(Array.isArray(data.tokens) ? data.tokens : []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to fetch token balances.";
      setTokens([]);
      setTokensError(message);
    } finally {
      setIsTokensLoading(false);
    }
  }, [address, enabled]);

  useEffect(() => {
    void fetchTokens();
  }, [fetchTokens]);

  return {
    fetchTokens,
    isTokensLoading,
    tokens,
    tokensError,
  };
}
