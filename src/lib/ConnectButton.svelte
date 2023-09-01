<script lang="ts">
  import Modal from './Modal.svelte';
  import { walletStore, disconnectWallet } from './stores/WalletStore';
  import metamaskLogo from '../assets/metamask.svg';
  import blockie from '../assets/blockie.png';
  import walletConnectLogo from '../assets/walletConnect.png';
  import xButton from '../assets/xButton.svg';
  import copyIcon from '../assets/copy.svg';
  import disconnectIcon from '../assets/disconnect.svg';
  import {
    connect,
    type Config,
    type PublicClient,
    type WebSocketPublicClient,
    getAccount,
    fetchBalance,
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

  let isDisconnecting = false;
  async function handleDisconnect() {
    isDisconnecting = true;
    await disconnectWallet();
    isDisconnecting = false;
    closeModal();
  }

  $: address = $walletStore.address;
  $: status = $walletStore.status;
</script>

<button
  on:click={openModal}
  class="rounded-lg border border-transparent px-4 py-3 text-base font-semibold bg-[#383838] hover:bg-white hover:bg-opacity-10 cursor-pointer transition-border-color duration-200 focus:outline-none"
>
  {#if status === 'connecting'}
    <Spinner size="16px" color="#fff" />
  {:else if status === 'connected'}
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

    {#if status === 'connecting' || isDisconnecting}
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
    {:else if status !== 'disconnected'}
      <div class="flex flex-col gap-6">
        <img
          class="rounded-full h-24 w-24 m-auto"
          src={$walletStore.avatarUrl || blockie}
          alt="avatar"
        />
        <div />

        <div>
          <div class="flex items-center justify-center gap-2">
            <p class="font-semibold text-lg">
              {$walletStore.ensName || (address && trimEthAddress(address))}
            </p>
            <img class="w-5 h-5 cursor-pointer" src={copyIcon} alt="copy-icon" />
          </div>
          <p class="text-[#888] text-md">{$walletStore.balance}</p>
        </div>

        <button
          class="bg-[#383838] w-full hover:bg-white hover:bg-opacity-10 text-white p-3 rounded-2xl flex items-center justify-center gap-3 font-semibold"
          on:click={handleDisconnect}
        >
          <img src={disconnectIcon} alt="disconnect-icon" class="w-4 h-4" />
          Disconnect
        </button>
      </div>
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
