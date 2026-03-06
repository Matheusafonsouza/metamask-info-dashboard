type WalletActionsProps = {
  connectDisabled: boolean;
  isAwaitingWallet: boolean;
  isMounted: boolean;
  isPending: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
  showConnectedWallet: boolean;
};

export default function WalletActions({
  connectDisabled,
  isAwaitingWallet,
  isMounted,
  isPending,
  onConnect,
  onDisconnect,
  onRefresh,
  showConnectedWallet,
}: WalletActionsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      {!showConnectedWallet ? (
        <button
          className="cursor-pointer rounded-full border-0 bg-[#21c97f] px-4 py-2.5 text-[0.92rem] font-semibold text-[#03210f] disabled:cursor-not-allowed disabled:opacity-65"
          type="button"
          disabled={connectDisabled}
          onClick={onConnect}
        >
          {!isMounted
            ? "Loading..."
            : isPending || isAwaitingWallet
              ? "Connecting..."
              : "Connect MetaMask"}
        </button>
      ) : (
        <button
          className="cursor-pointer rounded-full border-0 bg-[#ffd25f] px-4 py-2.5 text-[0.92rem] font-semibold text-[#3b2a00]"
          type="button"
          onClick={onDisconnect}
        >
          Disconnect
        </button>
      )}

      {showConnectedWallet ? (
        <button
          className="cursor-pointer rounded-full border border-white/40 bg-transparent px-4 py-2.5 text-[0.92rem] font-semibold text-[#f4f8ff]"
          type="button"
          onClick={onRefresh}
        >
          Refresh Data
        </button>
      ) : null}
    </div>
  );
}
