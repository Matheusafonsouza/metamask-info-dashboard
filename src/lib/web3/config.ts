import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { mainnet } from "wagmi/chains";

export const supportedChains = [mainnet] as const;

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [
    injected({
      target: "metaMask",
      shimDisconnect: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
});
