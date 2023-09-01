<script lang="ts">
  import Modal from './Modal.svelte';
  import { walletStore, disconnectWallet } from './stores/WalletStore';
  import metamaskLogo from '../assets/metamask.svg';
  import blockie from '../assets/blockie.png';
  import walletConnectLogo from '../assets/walletConnect.png';
  import xButton from '../assets/xButton.svg';
  import {
    connect,
    type Config,
    type PublicClient,
    type WebSocketPublicClient,
    getAccount,
  } from '@wagmi/core';
  import type { FallbackTransport } from 'viem';
  import Spinner from './Spinner.svelte';

  export let config: Config<
    PublicClient<FallbackTransport>,
    WebSocketPublicClient<FallbackTransport>
  >;
  export let fetchAndSetEnsData: (
    address: `0x${string}`,
  ) => Promise<{ ensName: null; avatarUrl: null }>;

  export let trimEthAddress: (address: string) => string;

  let showModal = false;

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
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

  const account = getAccount();
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

      walletStore.update(state => ({
        ...state,
        address: result.account,
        chain: result.connector?.chains[0].name,
        status: 'connected',
        ...ensData,
      }));

      console.log('Connected walletStore:', walletStore);

      closeModal();
    } catch (error) {
      console.error('Error connecting:', error);
    }
  }

  async function handleClick() {
    if (status !== 'disconnected') {
      disconnectWallet();
    } else {
      openModal();
    }
  }

  $: address = $walletStore.address;
  $: status = $walletStore.status;
</script>

<button
  on:click={handleClick}
  class="rounded-lg border border-transparent px-4 py-3 text-base font-semibold bg-[#383838] hover:bg-white hover:bg-opacity-10 cursor-pointer transition-border-color duration-200 focus:outline-none"
>
  {#if status === 'connected'}
    <div class="flex items-center">
      <img
        src={$walletStore.avatarUrl ? $walletStore.avatarUrl : blockie}
        alt="wallet-icon"
        class="w-6 h-6 mr-2 rounded-full"
      />
      {address && ($walletStore.ensName ? $walletStore.ensName : trimEthAddress(address))}
    </div>
  {:else}
    Connect
  {/if}
</button>

<Modal {showModal} on:close={closeModal}>
  <div class="text-white">
    <div class="flex items-center justify-between mb-6">
      <div class="w-3" />
      <h2 class="text-xl font-semibold">
        {status === 'connecting' ? $walletStore.connector : 'Connect Wallet'}
      </h2>

      <button
        class="text-white w-6 h-6 cursor-pointer transform transition-transform duration-300 hover:bg-[#333333] hover:rounded-full"
        on:click={closeModal}
      >
        <img class="w-3 h-3 m-auto" src={xButton} alt="x-button" />
      </button>
    </div>

    {#if status === 'connecting'}
      <Spinner
        size="100px"
        color="#333"
        image={$walletStore.connector === 'Metamask' ? metamaskLogo : walletConnectLogo}
      />

      {#if $walletStore.connector === 'Metamask'}
        <div>
          <p class="font-bold text-lg">Requesting Connection</p>
          <p class="text-[#f3f3f3] text-sm">
            Open the Metamask browser extension to connect your wallet.
          </p>
        </div>
      {/if}
    {:else}
      <!-- Connectors -->
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
    {/if}
  </div>
</Modal>
