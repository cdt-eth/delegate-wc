import { InjectedConnector, configureChains, createConfig, getNetwork } from '@wagmi/core';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { publicProvider } from '@wagmi/core/providers/public';
import { infuraProvider } from '@wagmi/core/providers/infura';
import {
  type Chain,
  mainnet,
  goerli,
  sepolia,
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  base,
  baseGoerli,
  bsc,
  bscTestnet,
  canto,
  celo,
  celoAlfajores,
  fantom,
  fantomTestnet,
  gnosis,
  gnosisChiado,
  klaytn,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  zora,
  zoraTestnet,
} from '@wagmi/core/chains';

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    goerli,
    sepolia,
    arbitrum,
    arbitrumGoerli,
    avalanche,
    avalancheFuji,
    base,
    baseGoerli,
    bsc,
    bscTestnet,
    canto,
    celo,
    celoAlfajores,
    fantom,
    fantomTestnet,
    gnosis,
    gnosisChiado,
    klaytn,
    optimism,
    optimismGoerli,
    polygon,
    polygonMumbai,
    zora,
    zoraTestnet,
  ],
  [infuraProvider({ apiKey: import.meta.env.VITE_INFURA_PROJECT_ID }), publicProvider()],
);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Metamask',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
        showQrModal: false,
      },
    }),
  ],
});
