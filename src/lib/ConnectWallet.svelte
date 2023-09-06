<script lang="ts">
  import Modal from './Modal.svelte';
  import { walletStore, disconnectWallet, initialState } from './stores/WalletStore';
  import blockie from '../assets/blockie.png';
  import metamaskLogo from '../assets/metamask.svg';
  import walletConnectLogo from '../assets/walletconnectLogo.png';
  import xButton from '../assets/icons/xButton.svg';
  import leftArrow from '../assets/icons/leftArrow.svg';
  import questionMark from '../assets/icons/questionMark.svg';
  import checkIcon from '../assets/icons/check.png';
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

  let showModal = false;

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  let isDisconnecting = false;

  async function handleDisconnect() {
    isDisconnecting = true;
    await disconnectWallet();
    isDisconnecting = false;
    closeModal();
    resetModalState();
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
  function resetModalState() {
    aboutWallets = false;
    dontHaveWallet = false;
    walletStore.set(initialState);
    metamaskStateStore.set(defaultState);
  }

  async function connectWallet(index: number) {
    try {
      walletStore.update(state => ({
        ...state,
        status: 'connecting',

        connector: config.connectors[index].name,
      }));

      if (config.connectors[index].name === 'Metamask') {
        setTimeout(() => {
          if ($metamaskStateStore.errorCircle) {
            metamaskStateStore.set(errorState);
          } else {
            metamaskStateStore.set(revisitingState);
          }
        }, 2000);
      }

      const result = await connect({
        connector: config.connectors[index],
      });
      console.log('Connected successfully:', result);

      const ensData = await fetchAndSetEnsData(result.account);
      const balance = await fetchBalance({ address: result.account as `0x${string}` });
      const formattedBalance = parseFloat(balance.formatted).toFixed(
        Math.min(4, (balance.formatted.split('.')[1] || '').length),
      );

      walletStore.update(state => {
        console.log('Updating store with:', state);
        console.log('updating', {
          ...state,
          address: result.account,
          chain: result.connector?.chains[0].name,
          status: 'connected',
          balance: formattedBalance + ' ' + balance.symbol,
          ...ensData,
        });
        return {
          ...state,
          address: result.account,
          chain: result.connector?.chains[0].name,
          status: 'connected',
          balance: formattedBalance + ' ' + balance.symbol,
          ...ensData,
        };
      });

      console.log('Connected walletStore:', $walletStore);

      closeModal();
    } catch (error) {
      metamaskStateStore.set(errorState);

      console.error('Error connecting:', error);
    }
  }
  function handleXButton() {
    closeModal();
    if (status !== 'connected') resetModalState();
  }
</script>

<button
  on:click={openModal}
  class="rounded-xl border border-transparent h-11 px-3 dark:text-white dark:bg-dark-button text-light-text bg-light-button hover:bg-opacity-[60%] dark:hover:bg-opacity-[95%] cursor-pointer transition-border-color duration-200 focus:outline-none"
>
  {#if $walletStore.status === 'connecting'}
    <Spinner size="16px" color={$darkMode ? '#fff' : '#000'} {connectWallet} />
  {:else if $walletStore.status === 'connected'}
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
          on:click={resetModalState}
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
        class="w-6 h-6 cursor-pointer transform transition-transform duration-300 hover:bg-light-button dark:hover:bg-[#333333] dark:text-white hover:rounded-full"
        on:click={handleXButton}
      >
        <img class="w-3 h-3 m-auto" src={xButton} alt="x-button" />
      </button>
    </div>

    {#if status === 'connecting' || isDisconnecting}
      <Spinner
        size="100px"
        color="#1A88F8"
        image={$walletStore.connector === 'Metamask' ? metamaskLogo : walletConnectLogo}
        showSpinner={$metamaskStateStore.showSpinner}
        errorCircle={$metamaskStateStore.errorCircle}
        {connectWallet}
      />

      {#if $walletStore.connector === 'Metamask'}
        <div class="mt-4 flex flex-col gap-2">
          <p class="title">{$metamaskStateStore.title}</p>
          <p class="subtitle">{$metamaskStateStore.subtitle}</p>
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
                <img class="copy w-5 h-5 cursor-pointer" src={checkIcon} alt="copied-icon" />
              {:else}
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    d="M14 9.5V7C14 5.89543 13.1046 5 12 5H7C5.89543 5 5 5.89543 5 7V12C5 13.1046 5.89543 14 7 14H9.5"
                    stroke={$darkMode ? '#fff' : '#000'}
                    stroke-width="2"
                  /><rect
                    x="10"
                    y="10"
                    width="9"
                    height="9"
                    rx="2"
                    stroke={$darkMode ? '#fff' : '#000'}
                    stroke-width="2"
                  />
                </svg>
              {/if}
            </button>
          </div>
          <p class="text-[#888] text-md">{$walletStore.balance}</p>
        </div>

        <button
          class="bg-light-button hover:bg-opacity-[60%] dark:bg-[#383838] dark:hover:bg-white dark:hover:bg-opacity-10 w-full transition duration-300 dark:text-white p-3 rounded-2xl flex items-center justify-center gap-3 font-semibold"
          on:click={handleDisconnect}
        >
          <svg
            aria-hidden="true"
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style="left: 0px; top: 0px;"
            ><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 0C1.79086 0 0 1.79086 0 4V10C0 12.2091 1.79086 14 4 14H6C6.55228 14 7 13.5523 7 13C7 12.4477 6.55228 12 6 12H4C2.89543 12 2 11.1046 2 10V4C2 2.89543 2.89543 2 4 2H6C6.55228 2 7 1.55228 7 1C7 0.447715 6.55228 0 6 0H4ZM11.7071 3.29289C11.3166 2.90237 10.6834 2.90237 10.2929 3.29289C9.90237 3.68342 9.90237 4.31658 10.2929 4.70711L11.5858 6H9.5H6C5.44772 6 5 6.44772 5 7C5 7.55228 5.44772 8 6 8H9.5H11.5858L10.2929 9.29289C9.90237 9.68342 9.90237 10.3166 10.2929 10.7071C10.6834 11.0976 11.3166 11.0976 11.7071 10.7071L14.7071 7.70711C15.0976 7.31658 15.0976 6.68342 14.7071 6.29289L11.7071 3.29289Z"
              fill={$darkMode ? '#fff' : '#000'}
              fill-opacity="0.4"
            /></svg
          >
          Disconnect
        </button>
      </div>
    {:else if dontHaveWallet}
      <GetAWallet />
    {:else if aboutWallets}
      <AboutWallets />
    {:else}
      <Connectors {config} {connectWallet} />
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
  .title {
    line-height: 20px;
    font-size: 17px;
    font-weight: 600;
  }
  .subtitle {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    color: #999;
  }
</style>
