"use client";

import { mainnet } from "wagmi/chains";
import { useBalance } from "wagmi";
import WalletActions from "@/components/wallet/WalletActions";
import WalletSummary from "@/components/wallet/WalletSummary";
import WalletTokenList from "@/components/wallet/WalletTokenList";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletTokens } from "@/hooks/useWalletTokens";

export default function WalletPanel() {
  const {
    address,
    chain,
    chainId,
    connectDisabled,
    connectError,
    connectHint,
    disconnect,
    handleConnect,
    hasMetaMask,
    isAwaitingWallet,
    isMounted,
    isPending,
    showConnectedWallet,
    unsupportedNetwork,
  } = useWalletConnection();

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

  const { fetchTokens, isTokensLoading, tokens, tokensError } = useWalletTokens(
    {
      address,
      enabled: Boolean(
        showConnectedWallet && address && chainId === mainnet.id,
      ),
    },
  );

  return (
    <section className="rounded-2xl border border-white/15 bg-[rgba(5,15,38,0.8)] p-6 backdrop-blur-sm max-[700px]:p-4">
      <div className="mb-5">
        <h2 className="mb-1 text-xl font-semibold">Wallet</h2>
        <p className="leading-6 text-white/80">
          Connect MetaMask to read account and network details.
        </p>
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

      <WalletActions
        connectDisabled={connectDisabled}
        isAwaitingWallet={isAwaitingWallet}
        isMounted={isMounted}
        isPending={isPending}
        onConnect={() => {
          void handleConnect();
        }}
        onDisconnect={() => disconnect()}
        onRefresh={() => {
          refetch();
          void fetchTokens();
        }}
        showConnectedWallet={showConnectedWallet}
      />

      {connectError ? (
        <p className="mt-3 text-sm text-[#ff9b9b]">{connectError.message}</p>
      ) : null}
      {connectHint ? (
        <p className="mt-3 text-sm text-[#ffd690]">{connectHint}</p>
      ) : null}

      <WalletSummary
        address={address}
        balance={balance}
        chainId={chainId}
        chainName={chain?.name}
        isBalanceLoading={isBalanceLoading}
        showConnectedWallet={showConnectedWallet}
      />

      {unsupportedNetwork ? (
        <p className="mt-3 text-sm text-[#ffd690]">
          Switch to Ethereum Mainnet for supported behavior.
        </p>
      ) : null}
      {balanceError ? (
        <p className="mt-3 text-sm text-[#ff9b9b]">{balanceError.message}</p>
      ) : null}
      <WalletTokenList
        chainId={chainId}
        isTokensLoading={isTokensLoading}
        showConnectedWallet={showConnectedWallet}
        tokens={tokens}
        tokensError={tokensError}
      />
    </section>
  );
}
