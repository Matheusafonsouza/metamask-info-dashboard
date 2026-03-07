import { formatEther, getAddress } from "viem";

type BalanceData =
  | {
      symbol: string;
      value: bigint;
    }
  | null
  | undefined;

function shortenHex(value: string, prefixLength = 6, suffixLength = 4) {
  return `${value.slice(0, prefixLength)}...${value.slice(-suffixLength)}`;
}

export function formatWalletAddress(address: string) {
  return shortenHex(getAddress(address));
}

export function formatContractAddress(address: string) {
  return shortenHex(address);
}

export function formatNetworkLabel(chainName?: string, chainId?: number) {
  const safeChainName = chainName ?? "Unknown";
  const safeChainId = chainId ?? "N/A";
  return `${safeChainName} (ID: ${safeChainId})`;
}

export function formatNativeBalanceText(
  balance: BalanceData,
  isBalanceLoading: boolean,
) {
  if (isBalanceLoading) {
    return "Loading...";
  }

  if (!balance) {
    return "Unavailable";
  }

  return `${Number(formatEther(balance.value)).toFixed(6)} ${balance.symbol}`;
}
