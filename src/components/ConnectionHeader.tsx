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

  const title = connected
    ? "Wallet connected. Live account data is ready."
    : "Connect MetaMask and show live wallet info.";

  const subtitle = useMemo(() => {
    if (connected && address) {
      return `Connected as ${shortenAddress(address)}. Address, chain, and balance are now synced from MetaMask.`;
    }

    return "This starter reads your connected address, active chain, and native token balance directly in the browser.";
  }, [connected, address]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-[rgba(20,36,79,0.96)] to-[rgba(13,64,84,0.95)] p-6 shadow-[0_20px_55px_-24px_rgba(0,0,0,0.9)] max-[700px]:p-4">
      <div className="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full bg-[#74ffd4]/10 blur-2xl" />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="text-[0.72rem] tracking-[0.12em] text-[#8ddfcb] uppercase">
          Web3 MVP
        </p>
        <span
          className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.08em] uppercase ${
            connected
              ? "border-[#36d399]/45 bg-[#36d399]/15 text-[#aff4dd]"
              : "border-white/20 bg-white/8 text-white/75"
          }`}
        >
          {connected ? "Connected" : "Awaiting Wallet"}
        </span>
      </div>

      <h1 className="text-[clamp(1.7rem,4vw,2.65rem)] leading-[1.1] text-balance">
        {title}
      </h1>
      <p className="mt-3 max-w-[64ch] leading-6 text-white/90">{subtitle}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/18 bg-white/6 px-3 py-1 text-xs text-white/85">
          SIWE Enabled
        </span>
        <span className="rounded-full border border-white/18 bg-white/6 px-3 py-1 text-xs text-white/85">
          Ethereum Mainnet
        </span>
        <span className="rounded-full border border-white/18 bg-white/6 px-3 py-1 text-xs text-white/85">
          Live Token Index
        </span>
      </div>
    </div>
  );
}
