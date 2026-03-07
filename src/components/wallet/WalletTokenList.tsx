import { useMemo } from "react";
import { mainnet } from "wagmi/chains";
import { useWalletContext } from "@/components/wallet/WalletContext";
import { formatContractAddress } from "@/lib/wallet/format";
import { getTokenStatusMessage } from "@/lib/wallet/view-state";
import type { WalletToken } from "@/types/wallet";

type TokenRowProps = {
  token: WalletToken;
};

function TokenAvatar({ token }: TokenRowProps) {
  if (token.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="h-8 w-8 rounded-full border border-white/15 object-cover"
        src={token.logo}
        alt={`${token.symbol} logo`}
      />
    );
  }

  return (
    <div className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/10 text-[0.65rem] font-semibold text-white/85">
      {token.symbol.slice(0, 3).toUpperCase()}
    </div>
  );
}

function TokenRow({ token }: TokenRowProps) {
  return (
    <li
      key={token.contractAddress}
      className="grid grid-cols-1 gap-2 rounded-lg border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/7 min-[420px]:grid-cols-[1fr_auto] min-[420px]:gap-3"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <TokenAvatar token={token} />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {token.name}
          </p>
          <p
            className="truncate text-[0.72rem] text-white/68 sm:text-xs"
            title={token.contractAddress}
          >
            {token.symbol} · {formatContractAddress(token.contractAddress)}
          </p>
        </div>
      </div>

      <div className="min-[420px]:text-right">
        <p className="text-xs tracking-[0.08em] text-white/65 uppercase">
          {token.symbol}
        </p>
        <p className="font-mono text-sm text-[#9ef3cd]">{token.balance}</p>
      </div>
    </li>
  );
}

export default function WalletTokenList() {
  const {
    chainId,
    isTokensLoading,
    showConnectedWallet,
    tokens,
    tokensError,
  } = useWalletContext();

  const isMainnet = chainId === mainnet.id;
  const hasTokens = tokens.length > 0;

  const statusMessage = useMemo(
    () =>
      getTokenStatusMessage({
        isMainnet,
        isTokensLoading,
        tokensError,
        hasTokens,
      }),
    [isMainnet, isTokensLoading, tokensError, hasTokens],
  );

  const showTokenRows = isMainnet && hasTokens;

  if (!showConnectedWallet) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border border-white/15 bg-white/4 p-3 sm:p-4">
      <div className="mb-2 grid gap-2 min-[420px]:flex min-[420px]:items-center min-[420px]:justify-between">
        <h3 className="text-base font-semibold tracking-[0.02em]">
          ERC-20 Tokens
        </h3>
        <span className="w-fit rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.68rem] tracking-[0.08em] text-white/78 uppercase">
          {tokens.length} found
        </span>
      </div>

      {statusMessage && (
        <p className={`text-sm ${statusMessage.className}`}>
          {statusMessage.text}
        </p>
      )}

      {showTokenRows && (
        <ul className="mt-3 grid gap-2">
          {tokens.map((token) => (
            <TokenRow key={token.contractAddress} token={token} />
          ))}
        </ul>
      )}
    </div>
  );
}
