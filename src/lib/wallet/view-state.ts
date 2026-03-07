type WalletActionStateInput = {
  connectDisabled: boolean;
  isAuthenticated: boolean;
  isAuthBusy: boolean;
  isAwaitingWallet: boolean;
  isMainnet: boolean;
  isMounted: boolean;
  isPending: boolean;
  showConnectedWallet: boolean;
};

export type WalletActionState = {
  primaryLabel: string;
  isPrimaryDisabled: boolean;
};

export type StatusMessage = {
  text: string;
  className: string;
};

export function getWalletActionState({
  connectDisabled,
  isAuthenticated,
  isAuthBusy,
  isAwaitingWallet,
  isMainnet,
  isMounted,
  isPending,
  showConnectedWallet,
}: WalletActionStateInput): WalletActionState {
  if (!showConnectedWallet) {
    if (!isMounted) {
      return {
        primaryLabel: "Loading...",
        isPrimaryDisabled: connectDisabled,
      };
    }

    if (isPending || isAwaitingWallet) {
      return {
        primaryLabel: "Connecting...",
        isPrimaryDisabled: connectDisabled,
      };
    }

    return {
      primaryLabel: "Connect MetaMask",
      isPrimaryDisabled: connectDisabled,
    };
  }

  if (isAuthBusy) {
    return {
      primaryLabel: "Signing...",
      isPrimaryDisabled: true,
    };
  }

  if (isAuthenticated) {
    return {
      primaryLabel: "Sign Out",
      isPrimaryDisabled: false,
    };
  }

  return {
    primaryLabel: "Sign In with Ethereum",
    isPrimaryDisabled: !isMainnet,
  };
}

export function getTokenStatusMessage({
  isMainnet,
  isTokensLoading,
  tokensError,
  hasTokens,
}: {
  isMainnet: boolean;
  isTokensLoading: boolean;
  tokensError: string | null;
  hasTokens: boolean;
}): StatusMessage | null {
  if (!isMainnet) {
    return {
      text: "Token list is shown only on Ethereum Mainnet.",
      className: "text-[#ffd690]",
    };
  }

  if (isTokensLoading) {
    return {
      text: "Loading tokens...",
      className: "text-white/80",
    };
  }

  if (tokensError) {
    return {
      text: tokensError,
      className: "text-[#ff9b9b]",
    };
  }

  if (!hasTokens) {
    return {
      text: "No ERC-20 token balances found for this wallet.",
      className: "text-white/80",
    };
  }

  return null;
}

export function getConnectionBadge(connected: boolean) {
  if (connected) {
    return {
      label: "Connected",
      className: "border-[#36d399]/45 bg-[#36d399]/15 text-[#aff4dd]",
    };
  }

  return {
    label: "Awaiting Wallet",
    className: "border-white/20 bg-white/8 text-white/75",
  };
}

export function getConnectionHeroCopy(connected: boolean, shortAddress?: string) {
  if (connected && shortAddress) {
    return {
      title: "Wallet connected. Live account data is ready.",
      subtitle: `Connected as ${shortAddress}. Address, chain, and balance are now synced from MetaMask.`,
    };
  }

  return {
    title: "Connect MetaMask and show live wallet info.",
    subtitle:
      "This starter reads your connected address, active chain, and native token balance directly in the browser.",
  };
}
