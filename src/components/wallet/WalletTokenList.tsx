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
  function shortenContract(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  if (!showConnectedWallet) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border border-white/15 bg-white/4 p-3 sm:p-4">
      <div className="mb-2 grid gap-2 min-[420px]:flex min-[420px]:items-center min-[420px]:justify-between">
        <h3 className="text-base font-semibold tracking-[0.02em]">ERC-20 Tokens</h3>
        <span className="w-fit rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.68rem] tracking-[0.08em] text-white/78 uppercase">
          {tokens.length} found
        </span>
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
              className="grid grid-cols-1 gap-2 rounded-lg border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/7 min-[420px]:grid-cols-[1fr_auto] min-[420px]:gap-3"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {token.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="h-8 w-8 rounded-full border border-white/15 object-cover"
                    src={token.logo}
                    alt={`${token.symbol} logo`}
                  />
                ) : (
                  <div className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/10 text-[0.65rem] font-semibold text-white/85">
                    {token.symbol.slice(0, 3).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {token.name}
                  </p>
                  <p className="truncate text-[0.72rem] text-white/68 sm:text-xs" title={token.contractAddress}>
                    {token.symbol} · {shortenContract(token.contractAddress)}
                  </p>
                </div>
              </div>

              <div className="min-[420px]:text-right">
                <p className="text-xs tracking-[0.08em] text-white/65 uppercase">
                  {token.symbol}
                </p>
                <p className="font-mono text-sm text-[#9ef3cd]">
                  {token.balance}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
