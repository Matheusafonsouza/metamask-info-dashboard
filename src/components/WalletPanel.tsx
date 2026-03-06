"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatEther, getAddress } from "viem";
import { mainnet } from "wagmi/chains";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";

function formatAddress(address: string) {
  const normalized = getAddress(address);
  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
}

type WalletToken = {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  balance: string;
};

export default function WalletPanel() {
  const { address, chain, chainId, isConnected } = useAccount();
  const { connectAsync, connectors, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [connectHint, setConnectHint] = useState<string | null>(null);
  const [isAwaitingWallet, setIsAwaitingWallet] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [tokens, setTokens] = useState<WalletToken[]>([]);
  const [isTokensLoading, setIsTokensLoading] = useState(false);
  const [tokensError, setTokensError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const metaMaskConnector = useMemo(
    () =>
      connectors.find((connector) => connector.name.toLowerCase().includes("metamask")) ??
      connectors.find((connector) => connector.type === "injected") ??
      connectors[0],
    [connectors],
  );

  const hasMetaMask =
    isMounted && typeof window !== "undefined" && Boolean((window as Window & { ethereum?: { isMetaMask?: boolean } }).ethereum?.isMetaMask);

  const showConnectedWallet = isMounted && isConnected;

  const unsupportedNetwork = Boolean(showConnectedWallet && chainId && chainId !== mainnet.id);

  const {
    data: balance,
    isLoading: isBalanceLoading,
    error: balanceError,
    refetch,
  } = useBalance({
    address,
    chainId,
    query: {
      enabled: Boolean(showConnectedWallet && address && chainId),
    },
  });

  const connectDisabled = !isMounted || isPending || isAwaitingWallet || !metaMaskConnector || !hasMetaMask;
  const canFetchTokens = Boolean(showConnectedWallet && address && chainId === mainnet.id);

  const fetchTokens = useCallback(async () => {
    if (!canFetchTokens || !address) {
      setTokens([]);
      setTokensError(null);
      return;
    }

    setIsTokensLoading(true);
    setTokensError(null);

    try {
      const response = await fetch(`/api/tokens?address=${address}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as { tokens?: WalletToken[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to fetch token balances.");
      }

      setTokens(Array.isArray(data.tokens) ? data.tokens : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to fetch token balances.";
      setTokens([]);
      setTokensError(message);
    } finally {
      setIsTokensLoading(false);
    }
  }, [address, canFetchTokens]);

  useEffect(() => {
    void fetchTokens();
  }, [fetchTokens]);

  async function handleConnect() {
    if (!metaMaskConnector || connectDisabled) {
      return;
    }

    setConnectHint(null);
    setIsAwaitingWallet(true);

    try {
      await connectAsync({ connector: metaMaskConnector });
    } catch (error) {
      const err = error as { code?: number; message?: string };

      if (err?.code === -32002) {
        setConnectHint("A MetaMask permission request is already open. Open MetaMask and approve or reject it first.");
      } else if (err?.code === 4001) {
        setConnectHint("Connection was rejected in MetaMask.");
      }
    } finally {
      setIsAwaitingWallet(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/15 bg-[rgba(5,15,38,0.8)] p-6 backdrop-blur-sm max-[700px]:p-4">
      <div className="mb-5">
        <h2 className="mb-1 text-xl font-semibold">Wallet</h2>
        <p className="leading-6 text-white/80">Connect MetaMask to read account and network details.</p>
      </div>

      {isMounted && !hasMetaMask ? (
        <div className="mb-4 grid gap-1 rounded-xl border border-[rgba(255,195,0,0.45)] bg-[rgba(255,195,0,0.12)] p-3.5">
          <p>MetaMask was not detected in this browser.</p>
          <a
            className="w-fit text-[#ffe08c] underline"
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Install MetaMask
          </a>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-3">
        {!showConnectedWallet ? (
          <button
            className="cursor-pointer rounded-full border-0 bg-[#21c97f] px-4 py-2.5 text-[0.92rem] font-semibold text-[#03210f] disabled:cursor-not-allowed disabled:opacity-65"
            type="button"
            disabled={connectDisabled}
            onClick={handleConnect}
          >
            {!isMounted ? "Loading..." : isPending || isAwaitingWallet ? "Connecting..." : "Connect MetaMask"}
          </button>
        ) : (
          <button
            className="cursor-pointer rounded-full border-0 bg-[#ffd25f] px-4 py-2.5 text-[0.92rem] font-semibold text-[#3b2a00]"
            type="button"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        )}

        {showConnectedWallet ? (
          <button
            className="cursor-pointer rounded-full border border-white/40 bg-transparent px-4 py-2.5 text-[0.92rem] font-semibold text-[#f4f8ff]"
            type="button"
            onClick={() => {
              refetch();
              void fetchTokens();
            }}
          >
            Refresh Data
          </button>
        ) : null}
      </div>

      {connectError ? <p className="mt-3 text-sm text-[#ff9b9b]">{connectError.message}</p> : null}
      {connectHint ? <p className="mt-3 text-sm text-[#ffd690]">{connectHint}</p> : null}

      {showConnectedWallet && address ? (
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
          <div className="rounded-xl border border-white/15 bg-white/3 p-3">
            <dt className="mb-1.5 text-[0.8rem] tracking-[0.06em] text-white/75 uppercase">Address</dt>
            <dd className="font-mono text-[0.98rem]" title={address}>
              {formatAddress(address)}
            </dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/3 p-3">
            <dt className="mb-1.5 text-[0.8rem] tracking-[0.06em] text-white/75 uppercase">Network</dt>
            <dd className="font-mono text-[0.98rem]">
              {chain?.name ?? "Unknown"} (ID: {chainId ?? "n/a"})
            </dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/3 p-3">
            <dt className="mb-1.5 text-[0.8rem] tracking-[0.06em] text-white/75 uppercase">Native Balance</dt>
            <dd className="font-mono text-[0.98rem]">
              {isBalanceLoading
                ? "Loading..."
                : balance
                  ? `${Number(formatEther(balance.value)).toFixed(6)} ${balance.symbol}`
                  : "Unavailable"}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="text-white/80">No wallet connected yet.</p>
      )}

      {unsupportedNetwork ? <p className="mt-3 text-sm text-[#ffd690]">Switch to Ethereum Mainnet for supported behavior.</p> : null}
      {balanceError ? <p className="mt-3 text-sm text-[#ff9b9b]">{balanceError.message}</p> : null}

      {showConnectedWallet ? (
        <div className="mt-4 rounded-xl border border-white/15 bg-white/3 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold">ERC-20 Tokens</h3>
            <span className="text-xs text-white/70">{tokens.length} found</span>
          </div>

          {chainId !== mainnet.id ? <p className="text-sm text-[#ffd690]">Token list is shown only on Ethereum Mainnet.</p> : null}
          {chainId === mainnet.id && isTokensLoading ? <p className="text-sm text-white/80">Loading tokens...</p> : null}
          {chainId === mainnet.id && tokensError ? <p className="text-sm text-[#ff9b9b]">{tokensError}</p> : null}
          {chainId === mainnet.id && !isTokensLoading && !tokensError && tokens.length === 0 ? (
            <p className="text-sm text-white/80">No ERC-20 token balances found for this wallet.</p>
          ) : null}

          {chainId === mainnet.id && tokens.length > 0 ? (
            <ul className="mt-3 grid gap-2">
              {tokens.map((token) => (
                <li key={token.contractAddress} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{token.name}</p>
                    <p className="truncate text-xs text-white/70">{token.symbol} · {token.contractAddress}</p>
                  </div>
                  <p className="text-right font-mono text-sm text-white">{token.balance}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
