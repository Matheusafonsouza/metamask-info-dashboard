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
    return <p className="text-white/80">No wallet connected yet.</p>;
  }

  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
      <div className="rounded-xl border border-white/15 bg-white/3 p-3">
        <dt className="mb-1.5 text-[0.8rem] tracking-[0.06em] text-white/75 uppercase">
          Address
        </dt>
        <dd className="font-mono text-[0.98rem]" title={address}>
          {formatAddress(address)}
        </dd>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/3 p-3">
        <dt className="mb-1.5 text-[0.8rem] tracking-[0.06em] text-white/75 uppercase">
          Network
        </dt>
        <dd className="font-mono text-[0.98rem]">
          {chainName ?? "Unknown"} (ID: {chainId ?? "n/a"})
        </dd>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/3 p-3">
        <dt className="mb-1.5 text-[0.8rem] tracking-[0.06em] text-white/75 uppercase">
          Native Balance
        </dt>
        <dd className="font-mono text-[0.98rem]">
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
