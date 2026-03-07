"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { WalletToken } from "@/types/wallet";

type BalanceData =
  | {
      symbol: string;
      value: bigint;
    }
  | null
  | undefined;

type WalletContextValue = {
  address?: string;
  balance: BalanceData;
  chainId?: number;
  chainName?: string;
  connectDisabled: boolean;
  isAuthenticated: boolean;
  isAuthBusy: boolean;
  isAwaitingWallet: boolean;
  isBalanceLoading: boolean;
  isMainnet: boolean;
  isMounted: boolean;
  isPending: boolean;
  isTokensLoading: boolean;
  showConnectedWallet: boolean;
  tokens: WalletToken[];
  tokensError: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

type WalletContextProviderProps = {
  value: WalletContextValue;
  children: ReactNode;
};

export function WalletContextProvider({
  value,
  children,
}: WalletContextProviderProps) {
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWalletContext() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWalletContext must be used within WalletContextProvider.");
  }

  return context;
}
