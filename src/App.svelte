<script lang="ts">
  import delegateLogo from './assets/logo.svg';
  import { walletStore } from './lib/stores/WalletStore';
  import ConnectButton from './lib/ConnectButton.svelte';
  import {
    InjectedConnector,
    configureChains,
    createConfig,
    getNetwork,
    getPublicClient,
  } from '@wagmi/core';
  import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
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
        options: {
          projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
          showQrModal: true,
        },
      }),
    ],
  });

  $: address = $walletStore.address;
  $: status = $walletStore.status;

  const account = getAccount();
  const { chain } = getNetwork();

  onMount(() => {
    if (account.isConnected) {
      walletStore.set({
        address: account.address as `0x${string}`,
        chain: chain?.name,
        status: 'connected',
        // provider:
      });
    } else {
      walletStore.set({
        address: null,
        chain: chain?.name,
        status: 'disconnected',
        // provider:
      });
    }
  });

  const trimEthAddress = (address: string) =>
    [address.slice(0, 5), address.slice(address.length - 4)].join('...');
</script>

<main class="w-full m-auto flex flex-col gap-8">
  <div class="p-2 flex items-center m-auto w-full justify-center gap-4">
    <a class="cursor-default p-2" href="https://delegate.xyz/" target="_blank" rel="noreferrer">
      <img
        id="logo"
        class="logo h-24 p-6 transition duration-300 m-auto cursor-pointer"
        src={delegateLogo}
        alt="Delegate Logo"
        style="padding: 1.5em;"
      />
    </a>

    <ConnectButton {config} />
  </div>

  {#if status === 'connected'}
    <div>
      <p class="text-3xl">Welcome, {address && trimEthAddress(address)}!</p>

      <p class="text-[#888] pt-3 m-auto text-xl italic">
        You are {status} to {$walletStore.chain}.
      </p>
    </div>
  {:else}
    <div>
      <p class="text-4xl">Secure your onchain identity</p>

      <p class="text-[#888] pt-3 m-auto">
        Keep your vaulted NFTs and ERC20s safe by linking wallets together. Claim airdrops, prove
        token ownership, and more from you r hot wallet.
      </p>
    </div>
  {/if}
</main>
