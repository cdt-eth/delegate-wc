<script lang="ts">
  import Modal from './Modal.svelte';
  import { walletStore, disconnectWallet, initialState } from './stores/WalletStore';
  import blockie from '../assets/blockie.png';
  import metamaskLogo from '../assets/metamask.svg';
  import xButton from '../assets/icons/xButton.svg';
  import leftArrow from '../assets/icons/leftArrow.svg';
  import questionMark from '../assets/icons/questionMark.svg';
  import checkIcon from '../assets/icons/check.png';
  import { connect, Connector, getPublicClient, type ConnectArgs } from '@wagmi/core';
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
  import qrCodeUri from './stores/QrCode';
  import { fetchEnsData } from '../utils/fetchENSData';
  import { fetchWalletBalance } from '../utils/fetchWalletBalance';
  import { copyToClipboard } from '../utils/copyToClipboard';
  import { generateQRCode } from '../utils/generateQRCode';
  import { trimEthAddress } from '../utils/trimEthAddress';
  import { config } from '../utils/wagmiConfig';
  import CopyIcon from './svgs/Copy.svelte';
  import DisconnectIcon from './svgs/Disconnect.svelte';

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

  let qrCodeUrl: string = '';
  let copied = false;

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
      // updating the walletStore state
      walletStore.update(state => ({
        ...state,
        status: 'connecting',
        connector: config.connectors[index].name,
      }));

      if (config.connectors[index].name === 'Metamask') {
        setTimeout(() => {
          // after 2 seconds, check for an error state or set the revisiting state
          if ($connectRequestStore.errorCircle) {
            connectRequestStore.set(errorState);
          } else {
            connectRequestStore.set(revisitingState);
          }
        }, 2000);
      } else if (config.connectors[index].name === 'WalletConnect') {
        //  if 'WalletConnect', generate a QR code and set the uri
        await connectWalletConnect(async uri => {
          qrCodeUrl = await generateQRCode(uri);

          qrCodeUri.set(uri);
        });
      }

      // establish connection
      const result = await connect({
        connector: config.connectors[index],
      });

      const ensData = await fetchEnsData(result.account);
      const balance = await fetchWalletBalance(result.account);
      const publicClient = getPublicClient();

      // Update the walletStore state with new data after successful connection
      walletStore.update(state => {
        return {
          ...state,
          address: result.account,
          chain: publicClient.chain.name,
          chainId: publicClient.chain.id,
          status: 'connected',
          balance,
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

  // This function connects to the WalletConnect provider and handles URI creation
  async function connectWalletConnect(onUri: (uri: string) => void, chainId?: number) {
    const connector = config.connectors.find(connector => connector.name === 'WalletConnect')!;
    const options: ConnectArgs = { connector };
    if (chainId) {
      options.chainId = chainId;
    }

    // Initiate the connection and wait for both connect() and connectWalletConnectProvider() promises to resolve
    return Promise.all([connect(options), connectWalletConnectProvider(connector, onUri)]).then(
      async results => {
        // Fetch relevant data after successful connection.
        const ensData = await fetchEnsData(results[0].account);
        const balance = await fetchWalletBalance(results[0].account);
        const publicClient = getPublicClient();

        walletStore.update(state => {
          return {
            ...state,
            address: results[0].account,
            chain: publicClient.chain.name,
            chainId: publicClient.chain.id,
            status: 'connected',
            balance,
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
          on:click={() => copyToClipboard($qrCodeUri, copied)}
        >
          <CopyIcon />

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

            <NetworkSwitcher {isOpen} {toggleDropdown} />
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
              on:click={() => copyToClipboard($walletStore.address, copied)}
            >
              {#if copied}
                <img class="copy w-5 h-5 cursor-pointer" src={checkIcon} alt="copied-icon" />
              {:else}
                <CopyIcon />
              {/if}
            </button>
          </div>
          <p class="text-[#888] text-md">{$walletStore.balance}</p>
        </div>

        <button
          class="bg-light-button hover:bg-opacity-[60%] dark:bg-[#383838] dark:hover:bg-white dark:hover:bg-opacity-10 w-full transition duration-300 dark:text-white p-3 rounded-2xl flex items-center justify-center gap-3 font-semibold"
          on:click={handleDisconnect}
        >
          <DisconnectIcon />

          Disconnect
        </button>
      </div>
    {:else if dontHaveWallet}
      <GetAWallet />
    {:else if aboutWallets}
      <AboutWallets />
    {:else}
      <Connectors {connectWallet} />
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
