"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { mainnet } from "wagmi/chains";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function useWalletConnection() {
  const { address, chain, chainId, isConnected } = useAccount();
  const {
    connectAsync,
    connectors,
    error: connectError,
    isPending,
  } = useConnect();
  const { disconnect } = useDisconnect();

  const [connectHint, setConnectHint] = useState<string | null>(null);
  const [isAwaitingWallet, setIsAwaitingWallet] = useState(false);

  const isMounted = useSyncExternalStore(
    () => () => {
      // no-op subscription to keep server and first client render aligned
    },
    () => true,
    () => false,
  );

  const metaMaskConnector = useMemo(
    () =>
      connectors.find((connector) =>
        connector.name.toLowerCase().includes("metamask"),
      ) ??
      connectors.find((connector) => connector.type === "injected") ??
      connectors[0],
    [connectors],
  );

  const hasMetaMask =
    isMounted &&
    typeof window !== "undefined" &&
    Boolean(
      (window as Window & { ethereum?: { isMetaMask?: boolean } }).ethereum
        ?.isMetaMask,
    );

  const showConnectedWallet = isMounted && isConnected;
  const unsupportedNetwork = Boolean(
    showConnectedWallet && chainId && chainId !== mainnet.id,
  );
  const connectDisabled =
    !isMounted ||
    isPending ||
    isAwaitingWallet ||
    !metaMaskConnector ||
    !hasMetaMask;

  const handleConnect = useCallback(async () => {
    if (!metaMaskConnector || connectDisabled) {
      return;
    }

    setConnectHint(null);
    setIsAwaitingWallet(true);

    try {
      await connectAsync({ connector: metaMaskConnector });
    } catch (error) {
      const err = error as { code?: number };

      if (err?.code === -32002) {
        setConnectHint(
          "A MetaMask permission request is already open. Open MetaMask and approve or reject it first.",
        );
      } else if (err?.code === 4001) {
        setConnectHint("Connection was rejected in MetaMask.");
      }
    } finally {
      setIsAwaitingWallet(false);
    }
  }, [connectAsync, connectDisabled, metaMaskConnector]);

  return {
    address,
    chain,
    chainId,
    connectDisabled,
    connectError,
    connectHint,
    disconnect,
    handleConnect,
    hasMetaMask,
    isAwaitingWallet,
    isMounted,
    isPending,
    showConnectedWallet,
    unsupportedNetwork,
  };
}
