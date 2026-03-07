import { formatEther, getAddress } from "viem";

type BalanceData =
  | {
      symbol: string;
      value: bigint;
    }
  | null
  | undefined;

type WalletSummaryProps = {
  address?: string;
  balance: BalanceData;
  chainId?: number;
  chainName?: string;
  isBalanceLoading: boolean;
  showConnectedWallet: boolean;
};

function formatAddress(address: string) {
  const normalized = getAddress(address);
  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
}

export default function WalletSummary({
  address,
  balance,
  chainId,
  chainName,
  isBalanceLoading,
  showConnectedWallet,
}: WalletSummaryProps) {
  if (!showConnectedWallet || !address) {
    return <p className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-white/80">No wallet connected yet.</p>;
  }

  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
      <div className="rounded-xl border border-white/15 bg-white/4 p-3 transition hover:bg-white/6">
        <dt className="mb-1.5 text-[0.75rem] tracking-[0.09em] text-white/72 uppercase">
          Address
        </dt>
        <dd className="font-mono text-[0.95rem] text-white/95" title={address}>
          {formatAddress(address)}
        </dd>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/4 p-3 transition hover:bg-white/6">
        <dt className="mb-1.5 text-[0.75rem] tracking-[0.09em] text-white/72 uppercase">
          Network
        </dt>
        <dd className="font-mono text-[0.95rem] text-white/95">
          {chainName ?? "Unknown"} (ID: {chainId ?? "n/a"})
        </dd>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/4 p-3 transition hover:bg-white/6">
        <dt className="mb-1.5 text-[0.75rem] tracking-[0.09em] text-white/72 uppercase">
          Native Balance
        </dt>
        <dd className="font-mono text-[0.95rem] text-white/95">
          {isBalanceLoading
            ? "Loading..."
            : balance
              ? `${Number(formatEther(balance.value)).toFixed(6)} ${balance.symbol}`
              : "Unavailable"}
        </dd>
      </div>
    </dl>
  );
}
