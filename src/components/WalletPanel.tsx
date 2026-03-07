"use client";

import { useEffect, useRef } from "react";
import { mainnet } from "wagmi/chains";
import { useBalance } from "wagmi";
import WalletActions from "@/components/wallet/WalletActions";
import WalletSummary from "@/components/wallet/WalletSummary";
import WalletTokenList from "@/components/wallet/WalletTokenList";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useSiweAuth } from "@/hooks/useSiweAuth";
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

  const {
    authError,
    isAuthenticated,
    isBusy: isAuthBusy,
    session,
    signIn,
    signOut,
  } = useSiweAuth({
    address,
    chainId,
    enabled: showConnectedWallet,
  });

  const hasAutoPromptedSignInRef = useRef(false);

  useEffect(() => {
    if (!showConnectedWallet) {
      hasAutoPromptedSignInRef.current = false;
      return;
    }

    if (
      hasAutoPromptedSignInRef.current ||
      isAuthenticated ||
      isAuthBusy ||
      chainId !== mainnet.id
    ) {
      return;
    }

    hasAutoPromptedSignInRef.current = true;
    void signIn();
  }, [chainId, isAuthBusy, isAuthenticated, showConnectedWallet, signIn]);

  const signedInWithDifferentWallet =
    Boolean(session?.address && address) &&
    session?.address.toLowerCase() !== address?.toLowerCase();

  return (
    <section className="rounded-2xl border border-white/20 bg-[linear-gradient(160deg,rgba(5,15,38,0.88),rgba(7,20,47,0.82))] p-4 shadow-[0_22px_50px_-28px_rgba(0,0,0,0.95)] backdrop-blur-sm sm:p-6">
      <div className="mb-5 grid gap-2 sm:flex sm:items-start sm:justify-between sm:gap-3">
        <h2 className="mb-1 text-xl font-semibold">Wallet</h2>
        <p className="max-w-[48ch] text-[0.9rem] leading-6 text-white/80 sm:text-base">
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
        isAuthenticated={isAuthenticated}
        isAuthBusy={isAuthBusy}
        isAwaitingWallet={isAwaitingWallet}
        isMainnet={chainId === mainnet.id}
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
        onSignIn={() => {
          void signIn();
        }}
        onSignOut={() => {
          void signOut();
        }}
        showConnectedWallet={showConnectedWallet}
      />

      {connectError ? (
        <p className="mt-3 text-sm text-[#ff9b9b]">{connectError.message}</p>
      ) : null}
      {connectHint ? (
        <p className="mt-3 text-sm text-[#ffd690]">{connectHint}</p>
      ) : null}

      {showConnectedWallet ? (
        <div className="mt-4 mb-4 rounded-xl border border-white/15 bg-white/4 p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold tracking-[0.02em]">
              Authentication
            </h3>
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.68rem] tracking-[0.08em] text-white/78 uppercase">
              {isAuthenticated ? "Signed In" : "Not Signed In"}
            </span>
          </div>

          {signedInWithDifferentWallet ? (
            <p className="mb-3 text-sm text-[#ffd690]">
              Session belongs to another wallet. Sign out and sign in again with
              the connected address.
            </p>
          ) : null}

          {isAuthenticated ? (
            <div className="grid min-w-0 gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-sm text-white/80">
                Authenticated as{" "}
                <span className="font-mono break-all sm:break-normal">{session?.address}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-white/80">
              Sign once to enable authenticated features for this app session.
            </p>
          )}

          {chainId !== mainnet.id ? (
            <p className="mt-3 text-sm text-[#ffd690]">
              SIWE sign-in is enabled on Ethereum Mainnet only.
            </p>
          ) : null}
          {authError ? (
            <p className="mt-3 text-sm text-[#ff9b9b]">{authError}</p>
          ) : null}
        </div>
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
