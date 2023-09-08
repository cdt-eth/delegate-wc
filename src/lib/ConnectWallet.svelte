<script lang="ts">
  import Modal from './Modal.svelte';
  import { walletStore, disconnectWallet, initialState } from './stores/WalletStore';
  import blockie from '../assets/blockie.png';
  import metamaskLogo from '../assets/metamask.svg';
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
    Connector,
    type ConnectArgs,
    getPublicClient,
  } from '@wagmi/core';
  import type { FallbackTransport } from 'viem';
  import ConnectionRequest from './ConnectionRequest.svelte';
  import Connectors from './Connectors.svelte';
  import NetworkSwitcher from './NetworkSwitcher.svelte';
  import DontHaveWallet from './DontHaveWallet.svelte';
  import GetAWallet from './GetAWallet.svelte';
  import AboutWallets from './AboutWallets.svelte';
  import { darkMode } from './stores/DarkModeStore';
  import {
    defaultState,
    errorState,
    connectRequestStore,
    revisitingState,
  } from './stores/ConnectRequestStore';
  import QRCode from 'qrcode';
  import qrCodeUri from './stores/QrCode';

  export let qrCodeUrl = '';
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
    connectRequestStore.set(defaultState);
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
          if ($connectRequestStore.errorCircle) {
            connectRequestStore.set(errorState);
          } else {
            connectRequestStore.set(revisitingState);
          }
        }, 2000);
      } else if (config.connectors[index].name === 'WalletConnect') {
        await connectWalletConnect(async uri => {
          await generateQRCode(uri);
          qrCodeUri.set(uri);
        });
      }

      const result = await connect({
        connector: config.connectors[index],
      });
      console.log('Connected successfully:', result);

      const ensData = await fetchAndSetEnsData(result.account);
      const balance = await fetchBalance({ address: result.account as `0x${string}` });
      const formattedBalance = await parseFloat(balance.formatted).toFixed(
        Math.max(2, Math.min(4, (balance.formatted.split('.')[1] || '').length)),
      );
      const publicClient = getPublicClient();

      walletStore.update(state => {
        return {
          ...state,
          address: result.account,
          chain: publicClient.chain.name,
          chainId: publicClient.chain.id,
          status: 'connected',
          balance: formattedBalance + ' ' + balance.symbol,
          provider: publicClient,
          ...ensData,
        };
      });

      closeModal();
    } catch (error) {
      connectRequestStore.set(errorState);

      console.error('Error connecting:', error);
    }
  }
  async function generateQRCode(uri: string) {
    try {
      qrCodeUrl = await QRCode.toDataURL(uri, {
        color: {
          dark: $darkMode ? '#ffffff' : '#2B2B2B',
          light: $darkMode ? '#2B2B2B' : '#ffffff',
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function connectWalletConnect(onUri: (uri: string) => void, chainId?: number) {
    const connector = config.connectors.find(connector => connector.name === 'WalletConnect')!;
    const options: ConnectArgs = { connector };
    if (chainId) {
      options.chainId = chainId;
    }

    return Promise.all([connect(options), connectWalletConnectProvider(connector, onUri)]).then(
      async results => {
        const ensData = await fetchAndSetEnsData(results[0].account);
        const balance = await fetchBalance({ address: results[0].account as `0x${string}` });
        const formattedBalance = await parseFloat(balance.formatted).toFixed(
          Math.max(2, Math.min(4, (balance.formatted.split('.')[1] || '').length)),
        );
        const publicClient = getPublicClient();

        walletStore.update(state => {
          return {
            ...state,
            address: results[0].account,
            chain: publicClient.chain.name,
            chainId: publicClient.chain.id,
            status: 'connected',
            balance: formattedBalance + ' ' + balance.symbol,
            provider: publicClient,
            ...ensData,
          };
        });

        closeModal();
        return results;
      },
    );
  }

  async function connectWalletConnectProvider(connector: Connector, onUri: (uri: string) => void) {
    await connector.getProvider();

    return new Promise<void>(resolve => {
      connector.once('message', event => {
        if (event.type === 'display_uri') {
          onUri(event.data as string);
          resolve();
        }
      });
    });
  }

  function handleXButton() {
    closeModal();
    if (status !== 'connected') resetModalState();
    isOpen = false;
  }

  let isOpen: boolean = false;

  function toggleDropdown(): void {
    isOpen = !isOpen;
  }
</script>

<button
  on:click={openModal}
  class="rounded-xl border border-transparent h-11 px-3 dark:text-white dark:bg-dark-button text-light-text bg-light-button hover:bg-opacity-[60%] dark:hover:bg-opacity-[95%] cursor-pointer transition-border-color duration-200 focus:outline-none"
>
  {#if $walletStore.status === 'connecting'}
    <ConnectionRequest
      size="16px"
      color={$darkMode ? '#fff' : '#000'}
      {connectWallet}
      {config}
      {qrCodeUrl}
    />
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

<Modal {showModal} on:close={handleXButton}>
  <div class="dark:text-white">
    <div class="flex items-center justify-between mb-6">
      {#if dontHaveWallet || aboutWallets || $walletStore.status === 'connecting'}
        <button
          class="dark:text-white w-6 h-6 cursor-pointer transform transition-transform duration-300 hover:bg-light-button dark:hover:bg-[#333333] hover:rounded-full"
          on:click={resetModalState}
        >
          <img class="w-3 h-3 m-auto" src={leftArrow} alt="x-button" />
        </button>
      {:else if $walletStore.status !== 'connected'}
        <button
          class="dark:text-white w-6 h-6 cursor-pointer transform transition-transform duration-300 hover:bg-light-button dark:hover:bg-[#333333] hover:rounded-full"
          on:click={handleAboutWallets}
        >
          <img class="w-[18px] h-[18px] m-auto" src={questionMark} alt="x-button" />
        </button>
      {:else}
        <div class="w-6" />
      {/if}
      <h2 class="text-xl font-semibold">
        {status === 'connecting'
          ? $walletStore.connector === 'Metamask'
            ? 'Connect to Metamask'
            : 'Scan with Phone'
          : dontHaveWallet
          ? 'Get A Wallet'
          : $walletStore.status === 'connected'
          ? 'Connected'
          : 'Connect Wallet'}
      </h2>

      <button
        class="w-6 h-6 cursor-pointer transform transition-transform duration-300 hover:bg-light-button dark:hover:bg-[#333333] dark:text-white hover:rounded-full"
        on:click={handleXButton}
      >
        <img class="w-3 h-3 m-auto" src={xButton} alt="x-button" />
      </button>
    </div>

    {#if status === 'connecting'}
      <ConnectionRequest
        size={$walletStore.connector === 'Metamask' ? '100px' : '100%'}
        color="#1A88F8"
        image={$walletStore.connector === 'Metamask' ? metamaskLogo : undefined}
        showSpinner={$walletStore.connector === 'Metamask' && $connectRequestStore.showSpinner}
        errorCircle={$connectRequestStore.errorCircle}
        {connectWallet}
        {config}
        {qrCodeUrl}
      />
      {#if $walletStore.connector === 'Metamask'}
        <div class="mt-4 flex flex-col gap-2">
          <p class="title">{$connectRequestStore.title}</p>
          <p class="subtitle">{$connectRequestStore.subtitle}</p>
        </div>
      {:else}
        <div class="mt-4 flex flex-col gap-2">
          <div
            class={`button-switcher ${
              $darkMode ? 'darkMode' : ''
            } before:bg-[#f7f6f8] before:dark:bg-[#383838]`}
          >
            <span class="bg-white dark:bg-[#2B2B2B] px-3.5 z-10"> or </span>
          </div>
        </div>

        <button
          class="bg-light-button mt-3 hover:bg-opacity-[60%] dark:bg-[#383838] dark:hover:bg-white dark:hover:bg-opacity-10 w-full transition duration-300 dark:text-white p-3 rounded-2xl flex items-center justify-center gap-1 font-semibold"
          on:click={() => copyToClipboard($qrCodeUri)}
        >
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              d="M14 9.5V7C14 5.89543 13.1046 5 12 5H7C5.89543 5 5 5.89543 5 7V12C5 13.1046 5.89543 14 7 14H9.5"
              stroke={$darkMode ? '#fff' : '#999'}
              stroke-width="2"
            /><rect
              x="10"
              y="10"
              width="9"
              height="9"
              rx="2"
              stroke={$darkMode ? '#fff' : '#999'}
              stroke-width="2"
            />
          </svg>
          Copy to Clipboard
        </button>
      {/if}
    {:else if status !== 'disconnected'}
      <div class="flex flex-col gap-6">
        <div class="w-max m-auto">
          <div class="flex items-center relative">
            <img
              class="rounded-full h-24 w-24 m-auto"
              src={$walletStore.avatarUrl || blockie}
              alt="avatar"
            />

            <NetworkSwitcher {config} {isOpen} {toggleDropdown} />
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
  .button-switcher {
    position: relative;
    top: -1px;
    display: flex;
    justify-content: center;
    pointer-events: auto;
    z-index: 3;
  }

  .button-switcher::before {
    z-index: 1;
    content: '';
    position: absolute;
    top: 50%;
    left: 0px;
    right: 0px;
    height: 1px;
    transform: translateY(-1px);
  }
</style>
