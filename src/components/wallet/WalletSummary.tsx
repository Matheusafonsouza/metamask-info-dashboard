import {
  formatNativeBalanceText,
  formatNetworkLabel,
  formatWalletAddress,
} from "@/lib/wallet/format";

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

export default function WalletSummary({
  address,
  balance,
  chainId,
  chainName,
  isBalanceLoading,
  showConnectedWallet,
}: WalletSummaryProps) {
  const balanceText = formatNativeBalanceText(balance, isBalanceLoading);
  const networkLabel = formatNetworkLabel(chainName, chainId);

  if (!showConnectedWallet || !address) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-white/80">
        No wallet connected yet.
      </p>
    );
  }

  return (
    <dl className="grid grid-cols-1 gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] sm:gap-3">
      <div className="rounded-xl border border-white/15 bg-white/4 p-3 transition hover:bg-white/6">
        <dt className="mb-1.5 text-[0.75rem] tracking-[0.09em] text-white/72 uppercase">
          Address
        </dt>
        <dd
          className="font-mono text-[0.9rem] text-white/95 sm:text-[0.95rem]"
          title={address}
        >
          {formatWalletAddress(address)}
        </dd>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/4 p-3 transition hover:bg-white/6">
        <dt className="mb-1.5 text-[0.75rem] tracking-[0.09em] text-white/72 uppercase">
          Network
        </dt>
        <dd className="font-mono text-[0.9rem] text-white/95 sm:text-[0.95rem]">
          {networkLabel}
        </dd>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/4 p-3 transition hover:bg-white/6">
        <dt className="mb-1.5 text-[0.75rem] tracking-[0.09em] text-white/72 uppercase">
          Native Balance
        </dt>
        <dd className="font-mono text-[0.9rem] text-white/95 sm:text-[0.95rem]">
          {balanceText}
        </dd>
      </div>
    </dl>
  );
}
