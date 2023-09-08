<script lang="ts">
  import Toggle from './lib/Toggle.svelte';
  import { walletStore } from './lib/stores/WalletStore';
  import ConnectWallet from './lib/ConnectWallet.svelte';
  import {
    InjectedConnector,
    configureChains,
    createConfig,
    fetchBalance,
    fetchEnsAvatar,
    fetchEnsName,
    getNetwork,
  } from '@wagmi/core';
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
  import { onMount } from 'svelte';
  import { getAccount } from '@wagmi/core';
  import { get } from 'svelte/store';
  import { getPublicClient } from '@wagmi/core';

  const { chains, publicClient, webSocketPublicClient } = configureChains(
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

  const config = createConfig({
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

  const account = getAccount();
  const { chain } = getNetwork();

  export async function fetchAndSetEnsData(address: `0x${string}`) {
    const ensData = { ensName: null, avatarUrl: null };

    try {
      const ensName = await fetchEnsName({ address });

      if (ensName) {
        const avatarUrl = await fetchEnsAvatar({ name: ensName });
        Object.assign(ensData, { ensName, avatarUrl });
      }
    } catch (error) {
      console.error('Error fetching ENS data:', error);
    }

    return ensData;
  }

  onMount(async () => {
    const currentState = get(walletStore);

    if (currentState.status !== 'connected') {
      walletStore.update(state => ({ ...state, status: 'connecting' }));

      if (account.isConnected) {
        const ensData = await fetchAndSetEnsData(account.address as `0x${string}`);
        const balance = await fetchBalance({ address: account.address as `0x${string}` });
        const formattedBalance = await parseFloat(balance.formatted).toFixed(
          Math.max(2, Math.min(4, (balance.formatted.split('.')[1] || '').length)),
        );

        const publicClient = getPublicClient();

        walletStore.update(state => ({
          ...state,
          address: account.address as `0x${string}`,
          chain: publicClient.chain.name,
          chainId: publicClient.chain.id,
          status: 'connected',
          provider: publicClient,
          balance: formattedBalance + ' ' + balance.symbol,
          ...ensData,
        }));
      } else {
        walletStore.update(state => ({
          ...state,
          address: null,
          chain: chain?.name,
          status: 'disconnected',
        }));
      }
    }
  });
</script>

<main class="flex gap-2 ml-20">
  <ConnectWallet {config} {fetchAndSetEnsData} />
  <Toggle />
</main>
