"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useAccount } from "wagmi";
import { formatWalletAddress } from "@/lib/wallet/format";
import {
  getConnectionBadge,
  getConnectionHeroCopy,
} from "@/lib/wallet/view-state";

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
  const shortAddress = useMemo(() => {
    if (!connected || !address) {
      return undefined;
    }

    return formatWalletAddress(address);
  }, [connected, address]);

  const heroCopy = useMemo(
    () => getConnectionHeroCopy(connected, shortAddress),
    [connected, shortAddress],
  );

  const badge = useMemo(() => getConnectionBadge(connected), [connected]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-[rgba(20,36,79,0.96)] to-[rgba(13,64,84,0.95)] p-4 shadow-[0_20px_55px_-24px_rgba(0,0,0,0.9)] sm:p-6">
      <div className="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full bg-[#74ffd4]/10 blur-2xl" />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="text-[0.72rem] tracking-[0.12em] text-[#8ddfcb] uppercase">
          Web3 MVP
        </p>
        <span
          className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.08em] uppercase ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <h1 className="text-[clamp(1.35rem,6vw,2.65rem)] leading-[1.1] text-balance">
        {heroCopy.title}
      </h1>
      <p className="mt-3 max-w-[64ch] text-[0.95rem] leading-6 text-white/90 sm:text-base">
        {heroCopy.subtitle}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap">
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
