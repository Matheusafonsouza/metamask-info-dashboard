import { mainnet } from "wagmi/chains";
import type { WalletToken } from "@/types/wallet";

type WalletTokenListProps = {
  chainId?: number;
  isTokensLoading: boolean;
  showConnectedWallet: boolean;
  tokens: WalletToken[];
  tokensError: string | null;
};

export default function WalletTokenList({
  chainId,
  isTokensLoading,
  showConnectedWallet,
  tokens,
  tokensError,
}: WalletTokenListProps) {
  if (!showConnectedWallet) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border border-white/15 bg-white/3 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">ERC-20 Tokens</h3>
        <span className="text-xs text-white/70">{tokens.length} found</span>
      </div>

      {chainId !== mainnet.id ? (
        <p className="text-sm text-[#ffd690]">
          Token list is shown only on Ethereum Mainnet.
        </p>
      ) : null}
      {chainId === mainnet.id && isTokensLoading ? (
        <p className="text-sm text-white/80">Loading tokens...</p>
      ) : null}
      {chainId === mainnet.id && tokensError ? (
        <p className="text-sm text-[#ff9b9b]">{tokensError}</p>
      ) : null}
      {chainId === mainnet.id &&
      !isTokensLoading &&
      !tokensError &&
      tokens.length === 0 ? (
        <p className="text-sm text-white/80">
          No ERC-20 token balances found for this wallet.
        </p>
      ) : null}

      {chainId === mainnet.id && tokens.length > 0 ? (
        <ul className="mt-3 grid gap-2">
          {tokens.map((token) => (
            <li
              key={token.contractAddress}
              className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {token.name}
                </p>
                <p className="truncate text-xs text-white/70">
                  {token.symbol} · {token.contractAddress}
                </p>
              </div>
              <p className="text-right font-mono text-sm text-white">
                {token.balance}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
