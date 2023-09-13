<script lang="ts">
  import { writable } from 'svelte/store';
  import { defaultState, connectRequestStore } from './stores/ConnectRequestStore';
  import { walletStore } from './stores/WalletStore';
  import { config } from '../utils/wagmiConfig';
  import RetryArrowIcon from './svgs/RetryArrow.svelte';
  import Button from './atoms/Button.svelte';

  export let size = '100px';
  export let color = '#1A88F8';
  export let image = '';
  export let showSpinner = true;
  export let errorCircle = false;
  export let connectWallet: (index: number) => void;
  export let qrCodeUrl: string;

  const hideErrorCircle = writable(false);
  const showRetryButton = writable(false);

  function handleAnimationEnd(event: { animationName: string | string[] }) {
    if (event.animationName.includes('shake')) {
      hideErrorCircle.set(true);
    }
  }

  function handleErrorFadeOut(event: { propertyName: string }) {
    if (event.propertyName === 'opacity' && $hideErrorCircle) {
      showRetryButton.set(true);
    }
  }

  function retryWalletConnectionRequest() {
    connectRequestStore.set(defaultState);
    hideErrorCircle.set(false);
    showRetryButton.set(false);
    connectWallet(
      config.connectors.findIndex(connector => connector.name === $walletStore.connector)!,
    );
  }
</script>

<div
  class={`spinner-container  ${errorCircle ? 'shake' : ''}`}
  style="--size: {size}; --color: {color};"
  on:animationend={handleAnimationEnd}
>
  {#if showSpinner}
    <div class="spinner" />
  {/if}
  {#if errorCircle}
    <div class={`error ${$hideErrorCircle ? 'hide' : ''}`} on:transitionend={handleErrorFadeOut} />
  {/if}

  {#if qrCodeUrl && $walletStore.connector !== 'Metamask'}
    <div class="border rounded-xl border-[#f7f6f8] dark:border-[#383838]">
      <img class="qrCode rounded-xl" src={qrCodeUrl} alt="WalletConnect QR Code" />
    </div>
  {/if}

  {#if image}
    <img src={image} class="image" alt="" />

    {#if $showRetryButton}
      <div class="retryButton absolute bottom-0 right-0">
        <button
          on:click={retryWalletConnectionRequest}
          class="flex items-center gap-1 bg-black border border-black dark:bg-[#333333] -mr-6 rounded-full shadow"
        >
          <RetryArrowIcon />
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .shadow {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 6px;
  }
  .spinner-container {
    position: relative;
    width: var(--size);
    height: var(--size);
    margin: auto;
  }
  :is(.spinner, .error) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
  .spinner {
    border: 2px solid var(--color);
    border-top: 2px solid transparent;
    animation: spin 1s linear infinite;
  }
  .error {
    border: 3px solid red;
    transition: opacity 0.5s ease-out;
  }
  .spinner-container.shake {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  .image {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 75%;
    height: 75%;
  }
  .retryButton {
    margin-bottom: 10px;
    margin-right: 25px;
  }
  .hide {
    opacity: 0;
  }
  .qrCode {
    width: 100%;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes shake {
    10%,
    90% {
      transform: translateX(-1px);
    }

    20%,
    80% {
      transform: translateX(2px);
    }

    30%,
    50%,
    70% {
      transform: translateX(-2px);
    }

    40%,
    60% {
      transform: translateX(2px);
    }
  }
</style>
