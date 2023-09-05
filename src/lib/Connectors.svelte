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

  import { walletStore } from './stores/WalletStore';

  export let config: Config<
    PublicClient<FallbackTransport>,
    WebSocketPublicClient<FallbackTransport>
  >;

  export let fetchAndSetEnsData: (
    address: `0x${string}`,
  ) => Promise<{ ensName: null; avatarUrl: null }>;

  export let closeModal: () => void;

  async function connectWallet(index: number) {
    try {
      walletStore.update(state => ({
        ...state,
        status: 'connecting',

        connector: config.connectors[index].name,
      }));

      const result = await connect({
        connector: config.connectors[index],
      });
      console.log('Connected successfully:', result);

      const ensData = await fetchAndSetEnsData(result.account);
      const balance = await fetchBalance({ address: result.account as `0x${string}` });
      const formattedBalance = parseFloat(balance.formatted).toFixed(
        Math.min(4, (balance.formatted.split('.')[1] || '').length),
      );

      walletStore.update(state => ({
        ...state,
        address: result.account,
        chain: result.connector?.chains[0].name,
        status: 'connected',
        balance: formattedBalance + ' ' + balance.symbol,
        ...ensData,
      }));

      console.log('Connected walletStore:', walletStore);

      closeModal();
    } catch (error) {
      console.error('Error connecting:', error);
    }
  }

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
      class="bg-[#383838] hover:bg-white hover:bg-opacity-10 text-white px-3 py-2 rounded-2xl"
      on:click={() => connectWallet(index)}
    >
      <div class="flex justify-between items-center p-2">
        <p class="font-semibold text-lg">{connector.name}</p>

        <img class="h-8 w-8" src={getWalletIcon(index)} alt={connector.name} />
      </div>
    </button>
  {/each}
</div>
