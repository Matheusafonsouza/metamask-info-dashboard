"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getAddress } from "viem";
import { useAccount } from "wagmi";

function shortenAddress(address: string) {
  const normalized = getAddress(address);
  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
}

export default function ConnectionHeader() {
  const { address, isConnected } = useAccount();
  const isMounted = useSyncExternalStore(
    () => () => {
      // no-op subscription to derive hydration-safe client mount state
    },
    () => true,
    () => false,
  );
  const connected = isMounted && isConnected && Boolean(address);

  const title = connected ? "Wallet connected. Live account data is ready." : "Connect MetaMask and show live wallet info.";

  const subtitle = useMemo(() => {
    if (connected && address) {
      return `Connected as ${shortenAddress(address)}. Address, chain, and balance are now synced from MetaMask.`;
    }

    return "This starter reads your connected address, active chain, and native token balance directly in the browser.";
  }, [connected, address]);

  return (
    <div className="rounded-2xl border border-white/15 bg-linear-to-br from-[rgba(17,31,68,0.95)] to-[rgba(15,56,73,0.95)] p-6 max-[700px]:p-4">
      <p className="mb-2 text-[0.78rem] tracking-[0.09em] text-[#8ddfcb] uppercase">Web3 MVP</p>
      <h1 className="text-[clamp(1.6rem,4vw,2.5rem)] leading-[1.15] text-balance">{title}</h1>
      <p className="mt-3 max-w-[62ch] leading-6 text-white/90">{subtitle}</p>
    </div>
  );
}
