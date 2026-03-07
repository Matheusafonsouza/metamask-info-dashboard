type WalletActionsProps = {
  connectDisabled: boolean;
  isAuthenticated: boolean;
  isAuthBusy: boolean;
  isAwaitingWallet: boolean;
  isMainnet: boolean;
  isMounted: boolean;
  isPending: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  showConnectedWallet: boolean;
};

export default function WalletActions({
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
}: WalletActionsProps) {
  const primaryLabel = !showConnectedWallet
    ? !isMounted
      ? "Loading..."
      : isPending || isAwaitingWallet
        ? "Connecting..."
        : "Connect MetaMask"
    : isAuthenticated
      ? isAuthBusy
        ? "Signing..."
        : "Sign Out"
      : isAuthBusy
        ? "Signing..."
        : "Sign In with Ethereum";

  const primaryDisabled = !showConnectedWallet
    ? connectDisabled
    : isAuthBusy || (!isAuthenticated && !isMainnet);

  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <button
        className="cursor-pointer rounded-full border-0 bg-[#21c97f] px-4 py-2.5 text-[0.92rem] font-semibold text-[#03210f] disabled:cursor-not-allowed disabled:opacity-65"
        type="button"
        disabled={primaryDisabled}
        onClick={!showConnectedWallet ? onConnect : isAuthenticated ? onSignOut : onSignIn}
      >
        {primaryLabel}
      </button>

      {showConnectedWallet ? (
        <>
          <button
            className="cursor-pointer rounded-full border-0 bg-[#ffd25f] px-4 py-2.5 text-[0.92rem] font-semibold text-[#3b2a00]"
            type="button"
            onClick={onDisconnect}
          >
            Disconnect
          </button>
          <button
            className="cursor-pointer rounded-full border border-white/40 bg-transparent px-4 py-2.5 text-[0.92rem] font-semibold text-[#f4f8ff]"
            type="button"
            onClick={onRefresh}
          >
            Refresh Data
          </button>
        </>
      ) : null}
    </div>
  );
}
