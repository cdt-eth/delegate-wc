<script lang="ts">
  import Modal from './Modal.svelte';
  import { walletStore, disconnectWallet, initialState } from './stores/WalletStore';
  import blockie from '../assets/blockie.png';
  import metamaskLogo from '../assets/metamask.svg';
  import walletConnectLogo from '../assets/walletconnectLogo.png';
  import xButton from '../assets/icons/xButton.svg';
  import leftArrow from '../assets/icons/leftArrow.svg';
  import questionMark from '../assets/icons/questionMark.svg';
  import copyIcon from '../assets/icons/copy.svg';
  import checkIcon from '../assets/icons/check.png';
  import disconnectIcon from '../assets/icons/disconnect.svg';
  import {
    connect,
    type Config,
    type PublicClient,
    type WebSocketPublicClient,
    fetchBalance,
  } from '@wagmi/core';
  import type { FallbackTransport } from 'viem';
  import Spinner from './Spinner.svelte';
  import Connectors from './Connectors.svelte';
  import NetworkSwitcher from './NetworkSwitcher.svelte';
  import DontHaveWallet from './DontHaveWallet.svelte';
  import GetAWallet from './GetAWallet.svelte';
  import AboutWallets from './AboutWallets.svelte';
  import { darkMode } from './stores/DarkModeStore';
  import {
    defaultState,
    errorState,
    metamaskStateStore,
    revisitingState,
  } from './stores/MetamaskStore';

  export let config: Config<
    PublicClient<FallbackTransport>,
    WebSocketPublicClient<FallbackTransport>
  >;
  export let fetchAndSetEnsData: (
    address: `0x${string}`,
  ) => Promise<{ ensName: null; avatarUrl: null }>;

  const trimEthAddress = (address: string) =>
    [address.slice(0, 5), address.slice(address.length - 4)].join('...');

  let showModal = true;

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    goBack();
  }

  let isDisconnecting = false;

  async function handleDisconnect() {
    isDisconnecting = true;
    await disconnectWallet();
    isDisconnecting = false;
    closeModal();
  }

  let copied = false;

  function copyToClipboard(text: string | null) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    copied = true;

    setTimeout(() => {
      copied = false;
    }, 300);
  }

  $: address = $walletStore.address;
  $: status = $walletStore.status;

  let aboutWallets = false;
  let dontHaveWallet = false;

  function handleAboutWallets() {
    aboutWallets = true;
  }
  function handleGetAWallet() {
    dontHaveWallet = true;
  }
  function goBack() {
    aboutWallets = false;
    dontHaveWallet = false;
    walletStore.set(initialState);
  }
</script>

<button
  on:click={openModal}
  class="rounded-xl border border-transparent h-11 px-3 dark:text-white dark:bg-dark-button text-light-text bg-light-button hover:bg-opacity-[60%] dark:hover:bg-opacity-[95%] cursor-pointer transition-border-color duration-200 focus:outline-none"
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
    Connect Wallet
  {/if}
</button>

<Modal {showModal} on:close={closeModal}>
  <div class="dark:text-white">
    <div class="flex items-center justify-between mb-6">
      {#if dontHaveWallet || aboutWallets || $walletStore.status === 'connecting'}
        <button
          class="dark:text-white w-6 h-6 cursor-pointer transform transition-transform duration-300 hover:bg-light-button dark:hover:bg-[#333333] hover:rounded-full"
          on:click={goBack}
        >
          <img class="w-3 h-3 m-auto" src={leftArrow} alt="x-button" />
        </button>
      {:else}
        <button
          class="dark:text-white w-6 h-6 cursor-pointer transform transition-transform duration-300 hover:bg-light-button dark:hover:bg-[#333333] hover:rounded-full"
          on:click={handleAboutWallets}
        >
          <img class="w-[18px] h-[18px] m-auto" src={questionMark} alt="x-button" />
        </button>
      {/if}
      <h2 class="text-xl font-semibold">
        {status === 'connecting'
          ? $walletStore.connector
          : dontHaveWallet
          ? 'Get A Wallet'
          : 'Connect Wallet'}
      </h2>

      <button
        class="dark:text-white w-6 h-6 cursor-pointer transform transition-transform duration-300 hover:bg-light-button dark:hover:bg-[#333333] hover:rounded-full"
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
        <div class="w-max m-auto">
          <div class="flex items-center relative">
            <img
              style=""
              class="rounded-full h-24 w-24 m-auto"
              src={$walletStore.avatarUrl || blockie}
              alt="avatar"
            />

            <NetworkSwitcher />
          </div>
        </div>
        <div />

        <div>
          <div class="flex items-center justify-center gap-2">
            <p class="font-semibold text-lg">
              {$walletStore.ensName || (address && trimEthAddress(address))}
            </p>

            <button
              class="bg-transparent border-none h-5 p-0"
              on:click={() => copyToClipboard($walletStore.address)}
            >
              {#if copied}
                <img class="ccheckopy w-5 h-5 cursor-pointer" src={checkIcon} alt="copied-icon" />
              {:else}
                <img class="copy w-5 h-5 cursor-pointer" src={copyIcon} alt="copy-icon" />
              {/if}
            </button>
          </div>
          <p class="text-[#888] text-md">{$walletStore.balance}</p>
        </div>

        <button
          class="bg-[#383838] w-full hover:bg-white hover:bg-opacity-10 transition duration-300 text-white p-3 rounded-2xl flex items-center justify-center gap-3 font-semibold"
          on:click={handleDisconnect}
        >
          <img src={disconnectIcon} alt="disconnect-icon" class="w-4 h-4" />
          Disconnect
        </button>
      </div>
    {:else if dontHaveWallet}
      <GetAWallet />
    {:else if aboutWallets}
      <AboutWallets />
    {:else}
      <Connectors {config} {closeModal} {fetchAndSetEnsData} />
      <DontHaveWallet {handleGetAWallet} />
    {/if}
  </div>
</Modal>

<style>
  .copy {
    opacity: 0.4;
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  .copy:hover {
    opacity: 1;
  }
</style>
