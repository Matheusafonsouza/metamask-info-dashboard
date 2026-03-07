import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { mainnet } from "wagmi/chains";

export const supportedChains = [mainnet] as const;

const configuredMainnetRpc = process.env.NEXT_PUBLIC_MAINNET_RPC_URL?.trim();
const defaultMainnetRpc = "https://ethereum.publicnode.com";

const mainnetRpcUrl =
  configuredMainnetRpc && configuredMainnetRpc.length > 0
    ? configuredMainnetRpc
    : defaultMainnetRpc;

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [
    injected({
      target: "metaMask",
      shimDisconnect: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(mainnetRpcUrl, {
      retryCount: 2,
      retryDelay: 400,
    }),
  },
  ssr: true,
});
