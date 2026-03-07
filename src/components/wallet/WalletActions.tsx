import { useMemo } from "react";
import { useWalletContext } from "@/components/wallet/WalletContext";
import { getWalletActionState } from "@/lib/wallet/view-state";

export default function WalletActions() {
  const {
    connectDisabled,
    isAuthenticated,
    isAuthBusy,
    isAwaitingWallet,
    isMainnet,
    isMounted,
    isPending,
    onConnect,
    onDisconnect,
    onRefresh,
    onSignIn,
    onSignOut,
    showConnectedWallet,
  } = useWalletContext();

  const actionState = useMemo(
    () =>
      getWalletActionState({
        connectDisabled,
        isAuthenticated,
        isAuthBusy,
        isAwaitingWallet,
        isMainnet,
        isMounted,
        isPending,
        showConnectedWallet,
      }),
    [
      connectDisabled,
      isAuthenticated,
      isAuthBusy,
      isAwaitingWallet,
      isMainnet,
      isMounted,
      isPending,
      showConnectedWallet,
    ],
  );

  const handlePrimaryClick = () => {
    if (!showConnectedWallet) {
      onConnect();
      return;
    }

    if (isAuthenticated) {
      onSignOut();
      return;
    }

    onSignIn();
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2 sm:gap-3">
      <button
        className="w-full cursor-pointer rounded-full border border-[#39d89b]/60 bg-linear-to-r from-[#36d399] to-[#21c97f] px-4 py-2.5 text-[0.85rem] font-semibold text-[#03210f] shadow-[0_10px_24px_-14px_rgba(52,211,153,0.9)] transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9bf7d4] sm:w-auto sm:text-[0.92rem] disabled:cursor-not-allowed disabled:opacity-65"
        type="button"
        disabled={actionState.isPrimaryDisabled}
        onClick={handlePrimaryClick}
      >
        {actionState.primaryLabel}
      </button>

      {showConnectedWallet && (
        <div className="grid w-full grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:flex sm:w-auto sm:gap-3">
          <button
            className="cursor-pointer rounded-full border border-[#ffd25f]/60 bg-[#ffd25f] px-3 py-2.5 text-[0.85rem] font-semibold text-[#3b2a00] transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe9a9] sm:px-4 sm:text-[0.92rem]"
            type="button"
            onClick={onDisconnect}
          >
            Disconnect
          </button>
          <button
            className="cursor-pointer rounded-full border border-white/35 bg-white/5 px-3 py-2.5 text-[0.85rem] font-semibold text-[#f4f8ff] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:px-4 sm:text-[0.92rem]"
            type="button"
            onClick={onRefresh}
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
}
