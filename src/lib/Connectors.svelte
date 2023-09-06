<script lang="ts">
  import type { FallbackTransport } from 'viem';
  import metamaskLogo from '../assets/metamask.svg';
  import walletConnectLogo from '../assets/walletconnectLogo.png';
  import {
    connect,
    type Config,
    type PublicClient,
    type WebSocketPublicClient,
    fetchBalance,
  } from '@wagmi/core';

  export let config: Config<
    PublicClient<FallbackTransport>,
    WebSocketPublicClient<FallbackTransport>
  >;
  export let connectWallet: (index: number) => void;

  function getWalletIcon(index: number) {
    switch (index) {
      case 0:
        return metamaskLogo;
      case 1:
        return walletConnectLogo;
      default:
        return walletConnectLogo;
    }
  }
</script>

<div class="flex flex-col gap-4">
  {#each [...config.connectors] as connector, index}
    <button
      class="bg-light-button hover:bg-opacity-[60%] dark:bg-[#383838] dark:hover:bg-white dark:hover:bg-opacity-10 dark:text-white px-3 py-2 rounded-2xl"
      on:click={() => connectWallet(index)}
    >
      <div class="flex justify-between items-center p-2">
        <p class="font-semibold text-lg">{connector.name}</p>

        <img class="h-8 w-8" src={getWalletIcon(index)} alt={connector.name} />
      </div>
    </button>
  {/each}
</div>
